
import React from 'react';
import { Copy, Link, MessageSquare, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ShareOption = ({ icon, label, onClick }: { 
  icon: React.ReactNode; 
  label: string;
  onClick: () => void;
}) => (
  <button 
    className="flex flex-col items-center justify-center w-24 h-24 mb-4"
    onClick={onClick}
  >
    <div className="bg-gray-100 rounded-full p-4 mb-2">
      {icon}
    </div>
    <span className="text-sm">{label}</span>
  </button>
);

export const ShareOptions: React.FC = () => {
  const handleShare = (method: string) => {
    toast({
      title: "공유하기",
      description: `${method}로 공유를 시도했습니다`,
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-6">공유하기</h2>
      
      <div className="flex flex-wrap justify-center gap-4">
        <ShareOption 
          icon={<Link size={24} />} 
          label="링크 복사" 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "링크 복사됨",
              description: "링크가 클립보드에 복사되었습니다",
            });
          }}
        />
        
        <ShareOption 
          icon={<Copy size={24} />} 
          label="텍스트 복사" 
          onClick={() => handleShare("텍스트")}
        />
        
        <ShareOption 
          icon={<MessageSquare size={24} />} 
          label="카카오톡" 
          onClick={() => handleShare("카카오톡")}
        />
        
        <ShareOption 
          icon={<Mail size={24} />} 
          label="이메일" 
          onClick={() => handleShare("이메일")}
        />
      </div>
    </div>
  );
};

export default ShareOptions;
