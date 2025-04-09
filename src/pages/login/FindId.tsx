
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/StatusBar';
import BackButton from '@/components/BackButton';
import InputField from '@/components/InputField';
import AuthButton from '@/components/AuthButton';
import { useToast } from '@/hooks/use-toast';

const FindId: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [phone, setPhone] = useState('');
  
  const handleFindId = () => {
    if (!phone) {
      toast({
        title: "오류",
        description: "전화번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically handle API recovery
    toast({
      title: "안내",
      description: "입력하신 연락처로 아이디 안내가 발송되었습니다.",
    });
    
    // Navigate to a result page or back to login
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col p-5">
      <StatusBar />
      
      <BackButton label="아이디 찾기" />
      
      <div className="mt-8 animate-slide-up">
        <InputField
          type="tel"
          label="전화번호"
          placeholder="전화번호를 입력해 주세요"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon="phone"
          className="mb-12"
        />
        
        <AuthButton 
          label="아이디 찾기" 
          onClick={handleFindId}
        />
      </div>
    </div>
  );
};

export default FindId;
