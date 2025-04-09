"""
database.py
-----------
MongoDB bağlantısını ve temel veritabanı işlemlerini yönetir.
Örneğin, koleksiyonlara erişim, CRUD işlemleri gibi fonksiyonları burada tanımlayabilirsiniz.
"""

import logging
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import certifi
import os

# Logger settings
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def get_db():
    """
    Returns a synchronous MongoDB database connection
    """
    try:
        logger.info(f"Connecting to MongoDB (sync): {MONGO_URI}")
        client = MongoClient(MONGO_URI, 
                           tlsCAFile=certifi.where(),
                           serverSelectionTimeoutMS=5000)
        # Test the connection
        client.server_info()
        db = client[DATABASE_NAME]
        logger.info("MongoDB sync connection successful")
        return db
    except Exception as e:
        logger.error(f"MongoDB sync connection failed: {str(e)}")
        raise

MONGO_URI = "mongodb://localhost:27017"
DATABASE_NAME = "stlc_database"

async def get_database():
    try:
        print("MongoDB URI:", MONGO_URI)
        logger.info(f"Connecting to MongoDB (async): {MONGO_URI}")
        client = AsyncIOMotorClient(
            MONGO_URI,
            serverSelectionTimeoutMS=5000
        )
        await client.list_database_names()
        db = client[DATABASE_NAME]
        logger.info("MongoDB async connection successful")
        return db
    except Exception as e:
        logger.error(f"MongoDB async connection failed: {str(e)}")
        raise