
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { formatPhoneNumber } from '@/utils/validations';

export interface SignUpResult {
  success: boolean;
  message?: string;
  isSignUpComplete?: boolean;
}

export async function initiateEmailVerification(
  email: string,
  name: string,
  tempPassword = "TemporaryPw1!"
): Promise<SignUpResult> {
  try {
    const signUpResult = await signUp({
      username: email,
      password: tempPassword,
      options: {
        userAttributes: {
          name,
          email,
        },
        autoSignIn: false,
      },
    });
    
    console.log("Email verification initiated:", signUpResult);
    
    return {
      success: true,
      isSignUpComplete: signUpResult.isSignUpComplete,
    };
  } catch (error: any) {
    console.error("Email verification error:", error);
    return {
      success: false,
      message: error.message || "이메일 인증 과정에서 문제가 발생했습니다."
    };
  }
}

export async function verifyEmailCode(
  email: string,
  verificationCode: string
): Promise<SignUpResult> {
  try {
    const confirmResult = await confirmSignUp({
      username: email,
      confirmationCode: verificationCode,
    });
    
    console.log("Email verification confirmed:", confirmResult);
    
    return {
      success: true,
      isSignUpComplete: confirmResult.isSignUpComplete,
    };
  } catch (error: any) {
    console.error("Email verification code error:", error);
    return {
      success: false,
      message: error.message || "인증 코드 확인 중 문제가 발생했습니다."
    };
  }
}

export async function initiatePhoneVerification(
  email: string,
  name: string,
  phone: string,
  tempPassword = "TemporaryPw1!"
): Promise<SignUpResult> {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    
    const signUpResult = await signUp({
      username: email,
      password: tempPassword,
      options: {
        userAttributes: {
          name,
          email,
          phone_number: formattedPhone,
        },
        autoSignIn: false,
      },
    });
    
    console.log("Phone verification initiated:", signUpResult);
    
    return {
      success: true,
      isSignUpComplete: signUpResult.isSignUpComplete,
    };
  } catch (error: any) {
    console.error("Phone verification error:", error);
    
    // If user already exists, we consider this success for phone verification
    // since we already created the user in email verification
    if (error.message === "User already exists") {
      return {
        success: true,
        message: "User already verified with email",
      };
    }
    
    return {
      success: false,
      message: error.message || "전화번호 인증 과정에서 문제가 발생했습니다."
    };
  }
}

export async function verifyPhoneCode(
  email: string,
  verificationCode: string
): Promise<SignUpResult> {
  try {
    const confirmResult = await confirmSignUp({
      username: email,
      confirmationCode: verificationCode,
    });
    
    console.log("Phone verification confirmed:", confirmResult);
    
    return {
      success: true,
      isSignUpComplete: confirmResult.isSignUpComplete,
    };
  } catch (error: any) {
    console.error("Phone verification code error:", error);
    return {
      success: false,
      message: error.message || "인증 코드 확인 중 문제가 발생했습니다."
    };
  }
}
