
// Polyfills for Node.js globals needed by AWS Amplify
// These must be at the very top, before any imports
if (typeof window !== 'undefined') {
  // Create a proper global object that contains all window properties
  const windowAsAny = window as any;
  windowAsAny.global = windowAsAny;
  
  // Set global to window for AWS Amplify to work correctly
  // This is technically not type-safe but is required for Amplify
  (globalThis as any).global = windowAsAny;
  
  // Add process if it doesn't exist
  if (typeof process === 'undefined') {
    windowAsAny.process = { env: {} } as any;
  }
  
  // Add Buffer if it doesn't exist
  if (typeof Buffer === 'undefined') {
    windowAsAny.Buffer = require('buffer/').Buffer;
  }
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
