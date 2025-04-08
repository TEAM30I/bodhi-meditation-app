
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SignupHeaderProps {
  handleGoBack: () => void;
}

const SignupHeader: React.FC<SignupHeaderProps> = ({ handleGoBack }) => {
  return (
    <div className="flex items-center h-16 px-6">
      <button onClick={handleGoBack}>
        <ArrowLeft className="mr-4" />
      </button>
      <h1 className="text-2xl font-medium">회원가입</h1>
    </div>
  );
};

export default SignupHeader;
