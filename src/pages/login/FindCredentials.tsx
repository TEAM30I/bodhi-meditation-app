
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '@/components/StatusBar';
import BackButton from '@/components/BackButton';
import InputField from '@/components/InputField';
import AuthButton from '@/components/AuthButton';
import { useToast } from '@/hooks/use-toast';

const FindCredentials: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const handleFindCredentials = () => {
    if (!email && !phone) {
      toast({
        title: "오류",
        description: "이메일 또는 전화번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically handle API recovery
    toast({
      title: "안내",
      description: "입력하신 연락처로 아이디/비밀번호 안내가 발송되었습니다.",
    });
  };
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col p-5">
      <StatusBar />
      
      <BackButton label="아이디/비밀번호 찾기" />
      
      <div className="mt-8 animate-slide-up">
        <InputField
          type="email"
          label="아이디"
          placeholder="아이디를 입력해 주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon="user"
        />
        
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
          label="아이디/비밀번호 찾기" 
          onClick={handleFindCredentials}
        />
      </div>
    </div>
  );
};

export default FindCredentials;
