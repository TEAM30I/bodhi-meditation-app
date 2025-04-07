
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from '@/components/ui/use-toast';

// 비밀번호 재설정 모드
type ResetMode = 'selectMethod' | 'verifyCode' | 'newPassword' | 'complete';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ResetMode>('selectMethod');
  
  // 메소드 선택 화면 상태
  const [selectedMethod, setSelectedMethod] = useState<'phone' | 'email' | null>(null);
  
  // 코드 검증 화면 상태
  const [verificationCode, setVerificationCode] = useState('');
  const [timer, setTimer] = useState<{ minutes: number; seconds: number }>({ minutes: 3, seconds: 0 });
  const [timerActive, setTimerActive] = useState(false);
  
  // 새 비밀번호 설정 화면 상태
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // 전화번호와 이메일 (실제로는 서버에서 가져옴)
  const phone = '010-1234-5678';
  const email = 'bodhi@gmail.com';

  // 타이머 효과
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
            toast({
              title: '인증 시간 만료',
              description: '인증 코드가 만료되었습니다. 다시 요청해주세요.',
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

  const handleGoBack = () => {
    if (mode === 'selectMethod') {
      navigate('/login/find-account');
    } else if (mode === 'verifyCode') {
      setMode('selectMethod');
    } else if (mode === 'newPassword') {
      setMode('verifyCode');
    } else {
      navigate('/login/login');
    }
  };

  const handleMethodSelect = (method: 'phone' | 'email') => {
    setSelectedMethod(method);
  };

  const handleSendCode = () => {
    if (!selectedMethod) return;
    
    setMode('verifyCode');
    setTimerActive(true);
    setTimer({ minutes: 3, seconds: 0 });
    
    toast({
      title: '인증 코드 발송',
      description: selectedMethod === 'phone' 
        ? `${phone}로 인증 코드가 발송되었습니다.` 
        : `${email}로 인증 코드가 발송되었습니다.`,
    });
  };

  const handleCodeVerify = () => {
    // 모의 인증: 실제로는 서버 검증 필요
    if (verificationCode.length < 4) {
      toast({
        title: '인증 코드 오류',
        description: '4자리 코드를 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    
    setMode('newPassword');
  };

  const handlePasswordReset = () => {
    // 비밀번호 유효성 확인
    if (newPassword.length < 8) {
      toast({
        title: '비밀번호 오류',
        description: '비밀번호는 8자 이상이어야 합니다.',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: '비밀번호 불일치',
        description: '비밀번호가 일치하지 않습니다.',
        variant: 'destructive',
      });
      return;
    }
    
    // 성공 시 완료 화면으로
    setMode('complete');
  };

  const formatTime = (time: number): string => {
    return time < 10 ? `0${time}` : `${time}`;
  };

  return (
    <div className="w-full min-h-screen bg-[#181A20] flex flex-col">
      {/* 상단 헤더 */}
      <div className="flex w-full h-14 items-center px-5">
        <button onClick={handleGoBack} className="flex items-center">
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-white font-pretendard text-[20px] font-medium mx-auto">
          {mode === 'selectMethod' && '비밀번호 찾기'}
          {mode === 'verifyCode' && '코드입력'}
          {mode === 'newPassword' && '새로운 비밀번호'}
          {mode === 'complete' && '비밀번호 재설정'}
        </h1>
      </div>

      {/* 메소드 선택 화면 */}
      {mode === 'selectMethod' && (
        <div className="flex flex-col px-8 mt-6">
          <p className="text-[#9EA3BE] font-pretendard text-[14px] leading-5 mb-8 max-w-[213px]">
            암호를 재설정하는 데 필요한 코드번호를 받으실 방법을 선택해 주세요
          </p>
          
          <div className="flex flex-col gap-3 mt-10">
            <button 
              className={`flex items-center p-7 rounded-[20px] border ${
                selectedMethod === 'phone' ? 'border-bodhi-orange bg-opacity-10 bg-bodhi-orange' : 'border-[#35383F] bg-[#252932]'
              }`}
              onClick={() => handleMethodSelect('phone')}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  selectedMethod === 'phone' ? 'bg-bodhi-orange bg-opacity-10' : 'bg-[#181A20]'
                }`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.0001 2C6.48012 2 2.00012 6.48 2.00012 12C2.00012 17.52 6.48012 22 12.0001 22C17.5201 22 22.0001 17.52 22.0001 12C22.0001 6.48 17.5201 2 12.0001 2ZM15.5301 17.65C15.3901 17.93 15.1201 18.09 14.8301 18.09C14.7001 18.09 14.5701 18.06 14.4501 18C13.8001 17.67 12.9801 17.09 12.2501 16.34C11.3101 15.4 10.8401 14.58 10.5101 13.93C10.0201 12.9 10.1501 12.05 10.8401 11.36C11.0801 11.12 11.3701 11 11.7001 11C12.0301 11 12.3201 11.12 12.5601 11.36C12.7801 11.58 12.8701 11.75 13.1001 12.19C13.2402 12.46 13.2501 12.9 13.0701 13.08C12.9101 13.24 12.8601 13.29 12.7801 13.37C12.7401 13.41 12.6801 13.45 12.6301 13.5C12.4301 13.72 12.4001 13.77 12.4601 13.93C12.5801 14.2 12.9401 14.82 13.4701 15.32C14.1101 15.95 14.6101 16.18 14.8901 16.24C14.9501 16.25 14.9901 16.24 15.0201 16.22C15.0701 16.19 15.1201 16.13 15.1901 16.04C15.2901 15.93 15.3301 15.88 15.4301 15.81C15.4901 15.77 15.5301 15.73 15.5701 15.69C15.7501 15.54 16.1901 15.53 16.4701 15.65C16.9001 15.85 17.0801 15.95 17.3101 16.18C17.5601 16.42 17.6801 16.72 17.6801 17.05C17.6801 17.38 17.5601 17.68 17.3101 17.92C17.0801 18.16 16.9201 18.27 16.5701 18.47C16.2201 18.67 15.7501 18.41 15.5301 17.65Z" fill="#777C89"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#9EA3B2] text-sm">휴대폰 번호</span>
                  <span className="text-white text-base font-medium">{phone}</span>
                </div>
              </div>
            </button>
            
            <button 
              className={`flex items-center p-7 rounded-[20px] ${
                selectedMethod === 'email' ? 'border-bodhi-orange bg-opacity-10 bg-bodhi-orange' : 'border-[#35383F] bg-[#252932]'
              }`}
              onClick={() => handleMethodSelect('email')}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  selectedMethod === 'email' ? 'bg-bodhi-orange bg-opacity-10' : 'bg-[#181A20]'
                }`}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.20917 22.2397C5.59734 22.2397 5.07618 22.0245 4.64571 21.594C4.21524 21.1635 4 20.6424 4 20.0306V8.23267C4 7.61437 4.21524 7.08769 4.64571 6.65262C5.07618 6.21754 5.59734 6 6.20917 6H21.7673C22.3856 6 22.9123 6.21754 23.3474 6.65262C23.7825 7.08769 24 7.61437 24 8.23267V20.0306C24 20.6424 23.7825 21.1635 23.3474 21.594C22.9123 22.0245 22.3856 22.2397 21.7673 22.2397H6.20917ZM13.9882 15.0717C14.0979 15.0717 14.1998 15.056 14.2938 15.0247C14.3878 14.9933 14.4907 14.9459 14.6026 14.8825L21.4383 10.3008C21.5166 10.2617 21.5911 10.1853 21.6616 10.0717C21.7321 9.95809 21.7673 9.82871 21.7673 9.68355C21.7673 9.41143 21.6381 9.18776 21.3796 9.01255C21.121 8.83732 20.8586 8.84371 20.5922 9.03173L13.9882 13.3561L7.40776 9.03173C7.1414 8.85938 6.87505 8.84371 6.6087 8.98472C6.34234 9.12573 6.20917 9.35167 6.20917 9.66254C6.20917 9.80142 6.24834 9.92685 6.32667 10.0388C6.40501 10.1508 6.48483 10.2387 6.56613 10.3024L13.3744 14.8825C13.486 14.946 13.5887 14.9933 13.6827 15.0247C13.7767 15.056 13.8786 15.0717 13.9882 15.0717Z" fill="#777C89" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#9EA3B2] text-sm">이메일</span>
                  <span className={selectedMethod === 'email' ? "text-white text-base font-medium" : "text-[#9EA3B2] text-base"}>{email}</span>
                </div>
              </div>
            </button>
          </div>
          
          <div className="fixed bottom-10 left-5 right-5">
            <button
              onClick={handleSendCode}
              disabled={!selectedMethod}
              className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-medium disabled:opacity-50"
            >
              코드 보내기
            </button>
          </div>
        </div>
      )}

      {/* 코드 입력 화면 */}
      {mode === 'verifyCode' && (
        <div className="flex flex-col px-8 mt-20 items-center">
          <div className="flex flex-col items-center gap-8 w-full max-w-[296px]">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-[#9EA3B2] text-sm">
                복구 코드가 귀하에게 전달되었습니다
                전달 받은 코드를 2분 안에 입력 하셔야 합니다
              </p>
              <p className="text-sm">
                <span className="text-white font-bold">{selectedMethod === 'phone' ? phone : email}</span>
                <span className="text-[#9EA3B2]">로 코드를 보냈습니다</span>
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-3 w-full">
              <InputOTP maxLength={4} value={verificationCode} onChange={setVerificationCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-[68px] h-[68px] bg-[#252932] text-white text-2xl" />
                  <InputOTPSlot index={1} className="w-[68px] h-[68px] bg-[#252932] text-white text-2xl" />
                  <InputOTPSlot index={2} className="w-[68px] h-[68px] bg-[#252932] text-white text-2xl" />
                  <InputOTPSlot index={3} className="w-[68px] h-[68px] bg-[#252932] text-white text-2xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <div className="text-center">
              <span className="text-[#9EA3B2] text-sm">코드 입력까지 </span>
              <span className="text-bodhi-orange text-base">
                {formatTime(timer.minutes)}:{formatTime(timer.seconds)}
              </span>
              <span className="text-[#9EA3B2] text-sm"> 남았습니다.</span>
            </div>
            
            <button
              onClick={handleCodeVerify}
              disabled={verificationCode.length < 4}
              className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-medium disabled:opacity-50"
            >
              입력완료
            </button>
          </div>
        </div>
      )}

      {/* 새 비밀번호 입력 화면 */}
      {mode === 'newPassword' && (
        <div className="flex flex-col px-5 mt-6">
          <div className="flex flex-col gap-3 mb-10">
            <p className="text-[#9EA3B2] text-sm leading-5">
              새로운 비밀번호를 입력해주세요
              이전에 사용하셨던 비밀번호는 사용하실 수 없습니다
            </p>
            
            <p className="text-sm">
              <span className="text-white font-bold">{selectedMethod === 'phone' ? phone : email}</span>
              <span className="text-[#9EA3B2]">로 코드를 보냈습니다</span>
            </p>
          </div>
          
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <label className="text-[#9EA3BE] text-sm">
                새로운 비밀번호
              </label>
              <div className="flex items-center rounded-[16px] bg-opacity-10 bg-bodhi-orange border border-bodhi-orange w-full h-[60px] px-5 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[#9EA3BE] text-sm">
                비밀번호 재입력
              </label>
              <div className="flex items-center rounded-[16px] bg-[#252932] w-full h-[60px] px-5 relative">
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
            </div>
          </div>
          
          <div className="fixed bottom-10 left-5 right-5">
            <button
              onClick={handlePasswordReset}
              disabled={!newPassword || !confirmPassword}
              className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-medium disabled:opacity-50"
            >
              재설정 완료
            </button>
          </div>
        </div>
      )}

      {/* 완료 화면 */}
      {mode === 'complete' && (
        <div className="flex flex-col items-center justify-center px-5" style={{ height: 'calc(100vh - 56px)' }}>
          <h2 className="text-white text-[28px] font-semibold mb-4">비밀번호 재설정 완료</h2>
          <p className="text-[#9EA3B2] text-center mb-10">
            새로운 비밀번호로 재설정 되었습니다
            신규 비밀번호를 입력하셔서 로그인을 진행하세요
          </p>
          
          <button
            onClick={() => navigate('/login/login')}
            className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-medium"
          >
            로그인
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
