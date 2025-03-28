import React from 'react';
import { processes } from '../data/processes';

export default function Pipeline({ selectedProcesses, processFiles }) {
  const getProcess = (id) => processes.find(p => p.id === id) || null;

  return (
    <section className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Process Pipeline</h2>
      {selectedProcesses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No processes added to the pipeline. Add processes to begin.
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-4 pb-4">
          {selectedProcesses.map((processId, index) => {
            const process = getProcess(processId);
            const files = processFiles[processId] || [];
            
            if (!process) return null;

            return (
              <div
                key={processId}
                className="flex-shrink-0 w-64 bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {index + 1}. {process.name}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  <div className="mb-1">
                    <strong>Inputs:</strong>
                    <ul className="list-disc pl-4">
                      {process.inputs.map((input, i) => (
                        <li key={i}>{input}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Output:</strong> {process.output}
                  </div>
                  {files.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <strong>Files:</strong>
                      <ul className="list-disc pl-4 mt-1">
                        {files.map((fileInfo, i) => (
                          <li key={i}>
                            {fileInfo.type === 'Previous Process Output'
                              ? 'Using previous process output'
                              : fileInfo.file && `${fileInfo.file.name} (${fileInfo.type})`
                            }
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}