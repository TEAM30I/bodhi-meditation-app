
import React from 'react';
import { Phone } from 'lucide-react';

interface PhoneVerificationSectionProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  phoneValid: boolean;
  phoneVerificationSent: boolean;
  phoneVerificationComplete: boolean;
  phoneVerificationCode: string;
  setPhoneVerificationCode: (code: string) => void;
  phoneTimer: { minutes: number; seconds: number };
  phoneTimerExpired: boolean;
  isLoading: boolean;
  formatTime: (time: number) => string;
  handleSendPhoneVerification: () => void;
  handleVerifyPhoneCode: () => void;
  handleResendPhoneVerification: () => void;
}

const PhoneVerificationSection: React.FC<PhoneVerificationSectionProps> = ({
  phoneNumber,
  setPhoneNumber,
  phoneValid,
  phoneVerificationSent,
  phoneVerificationComplete,
  phoneVerificationCode,
  setPhoneVerificationCode,
  phoneTimer,
  phoneTimerExpired,
  isLoading,
  formatTime,
  handleSendPhoneVerification,
  handleVerifyPhoneCode,
  handleResendPhoneVerification,
}) => {
  return (
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
    </div>
  );
};

export default PhoneVerificationSection;
