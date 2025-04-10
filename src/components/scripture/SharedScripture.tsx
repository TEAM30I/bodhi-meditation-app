
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { ShareOptions } from '@/components/scripture/ShareOptions';

interface SharedScriptureProps {
  scriptureId: string;
  chapterId: string;
  title: string;
  theme?: 'light' | 'dark';
  onClose: () => void;
}

const SharedScripture: React.FC<SharedScriptureProps> = ({
  scriptureId,
  chapterId,
  title,
  theme = 'light',
  onClose
}) => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    onClose();
  };

  const handleHomeClick = () => {
    navigate('/main');
  };
  
  const shareUrl = `${window.location.origin}/scripture/${scriptureId}?chapter=${chapterId}`;
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <button onClick={handleBackClick}>
          <ArrowLeft size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
        </button>
        <h1 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          공유하기
        </h1>
        <button onClick={handleHomeClick}>
          <Home size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
        </button>
      </div>
      
      <div className="p-5">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">{title}</h2>
          <p className="text-sm text-gray-500">{shareUrl}</p>
        </div>
        
        <ShareOptions />
      </div>
    </div>
  );
};

export default SharedScripture;
