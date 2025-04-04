import React from 'react';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  disabled?: boolean; // disabled 속성 추가
  maxLength?: number; // maxLength 속성 추가
  // 추가 HTML input 속성들
  min?: string | number;
  max?: string | number;
  pattern?: string;
  required?: boolean;
  autoComplete?: string;
  name?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  className,
  disabled = false,
  maxLength,
  // 추가 속성들
  min,
  max,
  pattern,
  required,
  autoComplete,
  name
}) => {
  // disabled 상태일 때의 스타일
  const disabledStyles = disabled 
    ? "opacity-50 cursor-not-allowed" 
    : "";

  return (
    <div className={cn("w-full", className)}>
      <div className="text-[rgba(57,57,57,0.8)] text-[15px] font-extrabold leading-[130%] tracking-[0.3px] mb-[9px]">
        {label}
      </div>
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        min={min}
        max={max}
        pattern={pattern}
        required={required}
        autoComplete={autoComplete}
        name={name}
        className={cn(
          "w-full bg-transparent text-[17px] font-medium leading-[130%] text-black placeholder:text-[rgba(0,0,0,0.2)] focus:outline-none",
          disabledStyles
        )}
      />
      
      <div className={cn(
        "w-full h-[2px] bg-[rgba(0,0,0,0.1)] mt-[6px] rounded-full",
        disabled && "bg-[rgba(0,0,0,0.05)]"
      )}></div>
    </div>
  );
};

export default InputField;