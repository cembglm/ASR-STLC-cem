"""
pipeline_controller.py
----------------------
UI'den gelen checkbox veya seçim bilgilerine göre hangi STLC adımlarının çalıştırılacağını belirler.
Bu adımların sıralamasını ve gerekli konfigürasyonu oluşturur.
"""

from typing import List

def determine_pipeline(steps_selected: List[str]) -> List[str]:
    """
    steps_selected: UI'den gelen, seçilen STLC adımlarını içeren liste.
    return: Ardışık çalıştırılacak adımların doğru sıralaması.
    """
    # Burada adımların önceliğini, zorunlu bağımlılıklarını vb. belirleyebilirsiniz.
    return steps_selected  # Şimdilik doğrudan geri dönüyor
