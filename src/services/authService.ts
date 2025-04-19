
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { formatPhoneNumber } from '@/utils/validations';
import { awsconfig } from '@/config/aws-config';
import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

export interface SignUpResult {
  success: boolean;
  message?: string;
  isSignUpComplete?: boolean;
  user?: any;
}

// Export these functions from aws-amplify/auth
export { signUp, confirmSignUp };

// AWS SDK client configuration
const getCognitoClient = () => {
  return new CognitoIdentityProviderClient({
    region: awsconfig.aws_project_region,
  });
};

// Check if username already exists - using our backend API now
export async function checkUsernameAvailability(
  username: string
): Promise<{isAvailable: boolean; message: string}> {
  try {
    const response = await fetch('/api/check-username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "아이디 확인 중 오류가 발생했습니다");
    }
    
    return {
      isAvailable: data.isAvailable,
      message: data.message
    };
  } catch (error: any) {
    console.error("Username availability check error:", error);
    throw new Error(error.message || "아이디 확인 중 오류가 발생했습니다");
  }
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

// 실제 전화번호 인증 시작 - AWS SNS를 사용하여 SMS 발송
export async function initiatePhoneVerification(
  email: string,
  name: string,
  phone: string
): Promise<SignUpResult> {
  try {
    // 전화번호 포맷팅 (010-1234-5678 -> +821012345678)
    const formattedPhone = formatPhoneNumber(phone);
    
    // API 서버에 인증 요청 전송
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: formattedPhone,
        user_email: email,
        user_name: name
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '인증번호 발송에 실패했습니다.');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || '인증번호 발송에 실패했습니다.');
    }
    
    console.log("Phone verification initiated for:", formattedPhone);
    
    return {
      success: true,
      message: "인증번호가 발송되었습니다.",
    };
  } catch (error: any) {
    console.error("Phone verification error:", error);
    return {
      success: false,
      message: error.message || "전화번호 인증 과정에서 문제가 발생했습니다."
    };
  }
}

// 전화번호 인증코드 확인 (AWS SNS 인증코드 검증)
export async function verifyPhoneCode(
  phone: string,
  verificationCode: string
): Promise<SignUpResult> {
  try {
    // 전화번호 포맷팅 (010-1234-5678 -> +821012345678)
    const formattedPhone = formatPhoneNumber(phone);
    
    // API 서버에 인증코드 검증 요청
    const response = await fetch('/api/verify-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: formattedPhone,
        verification_code: verificationCode
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '인증번호 확인에 실패했습니다.');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || '인증번호 확인에 실패했습니다.');
    }
    
    return {
      success: true,
      message: "전화번호 인증이 완료되었습니다.",
    };
  } catch (error: any) {
    console.error("Phone verification code error:", error);
    return {
      success: false,
      message: error.message || "인증 코드 확인 중 문제가 발생했습니다."
    };
  }
}

// 실제 회원가입 처리 함수
export async function registerUser(
  username: string,
  password: string,
  name: string,
  phone: string
): Promise<SignUpResult> {
  try {
    // 전화번호 포맷팅 (010-1234-5678 -> +821012345678)
    const formattedPhone = formatPhoneNumber(phone);
    
    // API 서버에 회원가입 요청 전송
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        name,
        phone: formattedPhone
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || '회원가입에 실패했습니다.');
    }
    
    console.log("User registered successfully:", username);
    
    return {
      success: true,
      message: data.message,
      user: data.user
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "회원가입 과정에서 문제가 발생했습니다."
    };
  }
}
