import axios from 'axios';
import { PROCESS_TYPES } from '../constants/processTypes';

const API_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'http://localhost:8000/api/processes';

export const processService = {
  async runProcess(processType, files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      console.log(`İstek gönderiliyor: ${processType} süreci için`);
      const response = await axios.post(
        `${API_URL}/processes/${processType}/run`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(`İstek başarıyla gönderildi: ${processType} süreci`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || `Failed to run ${processType}`);
    }
  },

  async runCodeReview(files) {
    console.log('[ProcessService] Running code review');
    
    const formData = new FormData();
    files.forEach(fileInfo => {
      const file = fileInfo.file || fileInfo;
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/code-review/run`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      // Redux action payload formatına uygun dönüş
      return {
        reviews: data.reviews.map(review => `## Files Analyzed\n${review.files}\n\n## Review\n${review.review}`),
        metadata: {
          timestamp: new Date().toISOString(),
          fileCount: files.length
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Yeni eklenen requirement analysis metodu
  async runRequirementAnalysis(files, customPrompt = null) {
    const formData = new FormData();
    files.forEach(file => {
      const actualFile = file.file || file; // Hem { file: FileObject } hem doğrudan File desteklenir
      console.log("Eklenen dosya:", actualFile.name);
      formData.append('files', actualFile);
    });
  
    if (customPrompt) {
      formData.append('customPrompt', customPrompt);
    }
  
    try {
      console.log("İstek gönderiliyor: Gereksinim analizi süreci için");
      const response = await axios.post(
        `${API_URL}/processes/requirement_analysis/run`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log("İstek başarıyla gönderildi: Gereksinim analizi süreci");
      return response.data;
    } catch (error) {
      console.error("Hata detayları:", error.response?.data);
      const errorMsg = error.response?.data?.detail || 'Requirement analysis failed';
      throw new Error(errorMsg);
    }
  },

  async runTestScenarioGeneration(config) {
    const formData = new FormData();
    
    // Dosyaları ekle
    if (config.files) {
        config.files.forEach(file => {
            formData.append('files', file);
        });
    }
    
    // Form verilerini ekle
    formData.append('test_category', config.testCategory);
    formData.append('test_type', config.testType);
    formData.append('model', config.model);
    formData.append('scoring_elements', JSON.stringify(config.scoringElements));
    formData.append('instruction_elements', JSON.stringify(config.instructionElements));

    try {
        console.log('Running test scenario generation...');
        const response = await axios.post(
            `${API_URL}/processes/test-scenario-generation/run`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to generate test scenarios');
    }
  },

  async generatePrompt(formData) {
    try {
        const response = await axios.post(
            `${API_URL}/processes/test-scenario-generation/generate-prompt`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (response.data.status === 'success') {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to generate prompt');
        }
    } catch (error) {
        console.error('Error in generatePrompt:', error);
        throw error;
    }
  }
};