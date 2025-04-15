
import React from 'react';
import { cn } from '@/lib/utils';

interface AuthButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  label,
  onClick,
  disabled = false,
  className
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "app-button",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {label}
    </button>
  );
};

export default AuthButton;
