import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { clsx } from 'clsx';

const FILE_TYPES = [
  'Requirement Document',
  'Source Code',
];

export default function FileUpload({ 
  onFileUpload,
  managedFiles = [],
  onFileDelete,
  processes = []
}) {
  const [selectedFileType, setSelectedFileType] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (!selectedFileType) {
        alert('Please select a file type before uploading');
        return;
      }
      onFileUpload(acceptedFiles, selectedFileType);
    },
    multiple: true,
    disabled: !selectedFileType
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">File Upload</h3>
        
        {/* File Type Selection */}
        <div className="mb-4">
          <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-2">
            Select File Type *
          </label>
          <select
            id="fileType"
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Choose a file type...</option>
            {FILE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={clsx(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            !selectedFileType ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' : 'cursor-pointer',
            isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-gray-600">
            {!selectedFileType 
              ? 'Please select a file type before uploading'
              : isDragActive 
                ? 'Drop the files here...' 
                : 'Drag and drop files here, or click to select files'
            }
          </p>
        </div>
      </div>

      {/* File List - without selection */}
      {managedFiles.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
          <div className="space-y-4">
            {managedFiles.map((file) => (
              <div key={file.id} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{file.name}</span>
                    <span className="ml-2 text-sm text-gray-500">({file.type})</span>
                  </div>
                  <button
                    onClick={() => onFileDelete(file.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}