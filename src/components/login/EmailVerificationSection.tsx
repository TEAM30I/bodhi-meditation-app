
import React from 'react';
import VerificationInput from './VerificationInput';
import VerificationCodeInput from './VerificationCodeInput';

interface EmailVerificationSectionProps {
  email: string;
  setEmail: (email: string) => void;
  emailValid: boolean;
  verificationSent: boolean;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  verificationComplete: boolean;
  timerExpired: boolean;
  timer: { minutes: number; seconds: number };
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
    <div className="flex flex-col gap-4">
      <VerificationInput
        label="이메일"
        value={email}
        setValue={setEmail}
        placeholder="이메일을 입력해 주세요"
        isValid={emailValid}
        verificationSent={verificationSent}
        verificationComplete={verificationComplete}
        timer={timer}
        isLoading={isLoading}
        formatTime={formatTime}
        onSendVerification={handleSendVerification}
      />
      
      {/* 이메일 인증 코드 입력 */}
      {verificationSent && !verificationComplete && (
        <VerificationCodeInput
          label="인증 코드"
          value={verificationCode}
          setValue={setVerificationCode}
          onVerify={handleVerifyCode}
          onResend={handleResendVerification}
          isLoading={isLoading}
          timerExpired={timerExpired}
        />
      )}
    </div>
  );
};

export default EmailVerificationSection;
