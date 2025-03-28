import logging
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Logger ayarları
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def count_tokens(text: str) -> int:
    """
    Metindeki token sayısını basit bir şekilde hesaplar (kelime bazında).
    :param text: Token sayısı hesaplanacak metin.
    :return: Token sayısı.
    """
    return len(text.split())

def split_text_into_chunks(text: str, base_chunk_size: int = 1000, overlap: int = 100, llm_token_limit: int = 4096, min_chunk_size: int = 500) -> list:
    """
    Metni belirtilen base_chunk_size'a göre parçalara ayırır ve her parça arasında overlap kadar örtüşme sağlar.
    Eğer metin token sayısı llm_token_limit'i (4096) aşmıyorsa tek parça döndürür, aksi halde chunk_size dinamik olarak küçültülür.
    
    :param text: Bölünecek metin.
    :param base_chunk_size: Temel parça boyutu (varsayılan: 1000 karakter).
    :param overlap: Parçalar arasındaki örtüşme karakter sayısı (varsayılan: 100).
    :param llm_token_limit: LLM'in maksimum token limiti (sabit: 4096).
    :param min_chunk_size: Minimum parça boyutu (varsayılan: 500 karakter).
    :return: Parçalara ayrılmış metin listesi.
    :raises TypeError: text parametresi string değilse.
    :raises ValueError: parametreler geçersizse.
    """
    # İşlem başlangıcını logla
    logger.info(f"Metin bölme işlemi başlatıldı. base_chunk_size: {base_chunk_size}, overlap: {overlap}, metin uzunluğu: {len(text)}")
    
    # Metin türü kontrolü
    if not isinstance(text, str):
        logger.error("text parametresi bir string olmalıdır.")
        raise TypeError("text parametresi bir string olmalıdır.")
    
    # Parametre kontrolleri
    if not isinstance(base_chunk_size, int) or base_chunk_size <= 0:
        logger.error("base_chunk_size pozitif bir tam sayı olmalıdır.")
        raise ValueError("base_chunk_size pozitif bir tam sayı olmalıdır.")
    if not isinstance(overlap, int) or overlap < 0:
        logger.error("overlap negatif olamaz.")
        raise ValueError("overlap negatif olamaz.")
    if overlap >= base_chunk_size:
        logger.error("overlap, base_chunk_size'dan büyük veya eşit olamaz.")
        raise ValueError("overlap, base_chunk_size'dan büyük veya eşit olamaz.")

    # Boş metin kontrolü
    if not text.strip():
        logger.info("Boş metin girildi, boş liste döndürülüyor.")
        return []

    # Token sayımı
    token_count = count_tokens(text)
    logger.info(f"Metin token sayısı: {token_count}")

    # Eğer token sayısı llm_token_limit'ten küçükse, metni tek parça olarak döndür
    if token_count <= llm_token_limit:
        logger.info("Metin token sayısı limiti aşmıyor, tek parça olarak döndürülüyor.")
        return [text]
    
    # Dinamik chunk_size ayarı
    factor = token_count / llm_token_limit
    chunk_size = max(int(base_chunk_size / factor), min_chunk_size)
    logger.info(f"chunk_size dinamik olarak ayarlandı: {base_chunk_size} -> {chunk_size} (token sayısı: {token_count})")

    # RecursiveCharacterTextSplitter ile anlamlı bölme
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=overlap)
    chunks = text_splitter.split_text(text)
    
    # İşlem sonucunu logla
    logger.info(f"Metin {len(chunks)} parçaya bölündü.")
    return chunks