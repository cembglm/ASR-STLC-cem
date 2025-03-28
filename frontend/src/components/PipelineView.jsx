import React from 'react';
import { clsx } from 'clsx';

export default function PipelineView({
  processes,
  selectedSteps,
  onStepToggle,
  pipelineStatus,
  onRun
}) {
  return (
    <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Pipeline Configuration</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select the steps to include in the pipeline execution. Steps will be executed in sequence.
        </p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-4">
          {processes.map((process, index) => (
            <div
              key={process.id}
              className={clsx(
                'p-4 rounded-lg border',
                selectedSteps.has(process.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-6 w-6 mr-3 flex items-center justify-center rounded-full bg-gray-200">
                    {index + 1}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{process.name}</h3>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSteps.has(process.id)}
                    onChange={() => onStepToggle(process.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </label>
              </div>

              <div className="ml-9">
                <p className="text-sm text-gray-600 mb-2">{process.details[0]}</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        'h-full transition-all duration-500',
                        pipelineStatus[process.id] === 'completed'
                          ? 'bg-green-500 w-full'
                          : pipelineStatus[process.id] === 'running'
                          ? 'bg-indigo-500 w-full animate-pulse'
                          : 'w-0'
                      )}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {pipelineStatus[process.id] || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onRun}
          disabled={selectedSteps.size === 0}
          className={clsx(
            'w-full py-2 px-4 rounded-md text-white font-medium',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
            selectedSteps.size === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          )}
        >
          Run Pipeline
        </button>
      </div>
    </div>
  );
}