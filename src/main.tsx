
// Ensure global, process, and Buffer are defined before any imports
(function setupPolyfills() {
  if (typeof window !== 'undefined') {
    // Create a proper global object
    window.global = window;
    global = window;

    // Add process if needed
    if (typeof process === 'undefined') {
      window.process = { env: {} };
    }

    // Add Buffer if needed
    if (typeof Buffer === 'undefined') {
      window.Buffer = require('buffer/').Buffer;
    }
  }
})();

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
