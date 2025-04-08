
import React from 'react';

interface VerificationInputProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  isValid: boolean;
  verificationSent: boolean;
  verificationComplete: boolean;
  timer?: { minutes: number; seconds: number };
  isLoading: boolean;
  formatTime: (time: number) => string;
  onSendVerification: () => void;
  disabled?: boolean;
}

const VerificationInput: React.FC<VerificationInputProps> = ({
  label,
  value,
  setValue,
  placeholder,
  icon,
  isValid,
  verificationSent,
  verificationComplete,
  timer,
  isLoading,
  formatTime,
  onSendVerification,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
        {label}
      </label>
      <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px] relative">
        {icon && <span className="text-gray-500 mr-2">{icon}</span>}
        <input
          type={label.includes('이메일') ? 'email' : 'tel'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
          disabled={disabled || verificationSent && verificationComplete}
        />
        
        {/* '인증하기' 버튼 */}
        {isValid && !verificationSent && !verificationComplete && (
          <button
            onClick={onSendVerification}
            disabled={isLoading}
            className="absolute right-4 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
          >
            인증하기
          </button>
        )}
        
        {/* 타이머 표시 */}
        {verificationSent && !verificationComplete && timer && (
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
  );
};

export default VerificationInput;
