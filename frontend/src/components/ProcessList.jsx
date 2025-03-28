import React, { useState } from 'react';
import { clsx } from 'clsx';
import FileUpload from './FileUpload';
import PromptEditor from './PromptEditor';

export default function ProcessList({
  processes,
  selectedProcesses,
  onProcessSelect,
  processFiles,
  onFileUpload,
  processPrompts,
  onPromptUpdate,
  pipelineStatus,
  onRun
}) {
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [tempPrompt, setTempPrompt] = useState('');

  const handleEditPrompt = (processId) => {
    setEditingPrompt(processId);
    setTempPrompt(processPrompts[processId] || '');
  };

  const handleSavePrompt = (processId) => {
    onPromptUpdate(processId, tempPrompt);
    setEditingPrompt(null);
  };

  return (
    <div className="w-2/3 bg-white border-r border-gray-200 overflow-auto p-6">
      <div className="space-y-8">
        {processes.map((process) => (
          <div
            key={process.id}
            className={clsx(
              'border rounded-lg p-6',
              selectedProcesses.has(process.id) ? 'border-indigo-500' : 'border-gray-200'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedProcesses.has(process.id)}
                  onChange={() => onProcessSelect(process.id)}
                  className="h-5 w-5 text-indigo-600 rounded"
                />
                <h2 className="text-xl font-semibold">{process.name}</h2>
              </div>
              <div className="text-sm text-gray-500">
                {pipelineStatus[process.id] || 'Pending'}
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Description</h3>
              <div className="space-y-2 text-gray-600">
                {process.details.map((detail, index) => (
                  <p key={index}>{detail}</p>
                ))}
              </div>
              
              <div className="mt-4">
                <h4 className="text-md font-medium mb-2">Required Inputs</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {process.inputs.map((input, index) => (
                    <li key={index}>{input}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Process Configuration Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Process Configuration</h3>
              
              {/* Files Subsection */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3">Files</h4>
                <FileUpload
                  processId={process.id}
                  onFilesSelected={onFileUpload}
                  existingFiles={processFiles[process.id]}
                  allowMultiple={true}
                />
              </div>

              {/* Prompt Subsection */}
              <div>
                <h4 className="text-md font-medium mb-3">Prompt</h4>
                {editingPrompt === process.id ? (
                  <div className="space-y-3">
                    <PromptEditor
                      value={tempPrompt}
                      onChange={setTempPrompt}
                      placeholder={`Customize prompt for ${process.name}...`}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSavePrompt(process.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPrompt(null)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      {processPrompts[process.id] || process.defaultPrompt || 'No prompt set'}
                    </p>
                    <button
                      onClick={() => handleEditPrompt(process.id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white pt-4 mt-6 border-t">
        <button
          onClick={onRun}
          disabled={selectedProcesses.size === 0}
          className={clsx(
            'w-full py-3 px-4 rounded-md text-white font-medium',
            selectedProcesses.size === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          )}
        >
          {selectedProcesses.size > 1 ? 'Run Pipeline' : 'Run Selected Process'}
        </button>
      </div>
    </div>
  );
}