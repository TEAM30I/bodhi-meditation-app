
import { Amplify } from 'aws-amplify';
import awsConfig from '../aws-config';

/**
 * Initialize Amplify with proper error handling
 */
export const initializeAmplify = () => {
  try {
    console.log("Initializing Amplify...");
    
    // Double-check polyfills
    if (typeof window !== 'undefined' && !window.global) {
      console.warn("Global polyfill not detected, applying now");
      // @ts-ignore
      window.global = window;
    }
    
    Amplify.configure(awsConfig);
    console.log("Amplify initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize Amplify:", error);
    return false;
  }
};
