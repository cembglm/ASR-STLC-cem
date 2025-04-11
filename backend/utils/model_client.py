"""
model_client.py
---------------
LLM (Large Language Model) çağrılarını yöneten katman.
Örneğin, ChatOpenAI gibi modelleri buradan çağırabilirsiniz.
"""

import logging
from langchain_openai import ChatOpenAI
from config import MODEL_API_BASE_URL, MODEL_IDENTIFIER

# Logger ayarları (hataları ve bilgileri takip etmek için)
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def get_llm_instance(temperature: float = 0.7):
    """
    LLM nesnesini oluşturur ve bağlantıyı test eder.
    
    :param temperature: Modelin yaratıcılık seviyesi (varsayılan: 0.7).
    :return: ChatOpenAI nesnesi.
    :raises ValueError: Yapılandırma hataları için.
    :raises ConnectionError: Bağlantı hataları için.
    """
    # 1. Yapılandırma kontrolü
    if not MODEL_API_BASE_URL:
        logger.error("MODEL_API_BASE_URL boş olamaz.")
        raise ValueError("MODEL_API_BASE_URL yapılandırması eksik.")
    if not MODEL_IDENTIFIER:
        logger.error("MODEL_IDENTIFIER boş olamaz.")
        raise ValueError("MODEL_IDENTIFIER yapılandırması eksik.")
    
    # 2. Model nesnesi oluşturma ve hata yakalama
    try:
        logger.info(f"LLM nesnesi oluşturuluyor: {MODEL_IDENTIFIER} @ {MODEL_API_BASE_URL}")
        llm = ChatOpenAI(
            model_name=MODEL_IDENTIFIER,
            openai_api_base=MODEL_API_BASE_URL,
            openai_api_key="not-needed",  # Gerekirse environment'tan çekilebilir
            temperature=temperature
        )
        
        # 3. Bağlantıyı test etme
        logger.debug(f"LLM’e gönderilen test sorgusu: Merhaba, bu bir test sorgusudur.")
        test_response = llm.invoke("Merhaba, bu bir test sorgusudur.")
        logger.debug(f"LLM’den alınan yanıt: {test_response}")
        if test_response:
            logger.info("LLM bağlantısı başarılı.")
        else:
            logger.warning("LLM'den yanıt alınamadı.")
        
        return llm
    except Exception as e:
        logger.error(f"LLM nesnesi oluşturulurken hata: {str(e)}")
        raise ConnectionError(f"LLM sunucusuna bağlanılamadı: {str(e)}")

import requests
import logging

class LLMClient:
    def __init__(self, model_name=None):
        self.api_url = "http://localhost:1234/v1"
        # Default model kullan veya parametre olarak verilen modeli al
        self.model_name = model_name if model_name else "llama-3.2-1b-instruct"
        self.logger = logging.getLogger("LLMClient")
        self.logger.info(f"LLMClient initialized with model: {self.model_name}")
        
    def get_model_identifier(self, model_key):
        """Frontend'den gelen model anahtarına göre gerçek model identifier'ını döndürür"""
        self.logger.info(f"Getting model identifier for key: {model_key}")
        if not model_key or not isinstance(model_key, str):
            self.logger.warning(f"Invalid model_key: {model_key}, using default model")
            return "llama-3.2-1b-instruct"  # Default model
            
        model_mapping = {
        "codegeex4:9b": "codegeex4-all-9b",
        "codellama:7b": "codellama-7b-instruct",
        "deepseek-coder: 6.7B": "deepseek-coder-6.7b-instruct",
        "gemma2:2b": "gemma-2-2b-it",
        "gemma3:4b": "gemma-3-4b-it",
        "llama3.2:3b": "llama-3.2-3b-instruct",
        "mistral:7b": "mistral-7b-instruct-v0.3",
        "qwen2.5:7b": "qwen2.5-7b-instruct-1m",
        "qwen2.5-coder:3b": "qwen2.5-coder-3b-instruct",
        "stable-code:3b": "stable-code-instruct-3b",
        "starcoder2:7b": "starcoder2-7b"
        }

        
        model_id = model_mapping.get(model_key, None)
        self.logger.info(f"Model id: {model_id}")
        self.logger.info(f"Model mapping: {model_mapping}")
        if not model_id:
            self.logger.warning(f"Unknown model_key: {model_key}, using default model")
            return "llama-3.2-1b-instruct"  # Default model
            
        self.logger.info(f"Selected model: {model_key} -> {model_id}")
        return model_id

    async def generate_response(self, prompt, temperature=0.7, max_tokens=4096):
        """LLM API çağrısı yapan temel metod"""
        payload = {
            "model": self.model_name,
            "messages": [{"role": "system", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        try:
            self.logger.debug(f"Sending request to LLM API with model: {self.model_name}")
            response = requests.post(f"{self.api_url}/chat/completions", json=payload)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except requests.RequestException as e:
            self.logger.error(f"LLM API Error: {str(e)}")
            raise
