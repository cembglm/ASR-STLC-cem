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