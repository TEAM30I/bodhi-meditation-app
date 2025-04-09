
import { Amplify } from 'aws-amplify';
import awsConfig from '../aws-config';

/**
 * Initialize Amplify with proper error handling and polyfill verification
 */
export const initializeAmplify = () => {
  try {
    console.log("Initializing Amplify...");
    
    // Verify global polyfills are in place
    if (typeof window === 'undefined' || typeof global === 'undefined') {
      console.error("Global object not available - polyfills not loaded correctly");
      
      // Apply emergency polyfill if in browser context
      if (typeof window !== 'undefined') {
        console.warn("Applying emergency global polyfill");
        // @ts-ignore
        window.global = window;
        // @ts-ignore
        global = window;
      } else {
        return false;
      }
    }
    
    // Verify Buffer polyfill
    if (typeof Buffer === 'undefined' && typeof window !== 'undefined') {
      console.warn("Buffer polyfill not detected, applying emergency polyfill");
      try {
        // @ts-ignore
        window.Buffer = require('buffer/').Buffer;
      } catch (e) {
        console.error("Failed to apply Buffer polyfill:", e);
      }
    }
    
    // Verify process polyfill
    if (typeof process === 'undefined' && typeof window !== 'undefined') {
      console.warn("Process polyfill not detected, applying emergency polyfill");
      // @ts-ignore - simplified process object
      window.process = { env: {} };
    }
    
    // Configure Amplify
    Amplify.configure(awsConfig);
    console.log("Amplify initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize Amplify:", error);
    return false;
  }
};
