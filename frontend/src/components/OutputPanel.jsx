import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';

export default function OutputPanel({ output, activeTab, processes }) {
  const { status, reviews, error } = useSelector(state => state.codeReview);

  const processId = activeTab !== 'pipeline' && activeTab !== 'files' ? activeTab : null;
  const selectedProcess = processes?.find(p => p.id === processId);
  const processOutput = processId && output && output.processId === processId ? output : null;
  const processName = selectedProcess?.name || '';
  const headerTitle = processId ? `${processName} Output` : 'Output';

  const getSampleOutput = () => {
    if (!processId) return null;
    const samples = {
      'code-review': {
        content: "## Code Review Results\n\n### main.js\n- Function `calculateTotal()` lacks input validation\n- Consider adding error handling for edge cases\n\n### utils.js\n- Good use of modular design\n- Line 42: Potential memory leak in event listener",
        status: 'sample',
        timestamp: new Date().toISOString()
      },
      'test-planning': {
        content: "## Test Planning Document\n\n### Test Objectives\n1. Validate user authentication flows\n2. Verify data integrity across transactions\n\n### Test Scenarios\n- Login with valid credentials\n- Login with invalid credentials\n- Password reset flow",
        status: 'sample',
        timestamp: new Date().toISOString()
      },
      'requirement-analysis': {
        content: "## Requirements Analysis\n\n### Functional Requirements\n- User registration system\n- Product catalog browsing\n- Shopping cart functionality\n\n### Non-Functional Requirements\n- System should support 1000 concurrent users\n- Page load time < 2 seconds",
        status: 'sample',
        timestamp: new Date().toISOString()
      },
      'environment-setup': {
        content: "## Environment Setup Guide\n\n### Development Environment\n```\nnpm install\nnpm run setup-dev\n```\n\n### Testing Environment\n```\ndocker-compose up -d\nnpm run setup-test\n```",
        status: 'sample',
        timestamp: new Date().toISOString()
      },
      'test-scenario-generation': {
        content: "## Generated Test Scenarios\n\n### User Authentication\n1. **TC001**: Verify login with valid username and password\n2. **TC002**: Verify login with invalid credentials\n3. **TC003**: Verify password reset functionality\n\n### Shopping Cart\n1. **TC004**: Add single item to cart\n2. **TC005**: Add multiple items to cart",
        status: 'sample',
        timestamp: new Date().toISOString()
      }
    };
    return samples[processId] || {
      content: `# ${processName} Output\n\nRun this process to see actual output here.`,
      status: 'sample',
      timestamp: new Date().toISOString()
    };
  };

  const displayOutput = processOutput || (processId && !output ? getSampleOutput() : output);

  const renderCodeReviewOutput = () => {
    if (status === 'loading') {
      return <div>Loading code review results...</div>;
    }
    
    if (error) {
      return <div className="text-red-600">Error: {error}</div>;
    }
    
    if (reviews.length === 0) {
      return <div>No code review results available</div>;
    }
    
    return (
      <div className="prose prose-sm max-w-none">
        {reviews.map((review, index) => (
          <div key={index} className="mb-4">
            <ReactMarkdown>{review}</ReactMarkdown>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    // Create a local copy that we can modify
    let currentOutput = { ...getSampleOutput() };

    if (activeTab === 'code-review') {
      if (status === 'loading') {
        return <div>Loading code review results...</div>;
      }
      
      if (error) {
        return <div className="text-red-600">Error: {error}</div>;
      }

      if (reviews && reviews.length > 0) {
        const reviewContent = reviews.map(review => review).join('\n\n');
        currentOutput = {
          content: reviewContent,
          status: 'completed',
          timestamp: new Date().toISOString(),
          processType: 'Code Review'
        };
      }
    }

    if (!currentOutput) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-3">
            {/* ...existing empty state JSX... */}
          </div>
        </div>
      );
    }

    // Ensure content is a string
    const content = typeof currentOutput.content === 'string' 
      ? currentOutput.content 
      : JSON.stringify(currentOutput.content || 'No content available');

    return (
      <div className="space-y-4">
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Process Results</h3>
            {currentOutput.status === 'sample' && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                Sample
              </span>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="prose prose-sm max-w-none text-gray-600">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium mb-3">Execution Details</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-gray-600">
              <p><strong>Status:</strong> {currentOutput.status === 'sample' ? 'Not Run' : currentOutput.status}</p>
              <p><strong>Process:</strong> {processName || currentOutput.processType || 'Unknown'}</p>
              <p><strong>Last Updated:</strong> {new Date(currentOutput.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
        <h2 className="text-xl font-bold text-gray-900">{headerTitle}</h2>
        {processId && (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
            {processId}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {renderContent()}
      </div>
      <div className="flex-none h-16 px-6 flex items-center border-t border-gray-200 bg-white">
        <button
          className={`w-full py-2 px-4 rounded-md text-white transition-colors shadow-sm ${
            !displayOutput || displayOutput.status === 'sample'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          disabled={!displayOutput || displayOutput.status === 'sample'}
        >
          Install Output
        </button>
      </div>
    </div>
  );
}