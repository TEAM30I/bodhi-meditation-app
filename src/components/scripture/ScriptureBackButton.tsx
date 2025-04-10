
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
}

const ScriptureBackButton: React.FC<BackButtonProps> = ({ label }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBackClick = () => {
    // Go back to previous page instead of always redirecting to /scripture
    navigate(-1);
  };
  
  return (
    <div className="flex items-center mt-4 mb-4">
      <button 
        onClick={handleBackClick} 
        className="flex items-center text-[#111]"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      {label && <h1 className="text-[#111] text-xl font-medium mx-auto">{label}</h1>}
    </div>
  );
};

export default ScriptureBackButton;
