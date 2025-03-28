import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function OutputDisplay({ output, className }) {
  if (!output) return null;

  return (
    <div className={className}>
      <h3 className="font-semibold mb-2">Output</h3>
      <div className="bg-gray-50 rounded-lg p-4">
        <ReactMarkdown>{output}</ReactMarkdown>
      </div>
    </div>
  );
}