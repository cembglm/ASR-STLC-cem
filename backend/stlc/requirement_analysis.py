from fastapi import HTTPException
import requests
from pymongo import MongoClient
from datetime import datetime
import json
import uuid
import os
import logging
import certifi

logger = logging.getLogger("requirement_analysis")
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

MONGO_URI = "mongodb+srv://wicklash77:1234@cluster0.z3ubb.mongodb.net/requirement_analysis_db?retryWrites=true&w=majority&tls=true"
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where(), connectTimeoutMS=30000, socketTimeoutMS=30000)
db = client["requirement_analysis_db"]
analysis_collection = db["analysis_results"]
prompts_collection = db["prompts"]

LM_STUDIO_API_URL = "http://192.168.88.100:1234/v1"
MODEL_NAME = "llama-3.2-3b-instruct"

async def get_prompt(prompt_title):
    query = {"title": prompt_title}
    prompt_doc = prompts_collection.find_one(query)
    if prompt_doc and "prompt" in prompt_doc:
        logger.info(f"Prompt '{prompt_title}' MongoDB'den çekildi")
        return prompt_doc["prompt"]
    return None

def format_raw_result_to_markdown(raw_result):
    logger.info(f"Raw result içeriği: {repr(raw_result)}")
    if not isinstance(raw_result, str):
        raw_result = str(raw_result)
    
    try:
        if raw_result.strip().startswith('[') and raw_result.strip().endswith(']'):
            analysis_data = json.loads(raw_result)
            markdown_output = "# Analysis Summary\n\n"
            for item in analysis_data:
                param = item['evaluation_parameter'].split('_')[-1].title()
                markdown_output += f"#### {param}\n"
                markdown_output += f"- **Score**: {item['score']}\n"
                markdown_output += f"- {item['analysis'][:100]}... [Read more]\n\n"
            return markdown_output
        else:
            raise json.JSONDecodeError("Not a valid JSON array", raw_result, 0)
    except json.JSONDecodeError as e:
        logger.error(f"Raw result JSON formatında değil veya ayrıştırılamadı: {e}")
        markdown_output = "# Analysis Summary\n\n"
        markdown_output += "## Analysis Output\n"
        markdown_output += f"{raw_result.strip()}\n"
        return markdown_output

async def run_step(data):
    try:
        file_content = ""
        session_id = ""
        custom_prompt = None

        if "files" in data and data["files"]:
            with open(data["files"][0], "r", encoding="utf-8") as file:
                file_content = file.read()
            logger.info(f"Dosya yüklendi: {len(file_content)} karakter")
        else:
            logger.warning("Dosya bulunamadı")
            raise ValueError("Dosya bulunamadı. Lütfen bir dosya yükleyin.")

        session_id = data.get("session_id", f"session_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}")
        custom_prompt = data.get("custom_prompt")

        if not custom_prompt:
            prompt_title = "ISTQB Requirement Document Analysis Prompt"
            prompt_text = await get_prompt(prompt_title) or """Analyze the following requirement document content. 
            Identify issues like ambiguity, incompleteness, inconsistency, and provide suggestions for improvement."""
        else:
            prompt_text = custom_prompt

        full_prompt = f"{prompt_text}\n\nDosya içeriği:\n{file_content}"
        logger.info("Analiz prompt'u hazırlandı")

        payload = {
            "model": MODEL_NAME,
            "messages": [{"role": "user", "content": full_prompt}],
            "temperature": 0.2,
            "max_tokens": 4096
        }

        logger.info("LM Studio API'ye istek gönderiliyor")
        try:
            response = requests.post(
                LM_STUDIO_API_URL + "/chat/completions",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response.raise_for_status()
            full_api_response = response.json()
            logger.info("LM Studio API'den yanıt alındı")
        except requests.RequestException as e:
            logger.error(f"LM Studio API hatası: {str(e)}")
            raise ValueError(f"LM Studio'ya bağlanılamadı: {str(e)}")

        if "choices" in full_api_response and len(full_api_response["choices"]) > 0:
            raw_result = full_api_response["choices"][0]["message"]["content"]
        elif "content" in full_api_response:
            raw_result = full_api_response["content"]
        else:
            logger.error(f"Beklenmeyen yanıt yapısı: {json.dumps(full_api_response, indent=2)}")
            raise ValueError("LM Studio'dan beklenmeyen yanıt yapısı alındı")

        analysis_data = {
            "session_id": session_id,
            "raw_result": raw_result,
            "timestamp": datetime.utcnow(),
            "full_api_response": full_api_response
        }
        result = analysis_collection.insert_one(analysis_data)
        logger.info(f"Analiz sonucu MongoDB'ye kaydedildi: {result.inserted_id}")

        formatted_result = format_raw_result_to_markdown(raw_result)
        return formatted_result

    except ValueError as e:
        logger.error(f"Değer hatası: {str(e)}")
        raise ValueError(str(e))
    except Exception as e:
        logger.error(f"Beklenmeyen hata: {str(e)}")
        raise ValueError(f"Analiz sırasında hata: {str(e)}")