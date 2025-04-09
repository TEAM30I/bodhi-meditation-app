
// IMPORTANT: These polyfills must run BEFORE any imports
// Define global explicitly for the entire app
window.global = window;
// @ts-ignore - this assignment is needed for AWS Amplify to work
global = window;

// Add Buffer polyfill
if (!window.Buffer) {
  try {
    // @ts-ignore - Buffer polyfill for browser environment
    window.Buffer = require('buffer/').Buffer;
  } catch (e) {
    console.error('Failed to load Buffer polyfill:', e);
  }
}

// Add a minimal process object
if (!window.process) {
  // @ts-ignore - we use a simplified process object that's compatible with AWS Amplify requirements
  window.process = { 
    env: {},
    // Add minimal required properties to avoid type errors
    nextTick: (fn) => setTimeout(fn, 0),
    version: '',
    versions: {},
    platform: 'browser'
  };
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
