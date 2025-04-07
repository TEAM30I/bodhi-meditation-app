
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type RecoveryMode = 'selection' | 'findId' | 'findPassword';

const FindAccount = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<RecoveryMode>('selection');

  const handleGoBack = () => {
    if (mode === 'selection') {
      navigate('/login/login');
    } else {
      setMode('selection');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#181A20] flex flex-col">
      <div className="flex w-full h-14 items-center px-5">
        <button onClick={handleGoBack} className="flex items-center">
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-white font-pretendard text-[20px] font-medium mx-auto">
          {mode === 'selection' ? '계정 찾기' : mode === 'findId' ? '아이디 찾기' : '비밀번호 찾기'}
        </h1>
      </div>

      {mode === 'selection' && (
        <div className="flex flex-col px-5 gap-4 mt-8">
          <p className="text-[#9EA3BE] font-pretendard text-[14px] leading-5 mb-4">
            찾고자 하는 정보를 선택해주세요
          </p>
          
          <button 
            className="w-full h-[60px] rounded-[16px] bg-[#252932] flex items-center px-6 text-white font-medium"
            onClick={() => setMode('findId')}
          >
            아이디 찾기
          </button>
          
          <button 
            className="w-full h-[60px] rounded-[16px] bg-[#252932] flex items-center px-6 text-white font-medium"
            onClick={() => setMode('findPassword')}
          >
            비밀번호 찾기
          </button>
        </div>
      )}

      {mode === 'findId' && <FindIdSection />}
      {mode === 'findPassword' && <FindPasswordSection navigate={navigate} />}
    </div>
  );
};

const FindIdSection = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(1);
  const [foundEmail, setFoundEmail] = useState('');

  const handleSubmit = () => {
    // 실제 구현에서는 서버에 요청하여 이메일을 찾아야 합니다.
    // 여기서는 모의 구현으로 테스트 데이터를 반환합니다.
    setTimeout(() => {
      setFoundEmail('bo***@example.com');
      setStep(2);
    }, 1000);
  };

  return (
    <div className="flex flex-col px-5 mt-6">
      {step === 1 ? (
        <>
          <p className="text-[#9EA3BE] font-pretendard text-[14px] leading-5 mb-8">
            가입 시 등록한 이름과 전화번호를 입력해주세요
          </p>
          
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium">
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
                className="bg-[#252932] text-white h-[60px] rounded-[16px] px-5 focus:outline-none"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium">
                전화번호
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="전화번호를 입력해주세요"
                className="bg-[#252932] text-white h-[60px] rounded-[16px] px-5 focus:outline-none"
              />
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!name || !phoneNumber}
            className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-medium disabled:opacity-50"
          >
            아이디 찾기
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <img 
            src="/lovable-uploads/179dbac4-c437-4110-9097-4e8a34878e2b.png" 
            alt="Praying Hands"
            className="w-[100px] h-[100px] mb-6"
          />
          
          <h2 className="text-white text-xl font-medium mb-4">아이디 찾기 완료</h2>
          
          <p className="text-[#9EA3BE] text-center mb-6">
            회원님의 아이디는<br/>
            <span className="text-white font-bold">{foundEmail}</span><br/>
            입니다
          </p>
          
          <button
            onClick={() => window.location.href = '/login/login'}
            className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-medium"
          >
            로그인하기
          </button>
        </div>
      )}
    </div>
  );
};

interface FindPasswordSectionProps {
  navigate: (path: string) => void;
}

const FindPasswordSection: React.FC<FindPasswordSectionProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  
  const handleResetPassword = () => {
    // 실제 구현에서는 비밀번호 재설정 요청을 처리하고
    // 적절한 페이지로 이동합니다.
    navigate('/login/reset-password');
  };
  
  return (
    <div className="flex flex-col px-5 mt-6">
      <p className="text-[#9EA3BE] font-pretendard text-[14px] leading-5 mb-8">
        가입 시 등록한 이메일을 입력해주세요
      </p>
      
      <div className="flex flex-col gap-2 mb-8">
        <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium">
          이메일
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력해주세요"
          className="bg-[#252932] text-white h-[60px] rounded-[16px] px-5 focus:outline-none"
        />
      </div>
      
      <button
        onClick={handleResetPassword}
        disabled={!email}
        className="w-full h-[60px] rounded-[16px] bg-bodhi-orange text-white text-[18px] font-medium disabled:opacity-50"
      >
        다음
      </button>
    </div>
  );
};

export default FindAccount;
