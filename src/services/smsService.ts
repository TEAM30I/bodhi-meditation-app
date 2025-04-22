// SMS Authentication Service using Solapi

// Constants
const API_KEY = 'NCSULRWBLJCVAKLS';
const API_SECRET = 'GKDC0XVGBNAQKA8R5HOTJDVGAJ0BYMHC';
const SENDER_PHONE = '01038717727'; // 발신번호 (국내 형식, 하이픈 없음)
const VERIFICATION_CODE_EXPIRY = 180; // 3 minutes in seconds

// Verification code storage keys
const VERIFICATION_CODE_KEY = 'temp_verification_code';
const VERIFICATION_EXPIRY_KEY = 'temp_verification_expiry';
const VERIFICATION_PHONE_KEY = 'temp_verification_phone';

// Use localStorage for web applications
const storage = {
  setItem: (key: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.setItem(key, value);
      resolve();
    });
  },
  getItem: (key: string): Promise<string | null> => {
    return new Promise((resolve) => {
      resolve(localStorage.getItem(key));
    });
  },
  removeItem: (key: string): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem(key);
      resolve();
    });
  },
  multiRemove: (keys: string[]): Promise<void> => {
    return new Promise((resolve) => {
      keys.forEach(key => localStorage.removeItem(key));
      resolve();
    });
  }
};

/**
 * Generate a random verification code
 * @returns 6-digit verification code
 */
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a random hex string of specified length
 * @param length Length of the hex string to generate
 * @returns Random hex string
 */
const generateRandomHex = (length: number): string => {
  const characters = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Generate HMAC-SHA256 signature for Solapi authentication
 * @param apiSecret API Secret key
 * @param message Message to sign (date + salt)
 * @returns Promise with hex-encoded HMAC-SHA256 signature
 */
const generateSignature = async (apiSecret: string, message: string): Promise<string> => {
  // Use Web Crypto API for browser environments
  const encoder = new TextEncoder();
  
  // Convert message and key to Uint8Array
  const messageUint8 = encoder.encode(message);
  const keyUint8 = encoder.encode(apiSecret);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyUint8,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, messageUint8);
  
  // Convert ArrayBuffer to hex string
  return Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Send verification code via SMS
 * @param phoneNumber The recipient's phone number
 * @returns Promise with the verification code
 */
export const sendVerificationCode = async (phoneNumber: string): Promise<string> => {
  try {
    // Make sure phoneNumber is clean (no hyphens)
    const cleanedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    console.log('Cleaned phone number:', cleanedPhoneNumber);
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    console.log('Generated verification code:', verificationCode);
    
    // Generate authentication parameters for HMAC-SHA256
    const date = new Date().toISOString();
    const salt = generateRandomHex(64); // 64 hex characters (32 bytes)
    const message = date + salt;
    
    // Generate HMAC-SHA256 signature
    const signature = await generateSignature(API_SECRET, message);
    
    // Set headers with HMAC-SHA256 authentication
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `HMAC-SHA256 apiKey=${API_KEY}, date=${date}, salt=${salt}, signature=${signature}`
    });

    // Log the authorization header (partially masked for security)
    console.log(`Authorization header set with HMAC-SHA256 authentication (signature: ${signature.substring(0, 8)}...)`);

    // 국제번호 형식 사용하지 않고 국내 형식 그대로 사용
    const phoneNumberTo = cleanedPhoneNumber;
      
    // 메시지 페이로드에 등록 - 공식 예제 구조로 수정
    const payload = {
      messages: [
        {
          to: phoneNumberTo,
          from: SENDER_PHONE,
          text: `[인증번호] ${verificationCode} 를 입력해주세요.`,
        },
      ],
    };
    console.log('SMS payload:', JSON.stringify(payload, null, 2));

    // Send the API request
    console.log('Sending request to Solapi API...');
    const response = await fetch('https://api.solapi.com/messages/v4/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('SMS API response:', result);

    if (!response.ok) {
      throw new Error(result.message || `Failed to send verification code. Status: ${response.status}`);
    }

    // Save verification code and expiry time to storage
    const expiryTime = Date.now() + VERIFICATION_CODE_EXPIRY * 1000;
    await storage.setItem(VERIFICATION_CODE_KEY, verificationCode);
    await storage.setItem(VERIFICATION_EXPIRY_KEY, expiryTime.toString());
    await storage.setItem(VERIFICATION_PHONE_KEY, cleanedPhoneNumber);

    // For testing purposes - this will be visible in browser console
    console.log('✅ Successfully saved verification data');
    
    // If we're in development mode, use the verification code from localStorage for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 DEV MODE: Verification code is:', verificationCode);
      toast({
        title: "인증번호 (개발 모드)",
        description: `인증번호: ${verificationCode}`,
        duration: 10000
      });
    }

    return verificationCode;
  } catch (error) {
    console.error('❌ Error sending verification code:', error);
    throw error;
  }
};

