"""
config.py
---------
Uygulamanın yapılandırma ayarlarını yönetir. Örneğin, veritabanı bağlantı bilgileri,
model API endpoint’leri, environment değişkenleri gibi bilgiler burada tutulabilir.
"""

import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MODEL_API_BASE_URL = os.getenv("MODEL_API_BASE_URL", "http://localhost:1234")
MODEL_IDENTIFIER = os.getenv("MODEL_IDENTIFIER", "llama-3.2-3b-instruct")
