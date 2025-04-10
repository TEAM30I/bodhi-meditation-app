
import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  type: 'text' | 'email' | 'password' | 'tel';
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: 'user' | 'lock' | 'phone' | 'none';
  state?: 'default' | 'error' | 'success';
  errorMessage?: string;
  className?: string;
  highlightFocus?: boolean;
  rightElement?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  icon = 'none',
  state = 'default',
  errorMessage,
  className,
  highlightFocus = false,
  rightElement
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const renderIcon = () => {
    switch (icon) {
      case 'user':
        return <User className="h-5 w-5 text-gray-400" />;
      case 'lock':
        return <Lock className="h-5 w-5 text-gray-400" />;
      case 'phone':
        return <Phone className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const borderColor = () => {
    if (isFocused && highlightFocus) return 'border-app-orange bg-app-orange bg-opacity-10';
    switch (state) {
      case 'error':
        return 'border-red-500';
      case 'success':
        return 'border-green-500';
      default:
        return 'border-transparent';
    }
  };

  // 전화번호 형식 변환 (입력 중)
  const formatPhoneInput = (input: string) => {
    if (type !== 'tel') return input;
    
    // 숫자와 하이픈만 남기기
    const cleaned = input.replace(/[^\d-]/g, '');
    
    // 이미 하이픈이 포함된 경우 그대로 반환
    if (cleaned.includes('-')) {
      return cleaned;
    }
    
    // 숫자만 추출
    const digits = cleaned.replace(/-/g, '');
    
    // 전화번호 형식으로 변환 (010-xxxx-xxxx 또는 010-xxx-xxxx)
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length > 3 && digits.length <= 7) {
      return `${digits.substring(0, 3)}-${digits.substring(3)}`;
    } else {
      return `${digits.substring(0, 3)}-${digits.substring(3, 7)}-${digits.substring(7, 11)}`;
    }
  };

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'tel') {
      // 전화번호 형식 변환
      const formattedValue = formatPhoneInput(e.target.value);
      const event = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    } else {
      onChange(e);
    }
  };

  return (
    <div className={cn("mb-4", className)}>
      <label className="block text-app-gray-text mb-2 text-sm">{label}</label>
      <div className="relative">
        {icon !== 'none' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {renderIcon()}
          </div>
        )}

        <input
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "app-input",
            icon !== 'none' && "pl-10",
            type === 'password' && "pr-10",
            borderColor(),
            isFocused && highlightFocus ? "text-app-orange" : ""
          )}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}

        {rightElement && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {state === 'error' && errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputField;
