
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
  className
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
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
    switch (state) {
      case 'error':
        return 'border-red-500';
      case 'success':
        return 'border-green-500';
      default:
        return 'border-transparent';
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
          onChange={onChange}
          className={cn(
            "app-input",
            icon !== 'none' && "pl-10",
            type === 'password' && "pr-10",
            borderColor()
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
      </div>
      
      {state === 'error' && errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputField;
