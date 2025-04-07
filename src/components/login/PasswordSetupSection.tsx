
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordSetupSectionProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  passwordValid: boolean;
  passwordMatch: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

const PasswordSetupSection: React.FC<PasswordSetupSectionProps> = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordValid,
  passwordMatch,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}) => {
  return (
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
  );
};

export default PasswordSetupSection;
