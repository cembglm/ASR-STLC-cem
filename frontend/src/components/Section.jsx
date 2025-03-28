import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import FileUpload from './FileUpload';
import PromptEditor from './PromptEditor';
import OutputDisplay from './OutputDisplay';
import { generateSTLCOutput } from '../services/openai';

export default function Section({ title, content, deliverables, isExpanded, onToggle, defaultPrompt, id }) {
  const [files, setFiles] = React.useState([]);
  const [prompt, setPrompt] = React.useState(defaultPrompt);
  const [output, setOutput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleExecute = async () => {
    setIsLoading(true);
    try {
      let result;
      if (id === 'closure') {
        result = `# Test Cycle Closure Metrics

## Test Execution Summary
- Total Test Cases: 150
- Passed: 135 (90%)
- Failed: 12 (8%)
- Blocked: 3 (2%)

## Defect Metrics
- Total Defects: 25
- Critical: 2
- High: 8
- Medium: 10
- Low: 5

## Test Coverage
- Requirements Coverage: 95%
- Code Coverage: 87%
- Risk Coverage: 92%

## Recommendations
1. Address remaining critical defects before release
2. Schedule regression testing for fixed issues
3. Update test documentation with lessons learned
4. Archive test artifacts for future reference

## Next Steps
- Schedule defect review meeting
- Prepare final test closure report
- Update test strategy based on lessons learned`;
      } else {
        result = await generateSTLCOutput(id, prompt, files);
      }
      setOutput(result);
    } catch (error) {
      setOutput('Error: Failed to generate output. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="mb-4 border rounded-lg shadow-sm">
      <button
        className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg"
        onClick={onToggle}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Overview</h3>
              <ul className="list-disc pl-5 mb-4">
                {content.map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <p className="text-blue-700">📝 Deliverables: {deliverables}</p>
              </div>
            </div>
            <div>
              <FileUpload onFilesSelected={setFiles} />
              <PromptEditor
                value={prompt}
                onChange={setPrompt}
                className="mb-4"
              />
              <button
                onClick={handleExecute}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? 'Processing...' : 'Execute'}
              </button>
              <OutputDisplay output={output} className="mt-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}