
// Set up polyfill for global needed by AWS Amplify
if (typeof global === 'undefined') {
  (window as any).global = window;
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
