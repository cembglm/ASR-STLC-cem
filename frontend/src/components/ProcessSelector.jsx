import React from 'react';
import FileUpload from './FileUpload';

export default function ProcessSelector({ onFileUpload, onStart }) {
  return (
    <section id="process-select" className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Process Configuration</h2>
      <div className="space-y-6">
        <FileUpload onFilesSelected={onFileUpload} />
        
        <button
          onClick={onStart}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Start Pipeline
        </button>
      </div>
    </section>
  );
}