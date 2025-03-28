export const sections = [
  {
    id: 'requirement',
    title: '1. Requirement Analysis',
    content: [
      'Review requirements, specifications, and documentation',
      'Identify types of testing needed',
      'Analyze testing requirements',
      'Prepare Requirement Traceability Matrix (RTM)',
    ],
    deliverables: 'RTM, Automation Feasibility Report',
    defaultPrompt: 'Act as an ISTQB-certified test analyst. Analyze the provided source code to identify functional and non-functional requirements. Extract explicit functionalities implemented in the code and infer implicit requirements based on its logic. Highlight any gaps, ambiguities, or missing requirements that may affect completeness or quality. Assess the code for alignment with standard testing principles, including maintainability, performance, and security. Provide a clear and structured requirements document outlining the purpose, key functionalities, non-functional characteristics, and areas needing improvement, along with actionable recommendations to ensure compliance with best practices in software testing.',
  },
  {
    id: 'planning',
    title: '2. Test Planning',
    content: [
      'Prepare test strategy and plan',
      'Estimate effort and cost',
      'Determine resources and schedule',
      'Plan test environment setup',
    ],
    deliverables: 'Test Plan, Test Strategy',
    defaultPrompt: 'Act as an ISTQB-certified test analyst and create a detailed Test Plan for the provided project. Outline the testing objectives, scope, and strategy, including the levels and types of testing to be performed. Specify the required test environment, identify potential risks with mitigation strategies, and define roles and responsibilities for all stakeholders. Include a high-level schedule with milestones and deliverables, ensuring the plan aligns with ISTQB guidelines and industry best practices for effective and efficient testing execution.',
  },
  {
    id: 'development',
    title: '3. Test Case Development',
    content: [
      'Create test cases and scripts',
      'Review and baseline test cases',
      'Create test data',
      'Update RTM with test cases',
    ],
    deliverables: 'Test Cases, Test Scripts, Test Data',
    defaultPrompt: 'Act as an ISTQB-certified test analyst and develop detailed test cases based on the provided requirements and source code. For each test case, include the following details: test case ID, objective, preconditions, steps to execute, expected results, and postconditions. Ensure the test cases cover both positive and negative scenarios, address edge cases, and align with functional and non-functional requirements. Provide traceability by mapping test cases to corresponding requirements, ensuring comprehensive coverage. Maintain clarity, precision, and adherence to ISTQB guidelines for effective test case design.',
  },
  {
    id: 'environment',
    title: '4. Test Environment Setup',
    content: [
      'Prepare hardware and software requirements',
      'Setup test environment and test data',
      'Perform smoke test on the build',
      'Configure test tools and frameworks',
    ],
    deliverables: 'Test Environment, Smoke Test Results',
    defaultPrompt: 'Act as an ISTQB-certified test analyst and outline a comprehensive plan for the Test Environment Setup phase. Analyze the provided requirements and source code to identify the hardware, software, network, and configurations needed for the test environment. Include steps to set up the environment, such as installing necessary tools, configuring test data, and validating dependencies. Ensure the environment supports the execution of all planned test cases, including functional, performance, and security tests. Highlight any potential risks and dependencies, and provide guidelines for maintaining and validating the environment throughout the testing process, adhering to ISTQB best practices.',
  },
  {
    id: 'execution',
    title: '5. Test Execution',
    content: [
      'Execute test cases',
      'Document test results',
      'Report and track defects',
      'Retest fixed defects',
    ],
    deliverables: 'Test Results, Defect Reports',
    defaultPrompt: 'Act as an ISTQB-certified test analyst and execute the test cases in the planned test environment. Log all test results, including passed and failed cases, with detailed observations and evidence such as screenshots or logs. Identify and report defects, ensuring they are categorized and prioritized effectively. Validate the fixes for defects during retesting and ensure they meet the acceptance criteria. Continuously monitor and document progress to ensure alignment with the test plan and project goals.',
  },
  {
    id: 'closure',
    title: '6. Test Cycle Closure',
    content: [
      'Evaluate cycle completion criteria',
      'Prepare test metrics and reports',
      'Document lessons learned',
      'Archive test artifacts',
    ],
    deliverables: 'Test Metrics, Test Closure Report',
    defaultPrompt: 'Act as an ISTQB-certified test analyst and perform the Test Cycle Closure activities. Review and document the test summary report, including metrics such as test coverage, defect density, and unresolved issues. Conduct a retrospective to identify lessons learned and areas for improvement. Archive test artifacts, including test cases, results, and logs, for future reference. Ensure all testing objectives have been met and communicate the closure status to stakeholders in alignment with ISTQB best practices.',
  },
];