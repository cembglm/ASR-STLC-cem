"""
validation.py
-------------
LLM çıktısının (structured_output) belirli bir formata uygunluğunu kontrol eden fonksiyonları içerir.
"""

def validate_output_format(data, schema):
    """
    Veriyi belirtilen şemaya göre doğrular.
    
    :param data: LLM'den gelen sonuç (dictionary).
    :param schema: Beklenen JSON şeması veya benzeri bir yapı (dictionary).
    :return: (bool, str): Doğrulama sonucu ve mesaj.
    """
    # Şemanın türü "object" değilse hata döndür
    if schema.get("type") != "object":
        return False, "Only object type is supported"

    # Gelen veri bir sözlük (dictionary) değilse hata döndür
    if not isinstance(data, dict):
        return False, "Data is not a dictionary"

    # Şemadaki her bir özellik (property) için kontrol yap
    for key, value_schema in schema.get("properties", {}).items():
        # Anahtar veride mevcutsa tipi kontrol et
        if key in data:
            value = data[key]
            expected_type = value_schema.get("type")
            
            if expected_type == "string" and not isinstance(value, str):
                return False, f"{key} should be a string"
            elif expected_type == "integer" and not isinstance(value, int):
                return False, f"{key} should be an integer"
            # İhtiyaca göre diğer tipler (örneğin, "list", "boolean") eklenebilir
        # Anahtar veride yoksa ve zorunluysa hata döndür
        elif key in schema.get("required", []):
            return False, f"Missing required key: {key}"

    # Tüm kontroller başarılıysa doğrulama geçerli
    return True, "Validation successful"