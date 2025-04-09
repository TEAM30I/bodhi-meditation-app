
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
  // @ts-ignore - we use a simplified process object for compatibility with AWS Amplify
  window.process = { 
    env: {},
    // Using any type to avoid TypeScript errors with ProcessVersions
    // @ts-ignore - simplified process implementation
    nextTick: (fn) => setTimeout(fn, 0),
    // @ts-ignore - simplified process implementation
    version: '',
    // @ts-ignore - simplified process implementation
    versions: {},
    // @ts-ignore - simplified process implementation
    platform: 'browser'
  };
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
