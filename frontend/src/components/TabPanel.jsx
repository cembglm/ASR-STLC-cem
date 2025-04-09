import React, { useState } from 'react';
import { clsx } from 'clsx';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import PromptEditor from './PromptEditor';
import OutputPanel from './OutputPanel';
import TestScenarioGenerationForm from './processes/TestScenarioGenerationForm';
import TestScenarioOptimizationForm from './processes/TestScenarioOptimizationForm';
import TestCaseGenerationForm from './processes/TestCaseGenerationForm';
import TestCaseOptimizationForm from './processes/TestCaseOptimizationForm';
import CodeReviewForm from './processes/CodeReviewForm';

export default function TabPanel({
  processes,
  activeTab,
  setActiveTab,
  selectedProcesses,
  processOrigins = {}, // Auto özelliği için eklendi
  onProcessSelect,
  processFiles,
  onFileUpload,
  processPrompts,
  onPromptUpdate,
  pipelineStatus,
  onRun,
  validationError,
  output,
  isPipelineEnabled = true, // Auto-selection için eklendi
  onTogglePipeline = () => {}, // Auto-selection için eklendi
  managedFiles,
  fileProcessMappings,
  onFileProcessMapping,
  onFileDelete,
  selectedFileIds,
  setSelectedFileIds,
  onGeneratePrompt  // Add this line
}) {
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [tempPrompt, setTempPrompt] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleProcessToggle = (processId) => {
    onProcessSelect(processId);
    setActiveTab(processId);
  };

  const handleEditPrompt = (processId) => {
    setEditingPrompt(processId);
    setTempPrompt(processPrompts[processId] || '');
  };

  const handleSavePrompt = (processId) => {
    onPromptUpdate(processId, tempPrompt);
    setEditingPrompt(null);
  };

  const handleRun = (processId, files) => {
    // processId bilgisini çıktıya eklemek için
    onRun(processId, files);
  };

  const tabs = [
    { id: 'files', name: 'File Management' },
    { id: 'pipeline', name: 'Pipeline' },
    ...processes.map(process => ({
      id: process.id,
      name: process.name
    }))
  ];

  const ProcessFormComponents = {
    'code-review': CodeReviewForm,
    'test-scenario-generation': TestScenarioGenerationForm,
    'test-scenario-optimization': TestScenarioOptimizationForm,
    'test-case-generation': TestCaseGenerationForm,
    'test-case-optimization': TestCaseOptimizationForm
  };

  const renderHelpContent = () => (
    <ul className="list-disc pl-5 text-blue-700 space-y-1">
      {activeTab === 'files' ? (
        <>
          <li>You can upload all your files here</li>
          <li>Select processes to be used for each file</li>
          <li>You can delete or edit files</li>
        </>
      ) : activeTab === 'pipeline' ? (
        <>
          <li>Select processes using the checkboxes above</li>
          <li>Processes will run in the shown order</li>
          <li>Make sure all required inputs are provided</li>
          <li>Click "Start Pipeline" button</li>
        </>
      ) : (
        <>
          <li>Navigate between sections using the tabs above</li>
          <li>Complete each section before running the process</li>
          <li>Required fields are marked with an asterisk (*)</li>
          <li>Click "Run Process" button</li>
        </>
      )}
    </ul>
  );

  const renderProcessContent = (processId) => {
    const process = processes.find(p => p.id === processId);
    const FormComponent = ProcessFormComponents[processId];
    
    return (
      <div className="space-y-6">
        {/* Process Description */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Process Description</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2 text-gray-600">
              {process?.details.map((detail, index) => (
                <div key={`detail-${index}`}>
                  {typeof detail === 'string' ? (
                    <p>{detail}</p>
                  ) : detail.type === 'table' ? (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">{detail.title}</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Methodology</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {detail.data.map((row, idx) => (
                              <tr key={idx}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.testType}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{row.category}</td>
                                <td className="px-4 py-4 text-sm text-gray-500">{row.methodology}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* File Selection Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Input Files</h3>
          <div className="space-y-4">
            {managedFiles.length === 0 ? (
              <p className="text-gray-500">No files uploaded yet. Please upload files in File Management.</p>
            ) : (
              <div className="space-y-2">
                {managedFiles.map(file => (
                  <div 
                    key={file.id} 
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={fileProcessMappings[file.id]?.includes(processId) || false}
                      onChange={() => {
                        const currentProcesses = fileProcessMappings[file.id] || [];
                        const updatedProcesses = currentProcesses.includes(processId)
                          ? currentProcesses.filter(p => p !== processId)
                          : [...currentProcesses, processId];
                        onFileProcessMapping(file.id, updatedProcesses);
                      }}
                      className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Process Configuration */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Process Configuration</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            {FormComponent ? (
              <FormComponent 
                process={process} 
                onGeneratePrompt={async (formData) => {
                  try {
                    const response = await onGeneratePrompt(processId, formData);
                    if (response?.prompt) {
                      onPromptUpdate(processId, response.prompt);
                    }
                  } catch (error) {
                    console.error('Error generating prompt:', error);
                  }
                }}
              />
            ) : (
              <p className="text-gray-600">No specific configuration options available for {process?.name}</p>
            )}
          </div>
        </div>

        {/* Prompt Section */}
        {renderPromptSection(processId)}
      </div>
    );
  };

  const renderPromptSection = (processId) => {
    const process = processes.find(p => p.id === processId);
    const currentPrompt = processPrompts[processId];
  
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Process Prompt</h3>
        {editingPrompt === processId ? (
          <div className="space-y-3">
            <PromptEditor
              value={tempPrompt}
              onChange={setTempPrompt}
              placeholder={`Customize prompt for ${process?.name}...`}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleSavePrompt(processId)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditingPrompt(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 whitespace-pre-wrap">
                {currentPrompt || process?.defaultPrompt || 'No prompt set'}
              </p>
            </div>
            <button
              onClick={() => handleEditPrompt(processId)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Enable Auto-selection toggle - yeni eklendi */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="pipelineToggle"
              checked={isPipelineEnabled}
              onChange={() => onTogglePipeline(!isPipelineEnabled)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label htmlFor="pipelineToggle" className="text-sm text-gray-700">
              Enable Auto-selection
            </label>
          </div>
          <div className="text-xs text-gray-500">
            Auto-selected processes will be highlighted in yellow
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-1 overflow-x-auto px-4">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={clsx(
                'relative group',
                activeTab === tab.id && 'bg-indigo-50 rounded-t-lg'
              )}
            >
              <div className="flex items-center px-3 py-2">
                {tab.id !== 'pipeline' && tab.id !== 'files' && (
                  <input
                    type="checkbox"
                    checked={selectedProcesses.has(tab.id)}
                    onChange={() => handleProcessToggle(tab.id)}
                    className={clsx(
                      "h-4 w-4 rounded mr-2",
                      processOrigins[tab.id] === 'auto' ? 'text-yellow-500 border-yellow-500' : 'text-indigo-600 border-gray-300'
                    )}
                  />
                )}
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'text-sm font-medium whitespace-nowrap transition-colors',
                    activeTab === tab.id
                      ? 'text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab.name}
                </button>
                {/* Auto etiketi - yeni eklendi */}
                {processOrigins[tab.id] === 'auto' && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Auto
                  </span>
                )}
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col min-h-0 border-r border-gray-200">
          {/* Header */}
          <div className="flex-none h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === 'files' ? 'File Management' :
               activeTab === 'pipeline' ? 'Pipeline Configuration' : 
               processes.find(p => p.id === activeTab)?.name}
            </h2>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Show Help"
            >
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {showHelp && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  {activeTab === 'files' ? 'File Management Guide' :
                   activeTab === 'pipeline' ? 'Pipeline Guide' : 
                   'Process Guide'}
                </h3>
                {renderHelpContent()}
              </div>
            )}

            {activeTab === 'files' ? (
              <FileUpload
                onFileUpload={onFileUpload}
                managedFiles={managedFiles}
                onFileDelete={onFileDelete}
                processes={processes}
              />
            ) : activeTab === 'pipeline' ? (
              <div className="space-y-4">
                {processes
                  .filter(p => selectedProcesses.has(p.id))
                  .map((process, index) => (
                    <div key={process.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">{index + 1}.</span>
                          <h3 className="font-medium">{process.name}</h3>
                          {/* Auto etiketi pipeline görünümü için - yeni eklendi */}
                          {processOrigins[process.id] === 'auto' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Auto
                            </span>
                          )}
                        </div>
                        <span className={clsx(
                          'text-sm px-2 py-1 rounded-full',
                          pipelineStatus[process.id] === 'completed' ? 'bg-green-100 text-green-800' :
                          pipelineStatus[process.id] === 'running' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        )}>
                          {pipelineStatus[process.id] || 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}

                {validationError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <h4 className="text-red-700 font-medium mb-2">Missing Required Inputs:</h4>
                    <pre className="text-red-600 text-sm whitespace-pre-wrap">{validationError}</pre>
                  </div>
                )}
              </div>
            ) : (
              renderProcessContent(activeTab)
            )}
          </div>

          {/* Footer */}
          <div className="flex-none h-16 px-6 flex items-center border-t border-gray-200 bg-white">
            {activeTab !== 'files' && (
              <button
                onClick={() => {
                  if (activeTab !== 'pipeline') {
                    const foundProcess = processes.find(p => p.id === activeTab);
                    const relevantFiles = managedFiles.filter(file => 
                      fileProcessMappings[file.id]?.includes(activeTab)
                    );
                    
                    if (relevantFiles.length === 0) {
                      window.alert('Please select files for this process');
                      return;
                    }
                    
                    if (foundProcess) {
                      onRun(activeTab);
                    }
                  } else {
                    onRun();
                  }
                }}
                disabled={
                  (activeTab === 'pipeline' && selectedProcesses.size === 0) ||
                  (activeTab !== 'pipeline' && pipelineStatus[activeTab] === 'running')
                }
                className={clsx(
                  "w-full py-2 px-4 rounded-md text-white transition-colors shadow-sm flex items-center justify-center",
                  (activeTab === 'pipeline' && selectedProcesses.size === 0) || 
                  (activeTab !== 'pipeline' && pipelineStatus[activeTab] === 'running')
                    ? "bg-gray-300 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700"
                )}
              >
                {activeTab === 'pipeline' ? (
                  Array.from(selectedProcesses).some(id => pipelineStatus[id] === 'running') ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      GENERATING
                    </>
                  ) : (
                    'Start Pipeline'
                  )
                ) : (
                  pipelineStatus[activeTab] === 'running' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      GENERATING
                    </>
                  ) : (
                    'Run Process'
                  )
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Panel - OutputPanel bileşenine processes ve activeTab prop'larını geçir */}
        <div className="w-1/2 flex flex-col min-h-0">
          <OutputPanel 
            output={output} 
            activeTab={activeTab}
            processes={processes}
          />
        </div>
      </div>
    </div>
  );
}