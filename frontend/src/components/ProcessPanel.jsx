import React from 'react';
import { clsx } from 'clsx';
import FileUpload from './FileUpload';
import PromptEditor from './PromptEditor';
import TestScenarioGenerationForm from './processes/TestScenarioGenerationForm';
import TestScenarioOptimizationForm from './processes/TestScenarioOptimizationForm';
import TestCaseGenerationForm from './processes/TestCaseGenerationForm';
import TestCaseOptimizationForm from './processes/TestCaseOptimizationForm';
import CodeReviewForm from './processes/CodeReviewForm';

const tabs = [
  { id: 'description', name: 'Description' },
  { id: 'inputs', name: 'Required Inputs' },
  { id: 'configuration', name: 'Process Configuration' },
  { id: 'files', name: 'Files' },
  { id: 'prompt', name: 'Prompt' }
];

// Process ID'lerine göre form componentlerini eşleştir
const ProcessFormComponents = {
  'code-review': CodeReviewForm,
  'test-scenario-generation': TestScenarioGenerationForm,
  'test-scenario-optimization': TestScenarioOptimizationForm,
  'test-case-generation': TestCaseGenerationForm,
  'test-case-optimization': TestCaseOptimizationForm,
};

export default function ProcessPanel({
  process,
  files,
  prompt,
  activeTab,
  onTabChange,
  onFileUpload,
  onPromptUpdate,
  onRun,
  onGeneratePrompt
}) {
  const FormComponent = ProcessFormComponents[process.id];

  const renderDetail = (detail) => {
    if (typeof detail === 'string') {
      return <p className="text-gray-600">{detail}</p>;
    }
    
    if (detail?.type === 'table' && detail.data) {
      return (
        <div className="mt-4">
          <h4 className="font-medium mb-2">{detail.title}</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Methodology</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {detail.data.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.testType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.methodology}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="h-full overflow-auto">
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 p-6 overflow-auto">
        {activeTab === 'description' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Process Overview</h3>
            <div className="space-y-4">
              {process.details.map((detail, index) => (
                <div key={index}>{renderDetail(detail)}</div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inputs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Required Inputs</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {process.inputs.map((input, index) => (
                <li key={index}>{input}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Configuration tab - Form componenti varsa göster */}
        {activeTab === 'configuration' && FormComponent && (
          <FormComponent 
            process={process}
            onGeneratePrompt={async (formData) => {
              try {
                const response = await onGeneratePrompt(process.id, formData);
                if (response?.prompt) {
                  onPromptUpdate(process.id, response.prompt);
                }
              } catch (error) {
                console.error('Error generating prompt:', error);
                // Hata gösterimi için UI feedback eklenebilir
              }
            }}
          />
        )}

        {activeTab === 'files' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">File Management</h3>
            <FileUpload
              processId={process.id}
              onFilesSelected={onFileUpload}
              existingFiles={files}
              allowMultiple={true}
            />
          </div>
        )}

        {activeTab === 'prompt' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Process Prompt</h3>
            <PromptEditor
              value={prompt}
              onChange={(value) => onPromptUpdate(process.id, value)}
              placeholder={`Customize prompt for ${process.name}...`}
            />
          </div>
        )}
      </div>
    </div>
  );
}