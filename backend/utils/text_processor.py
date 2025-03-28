import logging
from langchain.text_splitter import RecursiveCharacterTextSplitter

class TextProcessor:
    def count_tokens(self, text: str) -> int:
        return len(text.split())

    def split_text_into_chunks(self, text: str, base_chunk_size: int = 1000, overlap: int = 100, llm_token_limit: int = 4096, min_chunk_size: int = 500) -> list:
        logger = logging.getLogger(__name__)
        logger.info(f"Metin bölme işlemi başlatıldı. base_chunk_size: {base_chunk_size}, overlap: {overlap}, metin uzunluğu: {len(text)}")
        
        if not isinstance(text, str):
            logger.error("text parametresi bir string olmalıdır.")
            raise TypeError("text parametresi bir string olmalıdır.")

        token_count = self.count_tokens(text)
        logger.info(f"Metin token sayısı: {token_count}")

        if token_count <= llm_token_limit:
            logger.info("Metin token sayısı limiti aşmıyor, tek parça olarak döndürülüyor.")
            return [text]

        factor = token_count / llm_token_limit
        chunk_size = max(int(base_chunk_size / factor), min_chunk_size)
        logger.info(f"chunk_size dinamik olarak ayarlandı: {base_chunk_size} -> {chunk_size} (token sayısı: {token_count})")

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=overlap)
        chunks = text_splitter.split_text(text)
        logger.info(f"Metin {len(chunks)} parçaya bölündü.")
        return chunks
