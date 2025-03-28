"""
file_handler.py
---------------
Ortak dosya yükleme ve metin çıkarma işlemlerini içerir.
PDF, DOCX, TXT gibi farklı dosya formatlarından metin çıkarma fonksiyonları bu modülde yer alır.
"""

import os
from io import BytesIO
from fastapi import UploadFile
from PyPDF2 import PdfReader
import docx
import logging

# Logging ayarları
logging.basicConfig(level=logging.INFO)  # Hata ve bilgi mesajlarını göster
logger = logging.getLogger(__name__)     # Günlükleme için logger nesnesi

def extract_text_from_pdf(file_stream: BytesIO) -> str:
    """PDF dosyasından metin çıkarır."""
    try:
        text = ""
        reader = PdfReader(file_stream)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        logger.error(f"PDF okuma hatası: {str(e)}")  # Hata mesajını logla
        return None  # Hata varsa None döndür

def extract_text_from_docx(file_stream: BytesIO) -> str:
    """DOCX dosyasından metin çıkarır."""
    try:
        doc = docx.Document(file_stream)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        logger.error(f"DOCX okuma hatası: {str(e)}")
        return None

def extract_text_from_txt(file_stream: BytesIO) -> str:
    """TXT dosyasından metin çıkarır."""
    try:
        return file_stream.read().decode('utf-8')
    except Exception as e:
        logger.error(f"TXT okuma hatası: {str(e)}")
        return None

def extract_text(upload_file: UploadFile) -> str:
    """Yüklenen dosyadan türüne göre metin çıkarır."""
    ext = os.path.splitext(upload_file.filename)[1].lower()  # Dosya uzantısını al
    try:
        content = upload_file.file.read()  # Dosyanın içeriğini oku
        upload_file.file.seek(0)  # Okuma işaretçisini başa al
        if ext == ".pdf":
            result = extract_text_from_pdf(BytesIO(content))
        elif ext == ".docx":
            result = extract_text_from_docx(BytesIO(content))
        elif ext == ".txt":
            result = extract_text_from_txt(BytesIO(content))
        else:
            logger.warning(f"Desteklenmeyen dosya türü: {ext}")  # Uyarı logla
            return None
        if result is None:
            raise ValueError(f"{ext.upper()} dosyasından metin çıkarılamadı.")
        return result
    except Exception as e:
        logger.error(f"Dosya işleme hatası: {str(e)}")
        return None