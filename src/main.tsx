
// Polyfill for global needed by AWS Amplify
// This must be the very first line, before any imports
if (typeof window !== 'undefined' && !window.global) {
  window.global = window;
}

// Add polyfills for other Node.js globals that Amplify might use
if (typeof process === 'undefined') {
  // Create a minimal process object with just the properties Amplify needs
  window.process = { env: {} } as unknown as NodeJS.Process;
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
