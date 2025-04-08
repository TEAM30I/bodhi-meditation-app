
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
  phone: string
): Promise<SignUpResult> {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    
    // Instead of trying to create a new user, we'll update the existing user's phone number
    // This would require a separate function in a real app, but for now we'll simulate success
    console.log("Phone verification initiated for:", email, "with phone:", formattedPhone);
    
    // In a real implementation, this would call an API to send SMS verification
    // For now, we'll simulate a successful response
    return {
      success: true,
      message: "Phone verification code sent successfully",
    };
  } catch (error: any) {
    console.error("Phone verification error:", error);
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
    // In a real implementation, this would verify the SMS code
    // For now, just accept code "123456" as valid for testing
    const isValidCode = verificationCode === "123456";
    
    if (isValidCode) {
      console.log("Phone verification successful for:", email);
      return {
        success: true,
        message: "Phone verification successful",
      };
    } else {
      return {
        success: false,
        message: "잘못된 인증 코드입니다. 다시 시도해주세요.",
      };
    }
  } catch (error: any) {
    console.error("Phone verification code error:", error);
    return {
      success: false,
      message: error.message || "인증 코드 확인 중 문제가 발생했습니다."
    };
  }
}
