import streamlit as st
import requests

FASTAPI_URL = "http://localhost:8000"

st.title("LM Studio & Letta Tabanlı STLC Agent Sistemi")

try:
    response = requests.get(f"{FASTAPI_URL}/models")
    response.raise_for_status()
    models = response.json().get("available_models", [])
except Exception as e:
    st.error(f"Model listesi alınamadı: {e}")
    models = []

if models:
    selected_model = st.selectbox("Kullanılacak Modeli Seçin:", models)
else:
    selected_model = None

uploaded_files = st.file_uploader("Birden Çok Belge Yükleyin (PDF, DOCX, TXT)", accept_multiple_files=True)

if st.button("Test Planı Oluştur"):
    if not uploaded_files or not selected_model:
        st.error("Lütfen dosya yükleyin ve bir model seçin.")
    else:
        files = []
        for file in uploaded_files:
            files.append(("files", (file.name, file.getvalue(), file.type)))
        params = {"model_name": selected_model}
        try:
            r = requests.post(f"{FASTAPI_URL}/upload", files=files, params=params)
            r.raise_for_status()
            result = r.json().get("result", "")
            st.success("Test Planı Başarıyla Oluşturuldu!")
            st.text_area("Sonuç:", value=result, height=300)
        except Exception as e:
            st.error(f"İstek sırasında hata oluştu: {e}")
