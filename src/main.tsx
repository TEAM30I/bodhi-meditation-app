
// Polyfills for Node.js globals needed by AWS Amplify
// These must be at the very top, before any imports
if (typeof window !== 'undefined') {
  // Add global to window
  window.global = window;
  
  // Add process if it doesn't exist
  if (typeof process === 'undefined') {
    window.process = { env: {} } as any;
  }
  
  // Add Buffer if it doesn't exist
  if (typeof window.Buffer === 'undefined') {
    window.Buffer = {} as any;
  }
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
