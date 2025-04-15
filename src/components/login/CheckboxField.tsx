
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
  className
}) => {
  return (
    <div className={cn("flex items-center", className)}>
      <button
        type="button"
        className={cn(
          "w-6 h-6 flex-shrink-0 rounded flex items-center justify-center mr-2",
          checked ? "bg-app-orange" : "bg-app-input-bg"
        )}
        onClick={() => onChange(!checked)}
      >
        {checked && <Check className="h-4 w-4 text-white" />}
      </button>
      <span className="text-white text-sm">{label}</span>
    </div>
  );
};

export default CheckboxField;
