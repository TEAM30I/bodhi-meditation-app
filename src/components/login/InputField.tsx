
import React, { useState, useEffect } from 'react';
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

  // onBlur 핸들러는 기존 방식대로 남겨두되,
  // 추가로 useEffect를 이용해 값이 완전히 입력되었을 때도 자동으로 포맷하도록 합니다.
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (type === 'tel') {
      let formattedValue = e.target.value.trim();
      if (formattedValue && formattedValue[0] === '0' && !formattedValue.startsWith('+')) {
        formattedValue = '+82' + formattedValue.substring(1);
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: formattedValue,
          },
        };
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  // useEffect를 사용하여 전화번호가 완성되면 자동 포맷
  useEffect(() => {
    if (type === 'tel') {
      const trimmed = value.trim();
      // 여기서는 숫자만 입력되었다고 가정하고, 길이가 10 또는 11자리면 포맷을 적용합니다.
      if (
        trimmed &&
        trimmed[0] === '0' &&
        !trimmed.startsWith('+') &&
        (trimmed.length === 10 || trimmed.length === 11)
      ) {
        const formattedValue = '+82' + trimmed.substring(1);
        if (formattedValue !== value) {
          // 부모 onChange 콜백을 통해 값 업데이트
          const syntheticEvent = {
            target: { value: formattedValue },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      }
    }
  }, [value, type, onChange]);

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
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
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
