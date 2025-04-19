
import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeaderSection = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center justify-between border-b border-[#E5E5EC] px-5">
      <button onClick={() => navigate(-1)} className="flex items-center">
        <ArrowLeft size={24} />
      </button>
      <div className="w-6" />
      <button onClick={() => navigate('/main')} className="flex items-center">
        <Home size={24} />
      </button>
    </div>
  );
};

export default HeaderSection;
