import React, { useState } from 'react';
import { clsx } from 'clsx';
import { processes } from '../data/processes';
import FileUpload from './FileUpload';
import PromptEditor from './PromptEditor';

export default function ProcessInformation({ 
  selectedProcesses, 
  onAddProcess, 
  onRemoveProcess,
  processFiles,
  onFileUpload,
  processPrompts,
  onPromptUpdate
}) {
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [tempPrompt, setTempPrompt] = useState('');

  const handleEditPrompt = (processId, currentPrompt) => {
    setEditingPrompt(processId);
    setTempPrompt(currentPrompt);
  };

  const handleSavePrompt = (processId) => {
    onPromptUpdate(processId, tempPrompt);
    setEditingPrompt(null);
  };

  const handleUsePreviousOutput = (processId) => {
    const processIndex = selectedProcesses.indexOf(processId);
    if (processIndex > 0) {
      const previousProcessId = selectedProcesses[processIndex - 1];
      onFileUpload(processId, {
        type: 'Previous Process Output',
        sourceProcess: previousProcessId
      });
    }
  };

  return (
    <section id="process-info" className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Process Information</h2>
      <div className="space-y-6">
        {processes.map((process) => (
          <div
            key={process.id}
            className={clsx(
              'rounded-lg border p-4',
              selectedProcesses.includes(process.id)
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{process.name}</h3>
              <button
                onClick={() => selectedProcesses.includes(process.id) 
                  ? onRemoveProcess(process.id)
                  : onAddProcess(process.id)
                }
                disabled={selectedProcesses.length >= 12 && !selectedProcesses.includes(process.id)}
                className={clsx(
                  'px-3 py-1 rounded-md text-sm font-medium',
                  selectedProcesses.includes(process.id)
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : selectedProcesses.length >= 12
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                )}
              >
                {selectedProcesses.includes(process.id) ? 'Remove' : 'Add'}
              </button>
            </div>

            {/* Process Information */}
            <div className="mb-4 space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Description:</h4>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  {process.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Required Inputs:</h4>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  {process.inputs.map((input, index) => (
                    <li key={index}>{input}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Output:</h4>
                <p className="text-sm text-gray-600">{process.output}</p>
              </div>
            </div>

            {selectedProcesses.includes(process.id) && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Process Configuration</h4>
                  
                  {/* File Upload Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-600">Files</h5>
                      {process.id !== 'code-review' && selectedProcesses.indexOf(process.id) > 0 && (
                        <button
                          onClick={() => handleUsePreviousOutput(process.id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Use Previous Process Output
                        </button>
                      )}
                    </div>
                    <FileUpload
                      processId={process.id}
                      onFilesSelected={onFileUpload}
                      existingFiles={processFiles[process.id]}
                      allowMultiple={true}
                    />
                  </div>

                  {/* Prompt Editor Section */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">AI Prompt</h5>
                    {editingPrompt === process.id ? (
                      <div className="space-y-2">
                        <PromptEditor
                          value={tempPrompt}
                          onChange={setTempPrompt}
                          placeholder={`Customize prompt for ${process.name}...`}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSavePrompt(process.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPrompt(null)}
                            className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          {processPrompts[process.id] || process.defaultPrompt}
                        </p>
                        <button
                          onClick={() => handleEditPrompt(process.id, processPrompts[process.id] || process.defaultPrompt)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Edit Prompt
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}