/**
 * Verify the code entered by the user
 * @param code The verification code entered by the user
 * @returns Promise<boolean> indicating success or failure
 */
export const verifyCode = async (code: string): Promise<boolean> => {
  try {
    const storedCode = await storage.getItem(VERIFICATION_CODE_KEY);
    const expiryTimeStr = await storage.getItem(VERIFICATION_EXPIRY_KEY);
    
    console.log('Verifying code:', code);
    console.log('Stored code:', storedCode);
    
    if (!storedCode || !expiryTimeStr) {
      console.log('No stored code or expiry time found');
      return false;
    }

    const expiryTime = parseInt(expiryTimeStr, 10);
    const currentTime = Date.now();

    // Check if code has expired
    if (currentTime > expiryTime) {
      console.log('Code has expired');
      // Clear expired verification data
      await clearVerificationData();
      return false;
    }

    // Check if code matches
    const isValid = code === storedCode;
    console.log('Is code valid?', isValid);
    return isValid;
  } catch (error) {
    console.error('Error verifying code:', error);
    return false;
  }
};

/**
 * Get the remaining time for verification in seconds
 * @returns Promise with remaining seconds or 0 if expired
 */
export const getVerificationTimeRemaining = async (): Promise<number> => {
  try {
    const expiryTimeStr = await storage.getItem(VERIFICATION_EXPIRY_KEY);
    if (!expiryTimeStr) {
      return 0;
    }

    const expiryTime = parseInt(expiryTimeStr, 10);
    const currentTime = Date.now();
    const remainingMs = expiryTime - currentTime;

    return Math.max(0, Math.floor(remainingMs / 1000));
  } catch (error) {
    console.error('Error getting verification time remaining:', error);
    return 0;
  }
};

/**
 * Get the phone number associated with the current verification
 * @returns Promise with the phone number or null
 */
export const getVerificationPhone = async (): Promise<string | null> => {
  try {
    return await storage.getItem(VERIFICATION_PHONE_KEY);
  } catch (error) {
    console.error('Error getting verification phone:', error);
    return null;
  }
};

/**
 * Clear verification data from storage
 */
export const clearVerificationData = async (): Promise<void> => {
  try {
    await storage.multiRemove([
      VERIFICATION_CODE_KEY,
      VERIFICATION_EXPIRY_KEY,
      VERIFICATION_PHONE_KEY
    ]);
    console.log('Verification data cleared');
  } catch (error) {
    console.error('Error clearing verification data:', error);
  }
};

// Toast notification helper (simple implementation)
const toast = (options: { title: string; description: string; duration?: number }) => {
  console.log(`TOAST: ${options.title} - ${options.description}`);
  
  // If you have a toast library, you can replace this with actual implementation
  if (typeof window !== 'undefined') {
    alert(`${options.title}\n${options.description}`);
  }
};