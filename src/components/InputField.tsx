
import React from 'react';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  className
}) => {
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
        className="w-full bg-transparent text-[17px] font-medium leading-[130%] text-black placeholder:text-[rgba(0,0,0,0.2)] focus:outline-none"
      />
      
      <div className="w-full h-[2px] bg-[rgba(0,0,0,0.1)] mt-[6px] rounded-full"></div>
    </div>
  );
};

export default InputField;
