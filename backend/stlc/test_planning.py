"""
test_planning.py
----------------
STLC'nin Test Planning adımına ait işlemleri yönetir.
"""

import logging
import os
from core.file_handler import extract_text
from utils.text_splitter import split_text_into_chunks
from core.prompt_manager import get_prompts_for_step
from backend.utils.model_client import get_llm_instance
from utils.validation import validate_output_format
from fastapi import UploadFile
from io import BytesIO

# Logger ayarları
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.DEBUG,  # Daha fazla detay için DEBUG
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

async def run_step(input_data):
    logger.info("Test Planning adımı başlatıldı")
    logger.debug(f"Input data: {input_data}")
    
    try:
        # 1. Dosya yolunu al
        file_paths = input_data.get("files", [])
        logger.debug(f"File paths received: {file_paths}")
        if not file_paths or not isinstance(file_paths, list):
            logger.error("Geçersiz veya eksik dosya yolları")
            return {"step": "testPlanning", "error": "Dosya yolları belirtilmedi veya geçersiz"}
        
        file_path = file_paths[0]  # İlk dosyayı işleyeceğiz
        logger.info(f"İşlenecek dosya: {file_path}")

        # 2. Metni çıkar
        with open(file_path, "rb") as f:
            content = f.read()
            logger.debug(f"File content length: {len(content)} bytes")
            if not content:
                logger.error(f"Dosya boş: {file_path}")
                return {"step": "testPlanning", "error": "Dosya boş"}
            upload_file = UploadFile(filename=os.path.basename(file_path), file=BytesIO(content))
            text = extract_text(upload_file)
            logger.debug(f"Extracted text: {text[:50] if text else 'None'}...")
        
        if not text:
            logger.error(f"Dosyadan metin çıkarılamadı: {file_path}")
            return {"step": "testPlanning", "error": "Dosyadan metin çıkarılamadı"}
        logger.info("Metin başarıyla çıkarıldı")

        # 3. Prompt’ları MongoDB’den al
        prompts = get_prompts_for_step("test_planning")
        logger.debug(f"Prompts from MongoDB: {prompts}")
        system_prompt = prompts.get("system_prompt", "Sen bir test planlama uzmanısın.")
        query_str = prompts.get("query_str", "Gereksinimlere dayanarak bir test planı oluştur.")
        logger.info("Prompt’lar başarıyla alındı")

        # 4. Metni parçalara ayır
        chunks = split_text_into_chunks(text, base_chunk_size=1000, overlap=100, llm_token_limit=4096)
        logger.info(f"Metin {len(chunks)} parçaya ayrıldı")
        logger.debug(f"Chunks: {[chunk[:50] + '...' for chunk in chunks]}")
        
        text_to_process = chunks[0] if chunks else ""
        if not text_to_process:
            logger.error("İşlenecek metin parçası bulunamadı")
            return {"step": "testPlanning", "error": "Metin parçası bulunamadı"}
        logger.debug(f"Text to process: {text_to_process[:50]}...")

        # 5. LLM ile test planı oluştur
        logger.info("Initializing LLM instance")
        llm = get_llm_instance(temperature=0.7)
        full_prompt = f"{system_prompt}\n\n{query_str}\n\nMetin:\n{text_to_process}"
        logger.debug(f"LLM prompt: {full_prompt[:100]}...")
        response = llm.invoke(full_prompt)
        logger.info("LLM’den test planı alındı")
        logger.debug(f"LLM response: {str(response)[:100]}...")

        # 6. Çıktıyı doğrula
        schema = {
            "type": "object",
            "properties": {
                "test_plan": {"type": "string"},
                "priority": {"type": "string"},
                "estimated_time": {"type": "string"}
            },
            "required": ["test_plan"]
        }
        logger.debug(f"Validation schema: {schema}")
        is_valid, message = validate_output_format({"test_plan": str(response)}, schema)
        if not is_valid:
            logger.error(f"Çıktı doğrulama hatası: {message}")
            return {"step": "testPlanning", "error": f"Çıktı doğrulama hatası: {message}"}
        logger.info("Çıktı başarıyla doğrulandı")

        # 7. Sonucu dön
        result = {
            "step": "testPlanning",
            "result": str(response)
        }
        logger.info("Test planı başarıyla oluşturuldu")
        logger.debug(f"Returning result: {result}")
        return result

    except FileNotFoundError as e:
        logger.error(f"Dosya bulunamadı: {str(e)}")
        return {"step": "testPlanning", "error": f"Dosya bulunamadı: {str(e)}"}
    except Exception as e:
        logger.error(f"Test planlama sırasında hata: {str(e)}", exc_info=True)
        return {"step": "testPlanning", "error": f"Test planlama hatası: {str(e)}"}