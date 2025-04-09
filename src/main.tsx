
// Polyfills for Node.js globals needed by AWS Amplify
// These must be at the very top, before any imports
if (typeof window !== 'undefined') {
  // Create a proper global object that contains all window properties
  const windowAsAny = window as any;
  window.global = windowAsAny;
  global = windowAsAny;
  
  // Add process if it doesn't exist
  if (typeof process === 'undefined') {
    window.process = { env: {} };
  }
  
  // Add Buffer if it doesn't exist
  if (typeof Buffer === 'undefined') {
    window.Buffer = require('buffer/').Buffer;
  }
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
