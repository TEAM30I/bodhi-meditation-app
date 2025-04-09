
// IMPORTANT: Global polyfills must be defined before any imports
if (typeof window !== 'undefined') {
  // Create a proper global object
  // @ts-ignore - we need to set these globals for AWS Amplify
  window.global = window;
  // @ts-ignore - required for AWS Amplify
  global = window;

  // Add process if needed
  if (typeof process === 'undefined') {
    // @ts-ignore - simplified process object for browser environment
    window.process = { env: {} };
  }

  // Add Buffer if needed
  if (typeof Buffer === 'undefined') {
    // @ts-ignore - Buffer is required by AWS Amplify
    window.Buffer = require('buffer/').Buffer;
  }
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
