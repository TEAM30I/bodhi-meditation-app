
// Polyfill for global needed by AWS Amplify
// This must be the very first line, before any imports
if (typeof window !== 'undefined' && !window.global) {
  window.global = window;
}

// Add polyfills for other Node.js globals that Amplify might use
if (typeof process === 'undefined') {
  window.process = {
    env: {}
  };
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
