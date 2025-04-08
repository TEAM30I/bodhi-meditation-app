
import React from 'react';
import { Button } from '@/components/ui/button';

interface SignupButtonProps {
  handleSignup: () => void;
  isDisabled: boolean;
  isLoading: boolean;
}

const SignupButton: React.FC<SignupButtonProps> = ({ handleSignup, isDisabled, isLoading }) => {
  return (
    <Button
      onClick={handleSignup}
      disabled={isDisabled}
      className="w-full h-[60px] bg-[#DE7834] text-white rounded-[16px] text-[18px] font-semibold mt-6"
    >
      {isLoading ? '처리 중...' : '가입하기'}
    </Button>
  );
};

export default SignupButton;
