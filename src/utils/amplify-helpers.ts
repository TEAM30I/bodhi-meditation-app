
import { Amplify } from 'aws-amplify';
import awsConfig from '../aws-config';

/**
 * Initialize Amplify with proper error handling and polyfill verification
 */
export const initializeAmplify = () => {
  try {
    console.log("Initializing Amplify...");
    
    // Double-check global polyfills before configuring
    if (typeof window !== 'undefined') {
      // Re-apply global polyfill if needed
      if (typeof global === 'undefined') {
        console.warn("Re-applying global polyfill");
        // @ts-ignore - this assignment is needed for AWS Amplify
        window.global = window;
        // @ts-ignore - this assignment is needed for AWS Amplify
        global = window;
      }
      
      // Re-apply Buffer polyfill if needed
      if (typeof Buffer === 'undefined') {
        console.warn("Re-applying Buffer polyfill");
        try {
          // @ts-ignore - Buffer polyfill for browser
          window.Buffer = require('buffer/').Buffer;
        } catch (e) {
          console.error("Failed to apply Buffer polyfill:", e);
          return false;
        }
      }
      
      // Re-apply process polyfill if needed
      if (typeof process === 'undefined') {
        console.warn("Re-applying process polyfill");
        // @ts-ignore - simplified process object for browser
        window.process = { 
          env: {},
          nextTick: (fn) => setTimeout(fn, 0),
          version: '',
          versions: {},
          platform: 'browser'
        };
      }
    } else {
      console.error("Window object not available - cannot initialize Amplify");
      return false;
    }
    
    // Verify our polyfills worked
    if (typeof global === 'undefined') {
      console.error("Global object still not defined after polyfill attempt");
      return false;
    }
    
    // Configure Amplify
    console.log("Applying Amplify configuration...");
    Amplify.configure(awsConfig);
    console.log("Amplify initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize Amplify:", error);
    return false;
  }
};
