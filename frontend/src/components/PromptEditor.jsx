import React from 'react';

export default function PromptEditor({ value, onChange, placeholder, className }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Customize ISTQB-Aligned Prompt
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none font-mono text-sm"
      />
      <p className="mt-2 text-sm text-gray-500">
        Modify the prompt while maintaining ISTQB compliance and best practices
      </p>
    </div>
  );
}