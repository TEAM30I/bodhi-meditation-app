
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { formatPhoneNumber } from '@/utils/validations';
import { awsconfig } from '@/config/aws-config';

export interface SignUpResult {
  success: boolean;
  message?: string;
  isSignUpComplete?: boolean;
}

// Export these functions from aws-amplify/auth
export { signUp, confirmSignUp };

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
    
    // 이미 존재하는 사용자 에러 처리
    if (error.message?.includes("already exists")) {
      return {
        success: false,
        message: "이미 가입된 이메일입니다. 로그인을 시도해보세요."
      };
    }
    
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

// 전화번호 인증 시작 (모의 구현, 실제로는 AWS Cognito API를 호출)
export async function initiatePhoneVerification(
  email: string,
  name: string,
  phone: string
): Promise<SignUpResult> {
  try {
    // 전화번호 포맷팅 (010-1234-5678 -> +821012345678)
    const formattedPhone = formatPhoneNumber(phone);
    
    console.log("Phone verification initiated for:", email, "with formatted phone:", formattedPhone);
    
    // 테스트 환경에서는 가상으로 인증 성공 응답
    // 실제 환경에서는 AWS Cognito 또는 SMS 서비스를 통해 인증코드 발송
    return {
      success: true,
      message: "인증번호가 발송되었습니다. (테스트 환경: 123456)",
    };
  } catch (error: any) {
    console.error("Phone verification error:", error);
    return {
      success: false,
      message: error.message || "전화번호 인증 과정에서 문제가 발생했습니다."
    };
  }
}

// 전화번호 인증코드 확인 (테스트 구현)
export async function verifyPhoneCode(
  email: string,
  verificationCode: string
): Promise<SignUpResult> {
  try {
    // 테스트 환경에서는 123456 또는 모든 6자리 코드를 유효하게 처리
    const isValidCode = verificationCode === "123456" || verificationCode.length === 6;
    
    if (isValidCode) {
      console.log("Phone verification successful for:", email);
      
      return {
        success: true,
        message: "전화번호 인증이 완료되었습니다.",
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
