import React from 'react';

export default function StatusSection({ status }) {
  return (
    <section id="process-status" className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Process Status</h2>
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">{status.message}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progress</span>
            <span>{status.progress}%</span>
          </div>
          <div className="overflow-hidden h-2 rounded-full bg-gray-200">
            <div
              className="h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${status.progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}