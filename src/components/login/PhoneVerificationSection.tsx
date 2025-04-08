
import React from 'react';
import { Phone } from 'lucide-react';
import VerificationInput from './VerificationInput';
import VerificationCodeInput from './VerificationCodeInput';

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
  handleSendPhoneVerification: () => Promise<void>;
  handleVerifyPhoneCode: () => Promise<void>;
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
    <div className="flex flex-col gap-4">
      <VerificationInput
        label="휴대폰 번호"
        value={phoneNumber}
        setValue={setPhoneNumber}
        placeholder="010-0000-0000"
        icon={<Phone className="text-gray-500" size={20} />}
        isValid={phoneValid}
        verificationSent={phoneVerificationSent}
        verificationComplete={phoneVerificationComplete}
        timer={phoneTimer}
        isLoading={isLoading}
        formatTime={formatTime}
        onSendVerification={handleSendPhoneVerification}
      />

      {/* 전화번호 인증 코드 입력 */}
      {phoneVerificationSent && !phoneVerificationComplete && (
        <VerificationCodeInput
          label="전화번호 인증 코드"
          value={phoneVerificationCode}
          setValue={setPhoneVerificationCode}
          onVerify={handleVerifyPhoneCode}
          onResend={handleResendPhoneVerification}
          isLoading={isLoading}
          timerExpired={phoneTimerExpired}
        />
      )}
    </div>
  );
};

export default PhoneVerificationSection;
