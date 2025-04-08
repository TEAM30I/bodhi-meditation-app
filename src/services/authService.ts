
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

// 전화번호 인증 시작 (모의 구현)
export async function initiatePhoneVerification(
  email: string,
  name: string,
  phone: string
): Promise<SignUpResult> {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    
    // 실제로는 SMS 인증 API를 호출해야 하지만, 현재 모의 구현으로 처리
    console.log("Phone verification initiated for:", email, "with phone:", formattedPhone);
    
    // 인증번호 발송 성공 응답 (모의 구현)
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

// 전화번호 인증코드 확인 (모의 구현)
export async function verifyPhoneCode(
  email: string,
  verificationCode: string
): Promise<SignUpResult> {
  try {
    // 테스트용 인증 코드: 123456 (또는 입력한 모든 6자리 코드 허용)
    const isValidCode = verificationCode.length === 6;
    
    if (isValidCode) {
      console.log("Phone verification successful for:", email);
      
      // 여기서 실제로는 사용자 프로필에 전화번호를 업데이트하는 API를 호출해야 함
      
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
