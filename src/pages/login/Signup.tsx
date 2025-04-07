import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Auth } from 'aws-amplify'; // <-- aws-amplify/auth 대신 Auth 모듈 임포트
import { toast } from '@/components/ui/use-toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Cognito 가입 시 임시로 사용할 비밀번호 (UI에서 입력받지 않고 내부적으로만 사용)
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

  // 이메일 인증 관련 상태
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState(''); // 사용자가 입력하는 인증코드
  const [verificationComplete, setVerificationComplete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState<{ minutes: number; seconds: number }>({ minutes: 3, seconds: 0 });
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  // Validation
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  // 사용하지 않지만, 구조 유지를 위해 남겨둠 (기존 코드에서 실제 발송 코드로 사용되던 변수)
  const [actualVerificationCode, setActualVerificationCode] = useState('');

  // -----------------------
  // Effect: 이메일 / 비밀번호 검증
  // -----------------------
  useEffect(() => {
    setEmailValid(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setPasswordValid(PASSWORD_REGEX.test(password));
    setPasswordMatch(password === confirmPassword && password !== '');
  }, [password, confirmPassword]);

  // -----------------------
  // Effect: 타이머
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
  // 버튼: 인증하기
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
      await Auth.signUp({
        username: email,
        password: TEMPORARY_PASSWORD, // 임시 비밀번호
        attributes: {
          email,
          name,
        },
        autoSignIn: { enabled: false }, // 임시 가입이므로 자동 로그인은 off
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
  // 버튼: 인증하기 (코드 확인)
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
      await Auth.confirmSignUp(email, verificationCode);
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
  // 버튼: 회원가입 (최종)
  // → 인증 완료 후, 사용자가 입력한 실제 비밀번호로 변경
  // 1) Auth.signIn(임시비밀번호) → 2) Auth.completeNewPassword(실제비밀번호)
  // -----------------------
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
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

    setIsLoading(true);

    try {
      // 1) 임시비밀번호로 로그인
      const user = await Auth.signIn(email, TEMPORARY_PASSWORD);

      // 2) 실제 비밀번호 설정
      const finalUser = await Auth.completeNewPassword(user, password);
      console.log('completeNewPassword 응답:', finalUser);

      toast({
        title: '회원가입 성공',
        description: '환영합니다!',
      });

      // 회원가입 성공 시 로그인 페이지로 이동 (이메일 정보를 전달)
      navigate(`/login/login?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('회원가입(최종) 에러:', error);

      // 이미 가입된 경우 등 에러 처리
      if (error instanceof Error && error.message.includes('already exists')) {
        toast({
          title: '회원가입 실패',
          description: '이미 가입된 이메일 주소입니다.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '회원가입 실패',
          description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
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
      <div className="flex flex-col px-5 gap-12 mt-[43px]">
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

        {/* 비밀번호 / 비밀번호 확인 (인증완료 후에만 노출) */}
        {verificationComplete && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
                비밀번호
              </label>
              <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해 주세요"
                  className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
                />
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
              <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력해 주세요"
                  className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
                />
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
      <div className="flex flex-col gap-12 px-5 mt-8">
        <button
          onClick={handleSignup}
          disabled={
            isLoading ||
            !name ||
            !emailValid ||
            !verificationComplete ||
            !passwordValid ||
            !passwordMatch
          }
          className="flex justify-center items-center w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-pretendard font-medium tracking-[-0.45px] disabled:opacity-50"
        >
          회원가입
        </button>

        {/* 아래는 기존 예시의 SNS/기타 버튼 영역 */}
        <div className="flex justify-center items-center gap-3">
          <div className="flex justify-center items-center w-[110px] h-[60px] rounded-[16px] border border-[#35383F] bg-[#1F222A]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 12C0 5.3726 5.3726 0 12 0C18.6274 0 24 5.3726 24 12C24 18.6274 18.6274 24 12 24C5.3726 24 0 18.6274 0 12Z"
                fill="#676E81"
              />
              <path
                d="M12 5.5C7.5817 5.5 4 8.3241 4 11.8077C4 14.0599 5.4974 16.0361 7.74985 17.1521C7.6273 17.5747 6.9624 19.8709 6.9359 20.0513C6.9359 20.0513 6.92 20.1868 7.00775 20.2385C7.09555 20.2901 7.19875 20.25 7.19875 20.25C7.45045 20.2149 10.1175 18.3415 10.5791 18.0162C11.0403 18.0815 11.5151 18.1154 12 18.1154C16.4183 18.1154 20 15.2914 20 11.8077C20 8.3241 16.4183 5.5 12 5.5Z"
                fill="#381F1F"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.57686 14.0096C7.32231 14.0096 7.11531 13.8119 7.11531 13.5688V10.8269H6.39516C6.14541 10.8269 5.94226 10.6241 5.94226 10.375C5.94226 10.1258 6.14546 9.9231 6.39516 9.9231H8.75856C9.00831 9.9231 9.21146 10.1258 9.21146 10.375C9.21146 10.6241 9.00826 10.8269 8.75856 10.8269H8.03841V13.5688C8.03841 13.8119 7.83141 14.0096 7.57686 14.0096ZM11.6239 14.0036C11.4315 14.0036 11.2843 13.9255 11.2399 13.7998L11.0113 13.2015L9.60391 13.2014L9.37526 13.8001C9.33101 13.9255 9.18386 14.0036 8.99141 14.0036C8.89016 14.0037 8.79006 13.982 8.69801 13.9399C8.57076 13.8812 8.44846 13.7198 8.58861 13.2845L9.69261 10.3787C9.77041 10.1577 10.0066 9.93 10.3073 9.92315C10.6087 9.92995 10.8449 10.1577 10.9229 10.3791L12.0264 13.2837C12.1669 13.72 12.0446 13.8815 11.9173 13.94C11.8252 13.982 11.7252 14.0037 11.6239 14.0036ZM10.3076 11.0743L10.7686 12.3839H9.84661L10.3076 11.0743ZM12.7692 13.9423C12.5252 13.9423 12.3269 13.7525 12.3269 13.5192V10.3846C12.3269 10.1301 12.5382 9.9231 12.798 9.9231C13.0578 9.9231 13.2692 10.1301 13.2692 10.3846V13.0961H14.2499C14.4939 13.0961 14.6923 13.286 14.6923 13.5192C14.6923 13.7525 14.4939 13.9423 14.2499 13.9423H12.7692ZM14.8718 13.5421C14.8718 13.7966 15.0788 14.0036 15.3333 14.0036C15.4557 14.0034 15.5731 13.9547 15.6596 13.8682C15.7462 13.7816 15.7949 13.6643 15.795 13.5418V12.5348L15.9552 12.3747L17.0376 13.8088C17.0804 13.8661 17.1361 13.9125 17.2001 13.9444C17.2641 13.9762 17.3347 13.9926 17.4062 13.9923C17.5065 13.9925 17.6041 13.9598 17.6839 13.8991C17.7324 13.8628 17.7732 13.8172 17.8039 13.7649C17.8346 13.7127 17.8547 13.6548 17.8629 13.5948C17.8716 13.5347 17.8682 13.4736 17.8529 13.4149C17.8377 13.3562 17.811 13.3011 17.7743 13.2528L16.6382 11.7478L17.69 10.6961C17.7623 10.6238 17.7986 10.524 17.7919 10.4151C17.7852 10.3072 17.737 10.2033 17.6562 10.1225C17.5695 10.0359 17.4538 9.98625 17.3386 9.98625C17.2398 9.98625 17.1488 10.0227 17.0826 10.0889L15.7949 11.3766V10.3846C15.7949 10.1301 15.5879 9.9231 15.3333 9.9231C15.0788 9.9231 14.8718 10.1301 14.8718 10.3846V13.5421Z"
                fill="#676E81"
              />
            </svg>
          </div>

          <div className="flex justify-center items-center w-[110px] h-[60px] rounded-[16px] border border-[#35383F] bg-[#1F222A]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="12" fill="#03C75A" />
              <path d="M14.1365 12.4225L9.68799 6H6V18H9.86299V11.578L14.312 18H18V6H14.1365V12.4225Z" fill="#FFFFFF" />
            </svg>
          </div>
        </div>
      </div>

      {/* 하단: 이미 계정이 있으신가요? */}
      <div className="flex justify-center items-center gap-1.5 mt-auto mb-[65px]">
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
