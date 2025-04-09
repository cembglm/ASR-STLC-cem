"""
prompt_manager.py
-----------------
Her STLC adımı için MongoDB'den system prompt ve query_str gibi verileri çekmeye yarar.
Ayrıca structured_output formatı gibi ilave bilgileri de buradan alabilirsiniz.
"""

import logging
from core.database import get_db

# Logger ayarları
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def get_prompts_for_step(step_name: str):
    """
    Belirtilen STLC adımı için MongoDB'den prompt bilgilerini çeker.
    
    :param step_name: STLC adımı (örneğin, "test_planning").
    :return: system_prompt, query_str ve structured_output_schema içeren bir sözlük.
    """
    logger.info(f"{step_name} adımı için prompt bilgileri çekiliyor.")
    
    try:
        db = get_db()
        collection = db["test_scenario_generation_prompts"]  # Koleksiyon adı
        document = collection.find_one({"step": step_name})
        
        if document:
            logger.info(f"{step_name} adımı için prompt bilgileri bulundu.")
            return {
                "system_prompt": document.get("system_prompt", ""),
                "query_str": document.get("query_str", ""),
                "structured_output_schema": document.get("structured_output_schema", {})
            }
        else:
            logger.warning(f"{step_name} adımı için prompt bilgileri bulunamadı.")
            return {}
    except Exception as e:
        logger.error(f"Prompt bilgileri çekilirken hata oluştu: {str(e)}")
        return {}