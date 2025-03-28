import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function TestScenarioGenerationForm({ onGeneratePrompt, process }) {
  const [processTitle, setProcessTitle] = useState('');
  const [testCategory, setTestCategory] = useState('');
  const [testType, setTestType] = useState('');
  const [model, setModel] = useState('');
  const [availableTestTypes, setAvailableTestTypes] = useState([]);
  const [scoringElements, setScoringElements] = useState({
    testScenarioQuality: false,
    outputAlignment: false,
    consistency: false,
    detailSpecificity: false,
    professionalStandard: false
  });
  const [instructionElements, setInstructionElements] = useState({
    scenarioContext: false,
    relevanceCompleteness: false,
    consistencyAlignment: false,
    detailVerification: false,
    professionalFormatting: false
  });

  const categoryNames = [
    'Select Test Category',
    'Functional',
    'Non-Functional'
  ];

  const allTestTypes = [
    { name: "Integration Testing", category: "Functional" },
    { name: "Input Data Variety Testing", category: "Functional" },
    { name: "Functional Testing", category: "Functional" },
    { name: "Edge Cases and Boundary Testing", category: "Functional" },
    { name: "User Interface (GUI) Testing", category: "Functional" },
    { name: "Performance and Load Testing", category: "Non-Functional" },
    { name: "Compatibility Testing", category: "Non-Functional" },
    { name: "Security Testing", category: "Non-Functional" }
  ];

  const models = [
    'llama3.2',
    'gemma2',
    'mistral',
    'codellama'
  ];

  useEffect(() => {
    if (testCategory && testCategory !== 'Select Test Category') {
      const filteredTests = allTestTypes.filter(test => test.category === testCategory);
      setAvailableTestTypes(filteredTests);
      setTestType('');
    } else {
      setAvailableTestTypes([]);
      setTestType('');
    }
  }, [testCategory]);

  const handleScoringElementChange = (element) => {
    setScoringElements(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };

  const handleInstructionElementChange = (element) => {
    setInstructionElements(prev => ({
      ...prev,
      [element]: !prev[element]
    }));
  };

  const handleGeneratePrompt = async () => {
    if (!testCategory || !testType || !model) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await onGeneratePrompt({
        processId: process?.id,
        processTitle,
        testCategory,
        testType,
        model,
        scoringElements,
        instructionElements
      });
    } catch (error) {
      console.error('Error generating prompt:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Process Title</label>
          <input
            type="text"
            value={processTitle}
            onChange={(e) => setProcessTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter process title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Test Category</label>
          <select
            value={testCategory}
            onChange={(e) => setTestCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {categoryNames.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Test Type</label>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={!testCategory || testCategory === 'Select Test Category'}
          >
            <option value="">Select Test Type</option>
            {availableTestTypes.map(type => (
              <option key={type.name} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">AI Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Model</option>
            {models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Test Scoring Elements</h3>
            <div className="mt-4 space-y-2">
              {[
                { id: 'testScenarioQuality', label: 'Test Scenario Quality Score' },
                { id: 'outputAlignment', label: 'Output Alignment Score' },
                { id: 'consistency', label: 'Consistency Score' },
                { id: 'detailSpecificity', label: 'Detail and Specificity Score' },
                { id: 'professionalStandard', label: 'Professional Standard Score' }
              ].map(element => (
                <label key={element.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={scoringElements[element.id]}
                    onChange={() => handleScoringElementChange(element.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{element.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Test Instruction Elements</h3>
            <div className="mt-4 space-y-2">
              {[
                { id: 'scenarioContext', label: 'Scenario Context Verification' },
                { id: 'relevanceCompleteness', label: 'Relevance and Completeness Check' },
                { id: 'consistencyAlignment', label: 'Consistency and Alignment Verification' },
                { id: 'detailVerification', label: 'Detail Verification' },
                { id: 'professionalFormatting', label: 'Professional and Structured Formatting' }
              ].map(element => (
                <label key={element.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={instructionElements[element.id]}
                    onChange={() => handleInstructionElementChange(element.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{element.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleGeneratePrompt}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Prompt for Test Scenario Generation
          </button>
        </div>
      </form>
    </div>
  );
}

TestScenarioGenerationForm.propTypes = {
  onGeneratePrompt: PropTypes.func.isRequired,
  process: PropTypes.object.isRequired
};
