import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8" id="contact">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p>Email: support@example.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-300 transition-colors duration-200">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300 transition-colors duration-200">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300 transition-colors duration-200">
                  Support Center
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm">
              © {new Date().getFullYear()} Software Test Manager. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}