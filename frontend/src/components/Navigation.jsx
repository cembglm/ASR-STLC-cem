import React from 'react';
import { clsx } from 'clsx';

export default function Navigation({ processes, selectedProcess, onProcessSelect, disabled }) {
  return (
    <nav className="flex-1">
      <div className="flex space-x-4 overflow-x-auto">
        {processes.map((process) => (
          <button
            key={process.id}
            onClick={() => !disabled && onProcessSelect(process)}
            disabled={disabled}
            className={clsx(
              'px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md',
              'transition duration-150 ease-in-out',
              disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : selectedProcess.id === process.id
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            )}
          >
            {process.name}
          </button>
        ))}
      </div>
    </nav>
  );
}