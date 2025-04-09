// This file contains the processes data for the testing automation tool.
// Each process includes an ID, name, details, inputs, and output.
export const processes = [
  {
    id: 'code-review',
    name: 'Code Review',
    details: [
      'Automated code review using LLM',
      'Best practices analysis',
      'Security check'
    ],
    inputs: [],
    output: 'Code Review Report'
  },
  {
    id: 'requirement-analysis',
    name: 'Requirement Analysis',
    details: [
      'Review and analyze project requirements and specifications',
      'Identify testable requirements and acceptance criteria',
      'Create requirement traceability matrix'
    ],
    inputs: ['Requirement Document', 'Technical Design Document'],
    output: 'Requirements Analysis Report'
  },
  {
    id: 'test-planning',
    name: 'Test Planning',
    details: [
      'Develop comprehensive test strategy and plan',
      'Define test objectives, scope, and approach',
      'Estimate resources and create test schedule'
    ],
    inputs: ['Requirements Analysis Report', 'Code Review Report'],
    output: 'Test Plan'
  },
  {
    id: 'environment-setup',
    name: 'Environment Setup',
    details: [
      'Configure test environment and tools',
      'Set up test data and dependencies',
      'Validate environment readiness'
    ],
    inputs: ['Test Scripts', 'Technical Design Document'],
    output: 'Environment Setup Report'
  },
  {
    id: 'test-scenario-generation',
    name: 'Test Scenario Generation',
    details: [
      'Generate comprehensive test scenarios based on input documents',
      'Supports multiple testing types and advanced configuration',
      'AI-powered scenario generation with customizable parameters',
      {
        title: 'Supported Test Types',
        type: 'table',
        data: [
          {
            testType: 'Performance and Load Testing',
            category: 'Non-Functional',
            methodology: 'Simulate user activity patterns'
          },
          {
            testType: 'Integration Testing',
            category: 'Functional',
            methodology: 'Define interactions between connected modules'
          },
          {
            testType: 'Input Data Variety Testing',
            category: 'Functional',
            methodology: 'Explore inputs with diverse attributes and formats'
          },
          {
            testType: 'Functional Testing',
            category: 'Functional',
            methodology: 'Cover required functionalities comprehensively'
          },
          {
            testType: 'Edge Cases and Boundary Testing',
            category: 'Functional',
            methodology: 'Test limits and unexpected scenarios'
          },
          {
            testType: 'Compatibility Testing',
            category: 'Non-Functional',
            methodology: 'Ensure adaptability across environments'
          },
          {
            testType: 'User Interface (GUI) Testing',
            category: 'Functional',
            methodology: 'Focus on usability and responsiveness'
          },
          {
            testType: 'Security Testing',
            category: 'Non-Functional',
            methodology: 'Identify and address potential vulnerabilities intelligently'
          }
        ]
      }
    ],
    inputs: [
      'Source Code',
      'Test Plan',
      'Technical Design Document',
      'Requirements Document'
    ],
    defaultPrompt: 'Generate test scenarios considering the provided input and selected test type.'
  },
  {
    id: 'test-scenario-optimization',
    name: 'Test Scenario Optimization',
    details: [
      'Analyze and optimize test scenarios for efficiency',
      'Remove redundant scenarios and identify gaps',
      'Prioritize scenarios based on risk and importance'
    ],
    inputs: ['Test Scenarios'],
    output: 'Optimized Test Scenarios'
  },
  {
    id: 'test-case-generation',
    name: 'Test Case Generation',
    details: [
      'Develop detailed test cases based on optimized scenarios',
      'Ensure test cases align with user requirements',
      'Validate test cases for completeness and accuracy'
    ],
    inputs: ['Optimized Test Scenarios', 'Requirements Analysis Report'],
    output: 'Test Cases'
  },
  {
    id: 'test-case-optimization',
    name: 'Test Case Optimization',
    details: [
      'Review and optimize test cases for maximum coverage',
      'Eliminate duplicate test cases and redundancies',
      'Ensure test case effectiveness and efficiency'
    ],
    inputs: ['Test Cases'],
    output: 'Optimized Test Cases'
  },
  {
    id: 'test-code-generation',
    name: 'Test Code Generation',
    details: [
      'Create automated test scripts based on test cases',
      'Implement test framework and utilities',
      'Ensure code quality and maintainability'
    ],
    inputs: ['Optimized Test Cases', 'Source Code'],
    output: 'Test Scripts'
  },
 
  {
    id: 'test-execution',
    name: 'Test Execution',
    details: [
      'Execute test cases and record results',
      'Track defects and issues',
      'Monitor test progress and coverage'
    ],
    inputs: ['Test Scripts', 'Environment Setup Report', 'Optimized Test Cases'],
    output: 'Test Execution Results'
  },
  {
    id: 'test-reporting',
    name: 'Test Reporting',
    details: [
      'Generate detailed test execution reports',
      'Analyze test results and metrics',
      'Provide recommendations and insights'
    ],
    inputs: ['Test Execution Results'],
    output: 'Test Report'
  },
  {
    id: 'test-closure',
    name: 'Test Closure',
    details: [
      'Verify all testing activities are completed',
      'Archive test artifacts and documentation',
      'Conduct lessons learned and process improvement'
    ],
    inputs: ['Test Report', 'Test Execution Results'],
    output: 'Test Closure Report'
  }
];