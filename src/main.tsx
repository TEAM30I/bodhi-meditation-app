
// IMPORTANT: These polyfills must be defined BEFORE any imports
// Create a more robust global polyfill for AWS Amplify
window.global = window;
// @ts-ignore - we need to set the global object for AWS Amplify
global = window;

// Add Buffer if needed (with proper error handling)
if (!window.Buffer) {
  try {
    // @ts-ignore - Buffer is required by AWS Amplify
    window.Buffer = require('buffer/').Buffer;
  } catch (e) {
    console.error('Failed to load Buffer polyfill:', e);
  }
}

// Add process if it doesn't exist
// @ts-ignore - simplified process object for browser environment
if (!window.process) {
  window.process = { env: {} };
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
