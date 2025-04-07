
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Eye, EyeOff } from 'lucide-react';
import { signUp, confirmSignUp, signIn, signOut } from 'aws-amplify/auth';
import { toast } from '@/components/ui/use-toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_REGEX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

const TEMPORARY_PASSWORD = 'TempPassword123!';

const Signup = () => {
  const navigate = useNavigate();

  // -----------------------
  // State
  // -----------------------
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');

  // 이메일 인증 관련 상태
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState(''); // 사용자가 입력하는 인증코드
  const [verificationComplete, setVerificationComplete] = useState(false);

  // 전화번호 인증 관련 상태
  const [phoneVerificationSent, setPhoneVerificationSent] = useState(false);
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
  const [phoneVerificationComplete, setPhoneVerificationComplete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<{ minutes: number; seconds: number }>({ minutes: 3, seconds: 0 });
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  
  const [phoneTimer, setPhoneTimer] = useState<{ minutes: number; seconds: number }>({ minutes: 3, seconds: 0 });
  const [phoneTimerActive, setPhoneTimerActive] = useState(false);
  const [phoneTimerExpired, setPhoneTimerExpired] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);

  // 사용하지 않지만, 구조 유지를 위해 남겨둠 (기존 코드에서 실제 발송 코드로 사용되던 변수)
  const [actualVerificationCode, setActualVerificationCode] = useState('');

  // -----------------------
  // Effect: 이메일 / 비밀번호 / 전화번호 검증
  // -----------------------
  useEffect(() => {
    setEmailValid(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setPasswordValid(PASSWORD_REGEX.test(password));
    setPasswordMatch(password === confirmPassword && password !== '');
  }, [password, confirmPassword]);
  
  useEffect(() => {
    const isValid = PHONE_REGEX.test(phoneNumber);
    setPhoneValid(isValid);
    
    if (isValid) {
      // Format phone number as 010-1234-5678
      const formatted = phoneNumber
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
      setFormattedPhoneNumber(formatted);
    }
  }, [phoneNumber]);

  // -----------------------
  // Effect: 이메일 인증 타이머
  // -----------------------
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const { minutes, seconds } = prev;
          if (seconds > 0) {
            return { minutes, seconds: seconds - 1 };
          } else if (minutes > 0) {
            return { minutes: minutes - 1, seconds: 59 };
          } else {
            // 시간 만료
            setTimerActive(false);
            setTimerExpired(true);
            toast({
              title: '인증 시간 만료',
              description: '인증 코드가 만료되었습니다. 다시 인증해주세요.',
              variant: 'destructive',
            });
            return prev;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  // -----------------------
  // Effect: 전화번호 인증 타이머
  // -----------------------
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (phoneTimerActive) {
      interval = setInterval(() => {
        setPhoneTimer((prev) => {
          const { minutes, seconds } = prev;
          if (seconds > 0) {
            return { minutes, seconds: seconds - 1 };
          } else if (minutes > 0) {
            return { minutes: minutes - 1, seconds: 59 };
          } else {
            // 시간 만료
            setPhoneTimerActive(false);
            setPhoneTimerExpired(true);
            toast({
              title: '인증 시간 만료',
              description: '전화번호 인증 코드가 만료되었습니다. 다시 인증해주세요.',
              variant: 'destructive',
            });
            return prev;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phoneTimerActive]);

  // -----------------------
  // 함수: 시간 포맷
  // -----------------------
  const formatTime = (time: number): string => {
    return time < 10 ? `0${time}` : `${time}`;
  };

  // -----------------------
  // 함수: 뒤로가기
  // -----------------------
  const handleGoBack = () => {
    navigate('/login/auth');
  };

  // -----------------------
  // (Mock) 이메일 중복 체크
  // -----------------------
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      // 실제로는 백엔드 API 등을 통해 중복 체크를 해야 합니다.
      // 여기서는 예시로 몇 개만 지정
      const existingEmails = ['test@example.com', 'user@domain.com', 'admin@site.com'];
      return existingEmails.includes(email.toLowerCase());
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  // -----------------------
  // 버튼: 이메일 인증하기
  // → Cognito signUp()을 통해 실제 인증코드 이메일 발송
  // -----------------------
  const handleSendVerification = async () => {
    if (!emailValid) {
      toast({
        title: '이메일 형식 오류',
        description: '올바른 이메일 주소를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1) 이메일 중복 체크
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        toast({
          title: '가입 오류',
          description: '이미 가입된 이메일 주소입니다.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // 2) Cognito signUp 호출 (임시비밀번호 사용)
      await signUp({
        username: email,
        password: TEMPORARY_PASSWORD, // 임시 비밀번호
        options: {
          userAttributes: {
            email,
            name,
            phone_number: formattedPhoneNumber.startsWith('+') ? formattedPhoneNumber : `+82${formattedPhoneNumber.replace(/-/g, '').substring(1)}`
          },
          autoSignIn: { enabled: false }, // 임시 가입이므로 자동 로그인은 off
        },
      });

      // Cognito가 이메일로 인증코드를 보내므로, 사용자에게 "코드 입력" 안내
      setVerificationSent(true);
      setTimerActive(true);
      setTimerExpired(false);
      setTimer({ minutes: 3, seconds: 0 });

      toast({
        title: '인증 코드 발송',
        description: '이메일로 인증 코드가 발송되었습니다. 이메일을 확인해주세요.',
      });
    } catch (error) {
      console.error('Cognito signUp 에러:', error);
      toast({
        title: '인증 코드 발송 실패',
        description:
          error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------
  // 버튼: 전화번호 인증하기 (모의 구현)
  // -----------------------
  const handleSendPhoneVerification = () => {
    if (!phoneValid) {
      toast({
        title: '전화번호 형식 오류',
        description: '올바른 전화번호를 입력해주세요. (예: 010-1234-5678)',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // 모의 인증번호 발송 (실제로는 SMS 서비스 연동 필요)
    setTimeout(() => {
      setPhoneVerificationSent(true);
      setPhoneTimerActive(true);
      setPhoneTimerExpired(false);
      setPhoneTimer({ minutes: 3, seconds: 0 });

      // 모의 코드 - 실제로는 서버에서 생성하여 SMS로 전송됨
      // 모의 테스트 용도로는 항상 "123456"을 코드로 사용
      setActualVerificationCode("123456");
      
      toast({
        title: '인증 코드 발송',
        description: `${formattedPhoneNumber}로 인증 코드가 발송되었습니다.`,
      });
      
      setIsLoading(false);
    }, 1000);
  };

  // -----------------------
  // 버튼: 이메일 인증하기 (코드 확인)
  // → Cognito confirmSignUp()을 통해 이메일 인증코드 검증
  // -----------------------
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      toast({
        title: '인증 코드 오류',
        description: '올바른 인증 코드를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (timerExpired) {
      toast({
        title: '인증 코드 만료',
        description: '인증 시간이 만료되었습니다. 다시 인증해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Cognito에 입력한 코드를 전달하여 가입 인증
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode
      });
      
      setVerificationComplete(true);
      setTimerActive(false);

      toast({
        title: '인증 완료',
        description: '이메일 인증이 완료되었습니다.',
      });
    } catch (err) {
      toast({
        title: '인증 코드 오류',
        description: '코드가 맞지 않거나 만료되었습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
      console.error('confirmSignUp 에러:', err);
    }
  };

  // -----------------------
  // 버튼: 전화번호 인증하기 (코드 확인) - 모의 구현
  // -----------------------
  const handleVerifyPhoneCode = () => {
    if (!phoneVerificationCode || phoneVerificationCode.length < 6) {
      toast({
        title: '인증 코드 오류',
        description: '올바른 인증 코드를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (phoneTimerExpired) {
      toast({
        title: '인증 코드 만료',
        description: '인증 시간이 만료되었습니다. 다시 인증해주세요.',
        variant: 'destructive',
      });
      return;
    }

    // 모의 코드 검증 - 실제로는 서버에서 검증
    // 테스트를 위해 "123456"을 유효한 코드로 간주
    if (phoneVerificationCode === "123456") {
      setPhoneVerificationComplete(true);
      setPhoneTimerActive(false);

      toast({
        title: '인증 완료',
        description: '전화번호 인증이 완료되었습니다.',
      });
    } else {
      toast({
        title: '인증 코드 오류',
        description: '코드가 맞지 않습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    }
  };

  // -----------------------
  // 버튼: 회원가입 (최종)
  // → 인증 완료 후, 사용자가 입력한 실제 비밀번호로 변경
  // -----------------------
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword || !phoneNumber) {
      toast({
        title: '입력 오류',
        description: '모든 필드를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (!emailValid) {
      toast({
        title: '이메일 형식 오류',
        description: '올바른 이메일 주소를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (!passwordValid) {
      toast({
        title: '비밀번호 오류',
        description: '비밀번호는 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: '비밀번호 불일치',
        description: '비밀번호가 일치하지 않습니다.',
        variant: 'destructive',
      });
      return;
    }

    if (!verificationComplete) {
      toast({
        title: '이메일 인증 필요',
        description: '이메일 인증을 완료해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (!phoneVerificationComplete) {
      toast({
        title: '전화번호 인증 필요',
        description: '전화번호 인증을 완료해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 우선 로그인하기 전에 기존 세션이 있다면 제거 (이전 에러의 잠재적 원인)
      try {
        await signOut();
      } catch (e) {
        // 로그인된 상태가 아니면 에러가 발생할 수 있으나 무시
        console.log("로그아웃 과정에서 에러 발생 (이미 로그아웃 상태일 수 있음):", e);
      }
      
      // 1) 임시비밀번호로 로그인 시도
      const signInResponse = await signIn({
        username: email,
        password: TEMPORARY_PASSWORD
      });
      
      console.log("로그인 응답:", signInResponse);
      
      // 2) 비밀번호 변경이 필요한 경우
      if (signInResponse.nextStep && 
          signInResponse.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        
        console.log("새 비밀번호 설정 필요");
        
        // 새 비밀번호로 로그인 완료
        await signIn({
          username: email,
          password: TEMPORARY_PASSWORD,
          options: {
            userAttributes: {
              password: password
            }
          }
        });
        
        console.log("새 비밀번호 설정 성공");
      }

      // 최종 로그아웃 (회원가입 완료 후 별도 로그인 화면으로 이동)
      await signOut();

      toast({
        title: '회원가입 성공',
        description: '환영합니다!',
      });

      // 회원가입 성공 시 로그인 페이지로 이동 (이메일 정보를 전달)
      navigate(`/login/login?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('회원가입(최종) 에러:', error);

      // 상세한 에러 정보 표시
      if (error instanceof Error) {
        toast({
          title: '회원가입 실패',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: '회원가입 실패',
          description: '알 수 없는 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------
  // 버튼: 인증 코드 재발송
  // -----------------------
  const handleResendVerification = () => {
    setVerificationSent(false);
    setVerificationCode('');
    setVerificationComplete(false);
    setTimerActive(false);
    setTimerExpired(false);
    handleSendVerification();
  };

  // -----------------------
  // 버튼: 전화번호 인증 코드 재발송
  // -----------------------
  const handleResendPhoneVerification = () => {
    setPhoneVerificationSent(false);
    setPhoneVerificationCode('');
    setPhoneVerificationComplete(false);
    setPhoneTimerActive(false);
    setPhoneTimerExpired(false);
    handleSendPhoneVerification();
  };

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="w-full min-h-screen bg-[#181A20] flex flex-col">
      {/* 상단 헤더 */}
      <div className="flex w-full h-14 items-center px-5">
        <button onClick={handleGoBack} className="flex items-center">
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-white font-pretendard text-[20px] font-medium mx-auto">가입하기</h1>
      </div>

      {/* 입력 필드들 */}
      <div className="flex flex-col px-5 gap-8 mt-[43px] overflow-y-auto">
        {/* 이름 */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
            이름
          </label>
          <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해 주세요"
              className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
            />
          </div>
        </div>

        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
            이메일
          </label>
          <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px] relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해 주세요"
              className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
              disabled={verificationSent}
            />
            {/* '인증하기' 버튼 */}
            {emailValid && !verificationSent && !verificationComplete && (
              <button
                onClick={handleSendVerification}
                disabled={isLoading}
                className="absolute right-4 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
              >
                인증하기
              </button>
            )}
            {/* 타이머 표시 */}
            {verificationSent && !verificationComplete && (
              <div className="absolute right-4 text-sm text-gray-400">
                {formatTime(timer.minutes)}:{formatTime(timer.seconds)}
              </div>
            )}
            {/* 인증완료 표시 */}
            {verificationComplete && (
              <div className="absolute right-4 text-sm text-green-500">인증완료</div>
            )}
          </div>
        </div>

        {/* 인증 코드 입력 (이메일 인증 과정) */}
        {verificationSent && !verificationComplete && (
          <div className="flex flex-col gap-2">
            <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
              인증 코드
            </label>
            <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증 코드 6자리"
                maxLength={6}
                className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || !verificationCode || verificationCode.length < 6}
                className="w-full h-[50px] rounded-[18px] bg-blue-500 text-white font-semibold text-base flex items-center justify-center disabled:opacity-50"
              >
                인증하기
              </button>
              {timerExpired && (
                <button
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="text-bodhi-orange underline text-sm mt-2 text-center"
                >
                  인증 코드 재발송
                </button>
              )}
            </div>
          </div>
        )}

        {/* 전화번호 입력 */}
        <div className="flex flex-col gap-2">
          <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
            휴대폰 번호
          </label>
          <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px] relative">
            <Phone className="text-gray-500 mr-2" size={20} />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
              disabled={phoneVerificationSent && phoneVerificationComplete}
            />
            {/* '인증하기' 버튼 */}
            {phoneValid && !phoneVerificationSent && !phoneVerificationComplete && (
              <button
                onClick={handleSendPhoneVerification}
                disabled={isLoading}
                className="absolute right-4 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
              >
                인증하기
              </button>
            )}
            {/* 타이머 표시 */}
            {phoneVerificationSent && !phoneVerificationComplete && (
              <div className="absolute right-4 text-sm text-gray-400">
                {formatTime(phoneTimer.minutes)}:{formatTime(phoneTimer.seconds)}
              </div>
            )}
            {/* 인증완료 표시 */}
            {phoneVerificationComplete && (
              <div className="absolute right-4 text-sm text-green-500">인증완료</div>
            )}
          </div>
        </div>

        {/* 전화번호 인증 코드 입력 */}
        {phoneVerificationSent && !phoneVerificationComplete && (
          <div className="flex flex-col gap-2">
            <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
              전화번호 인증 코드
            </label>
            <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
              <input
                type="text"
                value={phoneVerificationCode}
                onChange={(e) => setPhoneVerificationCode(e.target.value)}
                placeholder="인증 코드 6자리"
                maxLength={6}
                className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleVerifyPhoneCode}
                disabled={isLoading || !phoneVerificationCode || phoneVerificationCode.length < 6}
                className="w-full h-[50px] rounded-[18px] bg-blue-500 text-white font-semibold text-base flex items-center justify-center disabled:opacity-50"
              >
                인증하기
              </button>
              {phoneTimerExpired && (
                <button
                  onClick={handleResendPhoneVerification}
                  disabled={isLoading}
                  className="text-bodhi-orange underline text-sm mt-2 text-center"
                >
                  인증 코드 재발송
                </button>
              )}
            </div>
          </div>
        )}

        {/* 비밀번호 / 비밀번호 확인 (이메일 인증완료 후에만 노출) */}
        {verificationComplete && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
                비밀번호
              </label>
              <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px] relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해 주세요"
                  className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none pr-10"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)} 
                  type="button"
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-400" size={20} />
                  ) : (
                    <Eye className="text-gray-400" size={20} />
                  )}
                </button>
              </div>
              {password && !passwordValid && (
                <p className="text-red-500 text-xs mt-1">
                  비밀번호는 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
                비밀번호 확인
              </label>
              <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px] relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력해 주세요"
                  className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none pr-10"
                />
                <button 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  type="button"
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="text-gray-400" size={20} />
                  ) : (
                    <Eye className="text-gray-400" size={20} />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <p
                  className={`text-xs mt-1 ${
                    passwordMatch ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* 회원가입 버튼 */}
      <div className="flex flex-col gap-8 px-5 mt-8 mb-4">
        <button
          onClick={handleSignup}
          disabled={
            isLoading ||
            !name ||
            !emailValid ||
            !verificationComplete ||
            !phoneValid ||
            !phoneVerificationComplete ||
            !passwordValid ||
            !passwordMatch
          }
          className="flex justify-center items-center w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-pretendard font-medium tracking-[-0.45px] disabled:opacity-50"
        >
          회원가입
        </button>
      </div>

      {/* 하단: 이미 계정이 있으신가요? */}
      <div className="flex justify-center items-center gap-1.5 mt-auto mb-[20px]">
        <span className="text-[#9EA3B2] font-pretendard text-[14px] font-normal tracking-[-0.35px]">
          이미 계정이 있으신가요?
        </span>
        <button
          onClick={() => navigate('/login/login')}
          className="text-bodhi-orange font-pretendard text-[14px] font-semibold tracking-[-0.35px] underline cursor-pointer"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default Signup;
