import React, { useState, useEffect } from 'react';

export default function TestCaseGenerationForm({ onRun, process }) {
  const [processTitle, setProcessTitle] = useState('');
  const [testCategory, setTestCategory] = useState('');
  const [testType, setTestType] = useState('');
  const [model, setModel] = useState('');
  const [availableTestTypes, setAvailableTestTypes] = useState([]);
  const [selectedTestCases, setSelectedTestCases] = useState({});
  const [testScenarios, setTestScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [scoringElements, setScoringElements] = useState({
    testCaseQuality: false,
    outputAlignment: false,
    consistency: false,
    detailSpecificity: false,
    professionalStandard: false
  });
  const [instructionElements, setInstructionElements] = useState({
    caseContext: false,
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

  const testTypeSpecificCases = {
    'Performance and Load Testing': [
      'Core Performance Test Case',
      'Stress Test Case',
      'Scalability Test Case',
      'Resource Utilization Test Case'
    ],
    'Edge Cases and Boundary Testing': [
      'Boundary Value Analysis Test Case',
      'Extreme Input Test Case',
      'Null and Empty Input Test Case',
      'Invalid Format Test Case'
    ],
    'Compatibility Testing': [
      'Cross-Browser Test Case',
      'Device Compatibility Test Case',
      'Operating System Compatibility Test Case',
      'Screen Resolution Test Case'
    ],
    'Security Testing': [
      'Authentication Test Case',
      'Input Validation Security Test Case',
      'Data Encryption Test Case',
      'Access Control Test Case'
    ],
    'Integration Testing': [
      'Interface Communication Test Case',
      'Data Consistency Test Case',
      'Shared Resource Access Test Case',
      'Error Propagation Test Case'
    ],
    'User Interface (GUI) Testing': [
      'Visual Consistency Test Case',
      'Navigation Flow Test Case',
      'Input Field Validation Test Case',
      'Responsiveness Test Case'
    ],
    'Input Data Variety Testing': [
      'Valid Input Test Case',
      'Invalid Input Test Case',
      'Boundary Input Test Case',
      'Special Character Input Test Case'
    ],
    'Functional Testing': [
      'Core Functionalities Test Case',
      'Boundary Value Analysis Test Case',
      'Error Recovery Functional Test Case',
      'User Input Validation Test Case'
    ]
  };

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

  useEffect(() => {
    if (testType) {
      const cases = testTypeSpecificCases[testType] || [];
      const initialTestCases = {};
      cases.forEach(testCase => {
        initialTestCases[testCase] = false;
      });
      setSelectedTestCases(initialTestCases);
    }
  }, [testType]);

  useEffect(() => {
    const fetchTestScenarios = async () => {
      try {
        const response = await fetch('/api/test-scenarios'); // Adjust the API endpoint as needed
        const data = await response.json();
        setTestScenarios(data);
      } catch (error) {
        console.error('Error fetching test scenarios:', error);
      }
    };

    fetchTestScenarios();
  }, []);

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

  const handleTestCaseChange = (testCase) => {
    setSelectedTestCases(prev => ({
      ...prev,
      [testCase]: !prev[testCase]
    }));
  };

  const handleRun = () => {
    onRun({
      processTitle,
      testCategory,
      testType,
      model,
      selectedTestCases,
      selectedScenario
    });
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
          <label className="block text-sm font-medium text-gray-700">Test Scenario</label>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Test Scenario</option>
            {testScenarios.map(scenario => (
              <option key={scenario.id} value={scenario.id}>{scenario.title}</option>
            ))}
          </select>
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
            <h3 className="text-lg font-medium text-gray-900">Detail for Test Cases</h3>
            <p className="text-sm text-gray-600">Select the details after the selected test type.</p>
            <div className="mt-4 space-y-2">
              {Object.keys(selectedTestCases).map(testCase => (
                <label key={testCase} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTestCases[testCase]}
                    onChange={() => handleTestCaseChange(testCase)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{testCase}</span>
                </label>
              ))}
            </div>
          </div>

          {testType && testTypeSpecificCases[testType] && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Specific Test Cases for {testType}</h3>
                <div className="mt-4 space-y-2">
                  {testTypeSpecificCases[testType].map(testCase => (
                    <label key={testCase} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTestCases[testCase] || false}
                        onChange={() => handleTestCaseChange(testCase)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{testCase}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleRun}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Prompt for Test Case Generation
          </button>
        </div>
      </form>
    </div>
  );
}