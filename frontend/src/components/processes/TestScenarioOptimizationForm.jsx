import React, { useState, useEffect } from 'react';

export default function TestScenarioOptimizationForm({ onRun }) {
  const [processConfig, setProcessConfig] = useState({
    processTitle: '',
    testType: '',
    category: ''
  });
  
  const [matchingResults, setMatchingResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Example data - replace with actual API calls
  const processOptions = {
    processTitles: ['Process A', 'Process B', 'Process C'],
    testTypes: ['Unit Test', 'Integration Test', 'System Test'],
    categories: ['Frontend', 'Backend', 'Database']
  };

  const handleConfigChange = (field, value) => {
    setProcessConfig(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Simulate fetching matching results - replace with actual API call
    fetchMatchingResults();
  };

  const fetchMatchingResults = async () => {
    // Simulate API call - replace with actual implementation
    const mockResults = [
      { id: 1, name: 'Test Case 1', description: 'Description 1' },
      { id: 2, name: 'Test Case 2', description: 'Description 2' },
      { id: 3, name: 'Test Case 3', description: 'Description 3' }
    ];
    setMatchingResults(mockResults);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(matchingResults.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleRun = () => {
    onRun({
      processConfig,
      selectedItems
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form className="space-y-6">
        {/* Process Configuration Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Process Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Process Title</label>
              <select
                value={processConfig.processTitle}
                onChange={(e) => handleConfigChange('processTitle', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Process Title</option>
                {processOptions.processTitles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Type</label>
              <select
                value={processConfig.testType}
                onChange={(e) => handleConfigChange('testType', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Test Type</option>
                {processOptions.testTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={processConfig.category}
                onChange={(e) => handleConfigChange('category', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Category</option>
                {processOptions.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {matchingResults.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Matching Results</h2>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.length === matchingResults.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">Select All</span>
              </label>
            </div>

            <div className="space-y-2">
              {matchingResults.map(item => (
                <div key={item.id} className="flex items-center p-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4">
          <button
            type="button"
            onClick={handleRun}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Fetch Test Scenarios
          </button>
        </div>
      </form>
    </div>
  );
}