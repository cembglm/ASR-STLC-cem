# STLC Manager

Bu proje, **Software Testing Life Cycle (STLC)** adımlarını yönetmek ve otomasyonunu sağlamak amacıyla oluşturulmuş bir Full Stack örneğidir.  
**STLC** aşağıdaki 12 adımı içerir (ancak dilediğiniz gibi özelleştirilebilir):

1. Code Review  
2. Requirement Analysis  
3. Test Planning  
4. Test Scenario Generation  
5. Test Scenario Optimization  
6. Test Case Generation  
7. Test Case Optimization  
8. Test Code Generation  
9. Environment Setup  
10. Test Execution  
11. Test Reporting  
12. Test Closure  

Bu adımların her biri tek başına (tek adım) veya bir **pipeline** (çoklu adım) olarak çalıştırılabilir.

## Proje Dizini

```
STLC-Manager/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Pipeline.jsx
│   │   │   ├── ProcessPanel.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── openai.js
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   └── ...
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── ...
└── backend/
    ├── app.py
    ├── config.py
    ├── requirements.txt
    ├── core/
    │   ├── __init__.py
    │   ├── database.py
    │   ├── file_handler.py
    │   ├── model_client.py
    │   └── prompt_manager.py
    ├── pipeline/
    │   ├── __init__.py
    │   ├── pipeline_controller.py
    │   └── pipeline_executor.py
    ├── stlc/
    │   ├── __init__.py
    │   ├── code_review.py
    │   ├── requirement_analysis.py
    │   ├── test_planning.py
    │   ├── test_scenario_generation.py
    │   ├── test_scenario_optimization.py
    │   ├── test_case_generation.py
    │   ├── test_case_optimization.py
    │   ├── test_code_generation.py
    │   ├── environment_setup.py
    │   ├── test_execution.py
    │   ├── test_reporting.py
    │   └── test_closure.py
    └── utils/
        ├── __init__.py
        ├── text_splitter.py
        └── validation.py
```

### Frontend (React)
- **src/components/**: Bileşenler (ör. `FileUpload`, `Pipeline`, `OutputPanel`)  
- **src/services/**: API çağrılarını yöneten servis fonksiyonları (`openai.js` vs.)  
- **.env** (isteğe bağlı): Backend API URL gibi konfigürasyonları barındırır.  
- **main.jsx / App.jsx**: Uygulamanın ana giriş noktası ve yönlendirme.

### Backend (FastAPI)
- **app.py**: FastAPI uygulamasının ana dosyası.  
- **config.py**: Ortak yapılandırma ve environment değişkenleri (Mongo URI, model URL vb.).  
- **requirements.txt**: Backend bağımlılıkları.

#### **core/**
- **database.py**: MongoDB bağlantısı ve temel veritabanı işlemleri.  
- **file_handler.py**: Dosya yükleme, PDF/DOCX/TXT metin çıkarma fonksiyonları.  
- **model_client.py**: LLM (Large Language Model) çağrısını yönetir.  
- **prompt_manager.py**: MongoDB’den system prompt, query_str gibi verileri çekmek.

#### **pipeline/**
- **pipeline_controller.py**: UI’den gelen STLC adım seçimlerini işleyerek hangi adımların sırayla çalıştırılacağını belirler.  
- **pipeline_executor.py**: Seçilen adımları sırasıyla çalıştırır ve sonuçlarını birleştirir.

#### **stlc/**
- Her adım için (`code_review`, `requirement_analysis`, `test_planning` vb.) ayrı bir dosya.  
- `run_step(input_data)` fonksiyonuyla her adım tek başına veya pipeline içinde çağrılabilir.

#### **utils/**
- **text_splitter.py**: Metin parçalama (chunking) işlemleri.  
- **validation.py**: LLM çıktılarının (structured_output) istenen formata uygunluğunu doğrulama.

## Akış Diyagramı (Mermaid)

Aşağıda, bir pipeline çalıştırma senaryosunun genel akışını gösteren basit bir **Mermaid** diyagramı bulunuyor:

```mermaid
flowchart LR
    A[UI / Frontend] --> B[Pipeline Controller]
    B --> C[Pipeline Executor]
    C --> D[STLC Adım 1 (Ör: Test Planning)]
    C --> E[STLC Adım 2 (Ör: Test Case Generation)]
    C --> F[STLC Adım 3 (Ör: Test Reporting)]
    D --> C
    E --> C
    F --> G[Nihai Sonuç Dönüşü]
```

1. **UI / Frontend**: Kullanıcı, hangi STLC adımlarının seçileceğini belirler (checkbox vb.).  
2. **Pipeline Controller**: Seçilen adımları analiz eder, sırayı belirler.  
3. **Pipeline Executor**: Sırayla her STLC modülünün `run_step` fonksiyonunu çağırır.  
4. **STLC Adımları**: Her adım, ilgili verileri işleyerek kendi çıktısını üretir. Gerekirse bir sonraki adıma veri aktarılır.  
5. **Nihai Sonuç**: Tüm adımlar tamamlandığında, sonuç birleşik olarak UI’a döndürülür.

## Nasıl Çalıştırılır?

1. **Backend Kurulumu:**
   ```bash
   cd STLC-Manager/backend
   pip install -r requirements.txt
   python app.py
   ```
   - Uygulama varsayılan olarak `http://0.0.0.0:8000` üzerinde çalışacaktır.

2. **Frontend Kurulumu:**
   ```bash
   cd STLC-Manager/frontend
   npm install
   npm run dev
   ```
   - Varsayılan olarak `http://localhost:5173` vb. bir portta çalışır (Vite/CRA ayarlarına göre değişebilir).

3. **Env Değişkenleri (Örnek .env Dosyası):**
   ```
   # Backend
   MONGO_URI=mongodb://localhost:27017
   MODEL_API_BASE_URL=http://localhost:1234
   MODEL_IDENTIFIER=llama-3.2-3b-instruct

   # Frontend
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```
   - İhtiyaçlarınıza göre özelleştirin.

4. **Kullanım Senaryoları:**
   - **Tek Adım**: Örneğin, `Test Planning` adımını tek başına çalıştırmak için UI’daki ilgili sayfadan dosya yükleyip “Çalıştır” butonuna basabilirsiniz.  
   - **Pipeline**: Checkbox’larla birden fazla adım (örn. `Test Planning`, `Test Case Generation`, `Test Reporting`) seçilip “Pipeline Çalıştır” denildiğinde, adımlar sırasıyla çalıştırılır ve toplu sonuç ekranda gösterilir.

## Katkıda Bulunma

- Yeni STLC adımları eklemek için `stlc` klasörüne `.py` dosyası ekleyip `run_step` fonksiyonunu tanımlayın.  
- Yeni bir model veya farklı bir vektör veritabanı eklemek için `core/model_client.py` veya `core/database.py` dosyalarında değişiklik yapın.  
- Pull Request’ler, bug raporları ve geliştirme önerileri memnuniyetle karşılanır!

## Lisans

Bu proje örnek bir yapıdır ve kendi kullanımınız için özelleştirebilirsiniz. Lisans koşullarını proje sahibiyle veya ekibinizle belirleyin.
