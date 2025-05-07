import React from 'react';

interface CommonButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  label,
  onClick,
  className = '',
  disabled = false
}) => {
  return (
    <div className="w-full flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full max-w-[320px]
          bg-app-orange text-white
          py-3 px-6 rounded-lg
          font-medium text-base
          transition-all duration-200
          hover:bg-opacity-90
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {label}
      </button>
    </div>
  );
};

export default CommonButton; 