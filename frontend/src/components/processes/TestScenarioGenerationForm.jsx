import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import processService from '../../services/processService';

export default function TestScenarioGenerationForm({ onGeneratePrompt, process }) {
  const [processTitle, setProcessTitle] = useState('');
  const [testCategory, setTestCategory] = useState('');
  const [testType, setTestType] = useState('');
  const [model, setModel] = useState('');
  const [availableTestTypes, setAvailableTestTypes] = useState([]);
  const [scoringElements, setScoringElements] = useState({});
  const [scoringElementDetails, setScoringElementDetails] = useState({});
  const [instructionElements, setInstructionElements] = useState({});
  const [instructionElementDetails, setInstructionElementDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [testPrompt, setTestPrompt] = useState('');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState('');


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
      // Reset scoring elements when category changes
      setScoringElements({});
      setScoringElementDetails({});
    } else {
      setAvailableTestTypes([]);
      setTestType('');
    }
  }, [testCategory]);

  useEffect(() => {
    async function fetchTestTypeData() {
      if (!testType) {
        setScoringElements({});
        setScoringElementDetails({});
        setInstructionElements({});
        setInstructionElementDetails({});
        setTestPrompt('');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await processService.getTestTypeDetails(testType);
        
        // Set test prompt
        setTestPrompt(response.test_prompt || '');

        // Set scoring elements
        const scoringData = response.test_scoring_elements_and_prompts || {};
        setScoringElements(Object.keys(scoringData).reduce((acc, key) => ({
          ...acc,
          [key]: false
        }), {}));
        setScoringElementDetails(scoringData);

        // Set instruction elements
        const instructionData = response.test_instruction_elements_and_prompts || {};
        setInstructionElements(Object.keys(instructionData).reduce((acc, key) => ({
          ...acc,
          [key]: false
        }), {}));
        setInstructionElementDetails(instructionData);
      } catch (err) {
        setError(err.message);
        setScoringElements({});
        setScoringElementDetails({});
        setInstructionElementDetails({});
        setTestPrompt('');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestTypeData();
  }, [testType]);

  const handleSavePrompt = () => {
    setTestPrompt(editedPrompt);
    setIsEditingPrompt(false);
    toast.success('Prompt saved successfully!');
  };
  
  const handleCancelEdit = () => {
    setIsEditingPrompt(false);
    setEditedPrompt('');
    toast('Edit cancelled.', { icon: '🛑' });
  };  

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

        {/* Display Test Prompt */}
        {/* {testPrompt && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">Selected Test Type's Base Prompt</h3>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">{testPrompt}</p>
            </div>
          </div>
        )} */}
        {/* Editable Test Prompt */}
        {testPrompt && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">Selected Test Type's Base Prompt</h3>
            {isEditingPrompt ? (
              <div className="mt-2 p-4 bg-gray-50 rounded-md space-y-3">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700"
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  rows={10}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSavePrompt}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 p-4 bg-gray-50 rounded-md space-y-3">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{testPrompt}</p>
                <button
                  onClick={() => {
                    setIsEditingPrompt(true);
                    setEditedPrompt(testPrompt);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        )}


        {/* Scoring Elements Section */}
        <div className="space-y-4">
          {scoringElementDetails && Object.keys(scoringElementDetails).length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900">Test Scoring Elements</h3>
              {isLoading ? (
                <div className="mt-4 text-gray-600">Loading scoring elements...</div>
              ) : error ? (
                <div className="mt-4 text-red-600">{error}</div>
              ) : Object.keys(scoringElements).length > 0 ? (
                <div className="mt-4 space-y-2">
                  {Object.entries(scoringElements).map(([element, checked]) => (
                    <div key={element} className="relative">
                      <label 
                        className="flex items-center group"
                        onMouseEnter={() => setActiveTooltip(element)}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleScoringElementChange(element)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">{element}</span>
                        {activeTooltip === element && scoringElementDetails[element] && (
                          <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg">
                            {scoringElementDetails[element]}
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-gray-600">No scoring elements available for the selected test type.</div>
              )}
            </div>
          )}

          {/* New Section: Scoring Elements Details */}
          {/* {Object.keys(scoringElementDetails).length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Scoring Elements Details</h3>
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                {Object.entries(scoringElementDetails).map(([key, description]) => (
                  <p key={key} className="text-sm text-gray-600"><strong>{key}:</strong> {description}</p>
                ))}
              </div>
            </div>
          )} */}

          {/* Instruction Elements Section */}
          <div>
            {testType ? (
              instructionElementDetails && Object.keys(instructionElementDetails).length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Test Instruction Elements</h3>
                <div className="mt-4 space-y-2">
                  {Object.entries(instructionElements).map(([element, checked]) => (
                    <div key={element} className="relative">
                      <label 
                        className="flex items-center group"
                        onMouseEnter={() => setActiveTooltip(element)}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleInstructionElementChange(element)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">{element}</span>
                        {activeTooltip === element && instructionElementDetails[element] && (
                          <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg">
                            {instructionElementDetails[element]}
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              ) : (
                <div className="mt-4 text-gray-600">No instruction elements available for the selected test type.</div>
              )
            ) : null}
          </div>



          {/* New Section: Instruction Elements Details */}
          {/* {Object.keys(instructionElementDetails).length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Instruction Elements Details</h3>
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                {Object.entries(instructionElementDetails).map(([key, description]) => (
                  <p key={key} className="text-sm text-gray-600"><strong>{key}:</strong> {description}</p>
                ))}
              </div>
            </div>
          )} */}
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
