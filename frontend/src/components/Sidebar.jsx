import React from 'react';

export default function Sidebar() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">STLC Overview</h2>
      <p className="mb-4">
        The Software Testing Life Cycle (STLC) is a systematic approach to testing software.
      </p>
      
      <h3 className="font-semibold mb-2">Key Benefits</h3>
      <ul className="list-disc pl-5 mb-4">
        <li>Organized testing process</li>
        <li>Better test coverage</li>
        <li>Early defect detection</li>
        <li>Improved quality assurance</li>
        <li>Clear documentation</li>
      </ul>

      <h3 className="font-semibold mb-2">Testing Types</h3>
      <ul className="list-disc pl-5">
        <li>Functional Testing</li>
        <li>Integration Testing</li>
        <li>System Testing</li>
        <li>Acceptance Testing</li>
        <li>Performance Testing</li>
        <li>Security Testing</li>
      </ul>
    </div>
  );
}