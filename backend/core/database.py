"""
database.py
-----------
MongoDB bağlantısını ve temel veritabanı işlemlerini yönetir.
Örneğin, koleksiyonlara erişim, CRUD işlemleri gibi fonksiyonları burada tanımlayabilirsiniz.
"""

import logging
import pymongo
from pymongo import MongoClient
from config import MONGO_URI

# Logger ayarları
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def get_db():
    """
    MongoDB bağlantısını kurar ve belirtilen veritabanını döner.
    
    :return: MongoDB veritabanı nesnesi.
    """
    try:
        logger.info(f"MongoDB'ye bağlanılıyor: {MONGO_URI}")
        client = MongoClient(MONGO_URI)
        db = client["stlc_database"]  # Veritabanı adı
        logger.info("MongoDB bağlantısı başarılı.")
        return db
    except Exception as e:
        logger.error(f"MongoDB bağlantısı başarısız: {str(e)}")
        raise