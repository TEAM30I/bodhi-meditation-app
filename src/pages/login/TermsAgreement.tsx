
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, ImageIcon, MapPinIcon, BellIcon } from 'lucide-react';
import StatusBar from '@/components/login/StatusBar';
import BackButton from '@/components/login/BackButton';
import AuthButton from '@/components/login/AuthButton';
import { useToast } from '@/hooks/use-toast';

const TermsAgreement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [allChecked, setAllChecked] = useState(false);
  const [serviceChecked, setServiceChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAllCheck = (checked: boolean) => {
    setAllChecked(checked);
    setServiceChecked(checked);
    setPrivacyChecked(checked);
    setMarketingChecked(checked);
  };
  
  const handleSingleCheck = (type: string, checked: boolean) => {
    switch (type) {
      case 'service':
        setServiceChecked(checked);
        break;
      case 'privacy':
        setPrivacyChecked(checked);
        break;
      case 'marketing':
        setMarketingChecked(checked);
        break;
      default:
        break;
    }
    
    // Update "all checked" status
    if (checked) {
      if (type === 'service' && privacyChecked && marketingChecked) setAllChecked(true);
      if (type === 'privacy' && serviceChecked && marketingChecked) setAllChecked(true);
      if (type === 'marketing' && serviceChecked && privacyChecked) setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  };
  
  const handleAgree = async () => {
    if (!serviceChecked || !privacyChecked) {
      toast({
        title: "약관 동의 필요",
        description: "서비스 이용약관과 개인정보 수집 및 이용 동의는 필수입니다.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, save user agreement preferences to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "가입 완료",
        description: "환영합니다! 로그인 후 서비스를 이용해 주세요.",
      });
      
      // Navigate to login page
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "오류",
        description: "약관 동의 중 문제가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const CheckboxItem: React.FC<{
    title: string;
    description: string;
    icon?: React.ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    hasDetails?: boolean;
  }> = ({ title, description, icon, checked, onChange, hasDetails = true }) => (
    <div className="mb-6">
      <div className="flex items-center">
        <div 
          className={`w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer ${
            checked ? 'bg-app-orange border-app-orange' : 'border-gray-400 bg-transparent'
          }`}
          onClick={() => onChange(!checked)}
        >
          {checked && <CheckIcon className="w-4 h-4 text-white" />}
        </div>
        <span className="ml-2 text-white">{title}</span>
        {hasDetails && (
          <div className="ml-auto text-gray-400">
            더보기
          </div>
        )}
      </div>
      <div className="mt-1 ml-8 text-gray-400 text-sm flex items-center">
        {icon}
        <span className="ml-2">{description}</span>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-app-dark flex flex-col p-5">
      <StatusBar />
      
      <BackButton label="서비스 가입" />
      
      <div className="mt-4">
        <h1 className="text-white text-2xl font-bold mb-4">서비스 시작 및 가입을 위해 먼저<br />가입 및 정보 제공에 동의해 주세요</h1>
        
        <div className="bg-app-input-bg p-4 rounded-xl mb-8">
          <CheckboxItem
            title="전체동의"
            description="서비스 이용약관 관련 전체동의"
            checked={allChecked}
            onChange={handleAllCheck}
            hasDetails={false}
          />
        </div>
        
        <div className="space-y-2">
          <CheckboxItem
            title="서비스 이용약관 관련 전체동의"
            description="서비스 이용약관 관련 전체동의"
            icon={<CheckIcon className="w-4 h-4" />}
            checked={serviceChecked}
            onChange={(checked) => handleSingleCheck('service', checked)}
          />
          
          <CheckboxItem
            title="(필수) 개인정보 수집 및 이용 동의"
            description="필수 개인정보 수집 및 이용 동의"
            icon={<CheckIcon className="w-4 h-4" />}
            checked={privacyChecked}
            onChange={(checked) => handleSingleCheck('privacy', checked)}
          />
          
          <CheckboxItem
            title="(필수) 개인정보 제3자 제공 동의"
            description="개인정보 제3자 제공 동의"
            icon={<CheckIcon className="w-4 h-4" />}
            checked={marketingChecked}
            onChange={(checked) => handleSingleCheck('marketing', checked)}
          />
        </div>
      </div>
      
      <div className="mt-auto mb-4">
        <AuthButton 
          label={isLoading ? "처리 중..." : "확인"}
          onClick={handleAgree}
          disabled={isLoading || !serviceChecked || !privacyChecked}
        />
      </div>
    </div>
  );
};

export default TermsAgreement;
