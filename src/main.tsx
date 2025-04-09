
// Polyfills for Node.js globals needed by AWS Amplify
// These must be at the very top, before any imports
if (typeof window !== 'undefined') {
  // Add global to window with a full implementation
  // @ts-ignore
  window.global = window;
  
  // Add process if it doesn't exist
  if (typeof process === 'undefined') {
    // @ts-ignore
    window.process = { env: {} };
  }
  
  // Add Buffer if it doesn't exist
  if (typeof Buffer === 'undefined') {
    // @ts-ignore
    window.Buffer = require('buffer/').Buffer;
  }
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
