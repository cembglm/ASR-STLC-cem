import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function CodeReviewForm({ process, onPromptUpdate }) {
  const [processTitle, setProcessTitle] = useState('');
  // Varsayılan modeli boş string yerine doğrudan models dizisinin ilk elemanı olarak ayarlıyorum
  const [model, setModel] = useState('llama3.2');

  const models = [
    'llama3.2',
    'gemma2',
    'mistral',
    'codellama'
  ];
  
  // Component yüklendiğinde varsayılan değerleri ayarla
  useEffect(() => {
    if (process && onPromptUpdate) {
      console.log(`[CodeReviewForm] Initial model set to: ${model}`);
      onPromptUpdate(process.id, {
        processTitle,
        model
      });
    }
  }, []);
  
  // Form verilerindeki değişiklikleri process nesnesine aktarın
  useEffect(() => {
    // Form verilerini process nesnesine bağla
    if (process && process.updateOptions) {
      process.updateOptions({
        processTitle,
        model
      });
    }
    
    // Also update the parent component's state through the callback
    if (onPromptUpdate && process) {
      console.log(`[CodeReviewForm] Updating model: ${model}`);
      onPromptUpdate(process.id, {
        processTitle,
        model
      });
    }
  }, [processTitle, model, process, onPromptUpdate]);

  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    console.log(`[CodeReviewForm] Model changed to: ${selectedModel}`);
    setModel(selectedModel);
    alert(`Selected model: ${selectedModel}`); // Seçilen modeli göster
    
    // Model değiştiğinde hemen parent'a bildir
    if (process && onPromptUpdate) {
      onPromptUpdate(process.id, {
        processTitle,
        model: selectedModel
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Process Title</label>
          <input
            type="text"
            value={processTitle}
            onChange={(e) => setProcessTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter process title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">AI Model</label>
          <select
            value={model}
            onChange={handleModelChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {/* Boş seçenek kaldırıldı */}
            {models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        
        {/* Seçilen modeli görsel olarak görüntüleme */}
        <div className="mt-2 text-sm text-blue-600 font-semibold">
          Currently selected model: {model}
        </div>
      </form>
    </div>
  );
}

CodeReviewForm.propTypes = {
  process: PropTypes.object.isRequired,
  onPromptUpdate: PropTypes.func
};