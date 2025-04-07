
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

interface EmailVerificationSectionProps {
  email: string;
  setEmail: (email: string) => void;
  emailValid: boolean;
  verificationSent: boolean;
  setVerificationSent: (sent: boolean) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  verificationComplete: boolean;
  setVerificationComplete: (complete: boolean) => void;
  timerExpired: boolean;
  setTimerExpired: (expired: boolean) => void;
  timer: { minutes: number; seconds: number };
  setTimer: (timer: { minutes: number; seconds: number }) => void;
  timerActive: boolean;
  setTimerActive: (active: boolean) => void;
  isLoading: boolean;
  formatTime: (time: number) => string;
  handleSendVerification: () => Promise<void>;
  handleVerifyCode: () => Promise<void>;
  handleResendVerification: () => void;
}

const EmailVerificationSection: React.FC<EmailVerificationSectionProps> = ({
  email,
  setEmail,
  emailValid,
  verificationSent,
  setVerificationSent,
  verificationCode,
  setVerificationCode,
  verificationComplete,
  timerExpired,
  timer,
  isLoading,
  formatTime,
  handleSendVerification,
  handleVerifyCode,
  handleResendVerification,
}) => {
  return (
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
    </div>
  );
};

export default EmailVerificationSection;
