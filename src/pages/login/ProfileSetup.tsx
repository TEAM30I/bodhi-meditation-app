
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import { Pencil } from 'lucide-react';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import InputField from '@/components/login/InputField';
import AuthButton from '@/components/login/AuthButton';
import { useToast } from '@/hooks/use-toast';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleContinue = async () => {
    if (!name || !nickname || !email) {
      toast({
        title: "프로필 설정 오류",
        description: "이름, 닉네임, 이메일을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update user attributes in Cognito
      await updateUserAttributes({
        userAttributes: {
          name: name,
          email: email,
          'custom:nickname': nickname,
          // You can add custom attributes for age group and gender
          'custom:ageGroup': ageGroup,
          'custom:gender': gender
        }
      });
      
      toast({
        title: "프로필 설정 완료",
        description: "이용약관 동의 단계로 이동합니다.",
      });
      
      // Navigate to terms agreement page
      navigate('/terms-agreement');
    } catch (error: any) {
      toast({
        title: "프로필 설정 오류",
        description: "프로필 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Age group selection dropdown
  const AgeGroupDropdown: React.FC = () => (
    <div className="mb-4">
      <label className="block text-app-gray-text mb-2 text-sm">나이대를 선택해 주세요</label>
      <div className="relative">
        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          className="app-input appearance-none w-full pr-10"
        >
          <option value="" disabled>나이대를 선택해 주세요</option>
          <option value="10_under">10대 이하</option>
          <option value="10s">10대</option>
          <option value="20s">20대</option>
          <option value="30s">30대</option>
          <option value="40s">40대</option>
          <option value="50s">50대</option>
          <option value="60s">60대</option>
          <option value="60_over">60대 이상</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
  
  // Gender selection dropdown
  const GenderDropdown: React.FC = () => (
    <div className="mb-12">
      <label className="block text-app-gray-text mb-2 text-sm">성별을 선택해 주세요</label>
      <div className="relative">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="app-input appearance-none w-full pr-10"
        >
          <option value="" disabled>성별을 선택해 주세요</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col p-5">
      <StatusBar />
      
      <BackButton label="프로필 설정" />
      
      <div className="mt-4 flex justify-center">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="w-16 h-16 text-gray-400"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 bg-app-orange p-1.5 rounded-full cursor-pointer">
            <Pencil size={16} className="text-white" />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <InputField
          type="text"
          label="이름"
          placeholder="이름을 입력해 주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <InputField
          type="text"
          label="닉네임"
          placeholder="닉네임을 입력해 주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        
        <InputField
          type="email"
          label="이메일"
          placeholder="이메일을 입력해 주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <AgeGroupDropdown />
        <GenderDropdown />
        
        <div className="flex space-x-2">
          <AuthButton 
            label="다음에"
            onClick={() => navigate('/terms-agreement')} 
            className="flex-1 bg-transparent border border-gray-500"
          />
          <AuthButton 
            label={isLoading ? "저장 중..." : "입력완료"}
            onClick={handleContinue}
            className="flex-1"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
