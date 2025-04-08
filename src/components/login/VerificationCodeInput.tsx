
import React from 'react';
import { Input } from '@/components/ui/input';

interface VerificationCodeInputProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  onVerify: () => void;
  onResend?: () => void;
  isLoading: boolean;
  timerExpired: boolean;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  label,
  value,
  setValue,
  onVerify,
  onResend,
  isLoading,
  timerExpired,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
        {label}
      </label>
      
      <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="인증 코드 6자리"
          maxLength={6}
          className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
        />
      </div>
      
      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={onVerify}
          disabled={isLoading || !value || value.length < 6}
          className="w-full h-[50px] rounded-[18px] bg-blue-500 text-white font-semibold text-base flex items-center justify-center disabled:opacity-50"
        >
          인증하기
        </button>
        
        {timerExpired && onResend && (
          <button
            onClick={onResend}
            disabled={isLoading}
            className="text-bodhi-orange underline text-sm mt-2 text-center"
          >
            인증 코드 재발송
          </button>
        )}
      </div>
    </div>
  );
};

export default VerificationCodeInput;
