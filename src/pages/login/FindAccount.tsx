
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

export default function FindAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [tab, setTab] = useState<'id' | 'password'>('id');
  const [phoneForPassword, setPhoneForPassword] = useState('');
  const [emailForPassword, setEmailForPassword] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'phone' | 'email'>('phone');

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleFindId = () => {
    if ((!email && !phone) || (email === '' && phone === '')) {
      toast({
        variant: 'destructive',
        title: '입력 오류',
        description: '이메일 또는 전화번호를 입력해주세요.',
      });
      return;
    }

    // Simulate ID recovery
    setTimeout(() => {
      setVerifiedEmail('example@email.com');
      toast({
        title: '계정 찾기 성공',
        description: '회원님의 계정이 확인되었습니다.',
      });
    }, 1000);
  };

  const handleResetPassword = () => {
    if ((!phoneForPassword && !emailForPassword) || (phoneForPassword === '' && emailForPassword === '')) {
      toast({
        variant: 'destructive',
        title: '입력 오류',
        description: '전화번호 또는 이메일을 입력해주세요.',
      });
      return;
    }

    // Simulate sending code
    setShowVerificationModal(true);
    toast({
      title: '인증 코드 발송',
      description: selectedMethod === 'phone' 
        ? `${phoneForPassword}로 인증 코드가 발송되었습니다.`
        : `${emailForPassword}로 인증 코드가 발송되었습니다.`,
    });
  };

  const handleVerifyCode = () => {
    if (verificationCode.length !== 6) {
      toast({
        variant: 'destructive',
        title: '인증 코드 오류',
        description: '6자리 인증 코드를 정확히 입력해주세요.',
      });
      return;
    }

    setShowVerificationModal(false);
    // Navigate to password reset page
    navigate('/login/reset-password');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#181A20] text-white">
      {/* Header */}
      <div className="flex items-center h-16 px-6">
        <button onClick={handleGoBack}>
          <ArrowLeft className="mr-4" />
        </button>
        <h1 className="text-2xl font-medium">계정 찾기</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 py-8">
        <Tabs defaultValue="id" className="w-full" value={tab} onValueChange={(value) => setTab(value as 'id' | 'password')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="id" className="text-lg">아이디 찾기</TabsTrigger>
            <TabsTrigger value="password" className="text-lg">비밀번호 찾기</TabsTrigger>
          </TabsList>
          
          <TabsContent value="id" className="space-y-6">
            <div className="text-[#9EA3BE] mb-8">
              회원가입 시 사용한 이메일이나 전화번호를 통해 아이디를 찾을 수 있습니다.
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
                  이메일
                </label>
                <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력해주세요"
                    className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex items-center text-[#9EA3BE] text-lg my-2 justify-center">
                <div className="h-px bg-[#252932] w-full"></div>
                <span className="px-4">또는</span>
                <div className="h-px bg-[#252932] w-full"></div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
                  전화번호
                </label>
                <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="전화번호를 입력해주세요"
                    className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            {verifiedEmail && (
              <div className="bg-[#252932] p-4 rounded-lg mt-6">
                <p className="text-[#9EA3BE]">회원님의 아이디는</p>
                <p className="text-white font-bold text-lg">{verifiedEmail}</p>
                <p className="text-[#9EA3BE]">입니다.</p>
              </div>
            )}
            
            <Button
              onClick={handleFindId}
              className="w-full h-[60px] bg-[#DE7834] text-white rounded-[16px] text-[18px] font-semibold mt-6"
            >
              아이디 찾기
            </Button>
          </TabsContent>
          
          <TabsContent value="password" className="space-y-6">
            <div className="text-[#9EA3BE] mb-4">
              암호를 재설정하는 데 필요한 코드번호를 받으실 방법을 선택해 주세요
            </div>
            
            <div className="flex flex-col gap-4">
              <div 
                className={`flex items-center p-6 rounded-[20px] border ${selectedMethod === 'phone' ? 'border-[#DE7834] bg-[rgba(222,120,52,0.1)]' : 'bg-[#252932] border-[#252932]'} cursor-pointer`}
                onClick={() => setSelectedMethod('phone')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full ${selectedMethod === 'phone' ? 'bg-[rgba(222,120,52,0.1)]' : 'bg-[#181A20]'} flex items-center justify-center`}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path d="M21.7883 16.9267C21.0383 16.135 20.09 15.7267 19.0833 15.7267C18.0883 15.7267 17.1283 16.1233 16.3433 16.9083L15.05 18.2017C14.9333 18.1433 14.8167 18.0917 14.7 18.0283C14.525 17.9417 14.35 17.8433 14.21 17.7333C12.8233 16.8267 11.5767 15.6283 10.395 14.0533C9.83 13.3267 9.45167 12.7017 9.1875 12.065C9.57833 11.7092 9.94167 11.3342 10.3033 10.9725C10.4317 10.8442 10.56 10.7042 10.6883 10.5758C11.7417 9.52243 11.7417 8.12543 10.6883 7.07193L9.56167 5.94518C9.41833 5.80185 9.275 5.65852 9.14333 5.51518C8.87833 5.24852 8.6 4.97018 8.33167 4.70352C7.58167 3.95352 6.63333 3.56268 5.65 3.56268C4.66667 3.56268 3.70667 3.95352 2.93333 4.70352C2.92167 4.71518 2.92167 4.71518 2.91 4.72685L1.51167 6.13685C0.536667 7.11185 0 8.29018 0 9.67552C0 11.3617 0.653333 12.95 1.47833 14.3458C2.73333 16.4267 4.46667 18.34 6.84667 20.3975C9.69333 22.87 13.0317 24.7617 16.6717 25.9367C18.3 26.5317 20.3583 27.0217 22.6333 27.1267C22.7733 27.1383 22.9133 27.15 23.0417 27.15C24.7633 27.15 26.2083 26.53 27.3233 25.3092C27.335 25.2858 27.3583 25.2742 27.37 25.2508C27.58 24.99 27.8367 24.7292 28.0933 24.4492C28.28 24.25 28.4667 24.05 28.6417 23.84C29.4033 23.0483 29.8 22.0767 29.8 21.0817C29.8 20.0867 29.4033 19.115 28.6183 18.3533L21.7883 16.9267ZM27.3233 22.5517C27.3233 22.5517 27.335 22.5633 27.3233 22.5517C27.1717 22.7267 27.02 22.8667 26.845 23.0417C26.5767 23.3217 26.3083 23.6133 26.0633 23.9283C25.3133 24.7083 24.4533 25.0817 23.0417 25.0817C22.9483 25.0817 22.855 25.0817 22.7617 25.0817C20.7733 24.9883 19.005 24.5683 17.5583 24.05C14.175 22.9567 11.06 21.2117 8.41 18.9017C6.18667 16.9733 4.55667 15.1967 3.41 13.3033C2.69667 12.1533 2.27 11.1817 2.06833 10.2683C2.18833 9.76552 2.44167 9.33518 2.84417 8.93268L4.2425 7.53518C4.62167 7.16768 5.0125 7.96852 5.35667 7.96852C5.7125 7.96852 6.04433 8.18152 6.2225 8.35968C6.235 8.37135 6.2475 8.38318 6.26 8.39485C6.51667 8.64018 6.75 8.88535 6.995 9.14068C7.12667 9.28402 7.25833 9.42735 7.39167 9.57068L8.51833 10.6973C9.05833 11.2375 9.05833 11.7275 8.51833 12.2675C8.39 12.3958 8.27333 12.5242 8.145 12.6525C7.74333 13.0658 7.36417 13.4443 6.9375 13.8233C6.92583 13.835 6.91417 13.8458 6.91417 13.8575C6.47167 14.3 6.55417 14.7258 6.65 15.0225C6.65 15.0342 6.66167 15.0458 6.6625 15.0575C6.9725 15.8958 7.42667 16.6867 8.145 17.6117L8.15667 17.6233C9.47667 19.39 10.8783 20.7408 12.4617 21.77C12.7183 21.93 12.9867 22.0608 13.2433 22.1917C13.4767 22.3108 13.6983 22.4183 13.8833 22.5283C13.9067 22.54 13.93 22.5517 13.9533 22.5633C14.1633 22.6917 14.3617 22.75 14.56 22.75C14.9508 22.75 15.1842 22.5167 15.26 22.4408L16.665 21.0358C16.8983 20.8025 17.2533 20.565 17.6092 20.565C17.965 20.565 18.2967 20.7892 18.4642 20.9808C18.4758 20.9908 18.4758 20.9908 18.4875 21.0025L25.3292 22.4408C25.855 22.9692 25.855 23.4942 25.3175 23.9167Z" fill={selectedMethod === 'phone' ? '#DE7834' : '#777C89'} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#9EA3BE] text-[14px]">휴대폰 번호</p>
                    <input
                      type="tel"
                      value={phoneForPassword}
                      onChange={(e) => setPhoneForPassword(e.target.value)}
                      placeholder="전화번호를 입력해 주세요"
                      className={`bg-transparent border-none p-0 ${selectedMethod === 'phone' ? 'text-white' : 'text-[#9EA3BE]'} text-[16px] font-medium focus:outline-none`}
                    />
                  </div>
                </div>
              </div>
              
              <div 
                className={`flex items-center p-6 rounded-[20px] border ${selectedMethod === 'email' ? 'border-[#DE7834] bg-[rgba(222,120,52,0.1)]' : 'bg-[#252932] border-[#252932]'} cursor-pointer`}
                onClick={() => setSelectedMethod('email')}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full ${selectedMethod === 'email' ? 'bg-[rgba(222,120,52,0.1)]' : 'bg-[#181A20]'} flex items-center justify-center`}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path d="M6.20917 22.2397C5.59734 22.2397 5.07618 22.0245 4.64571 21.594C4.21524 21.1635 4 20.6424 4 20.0306V8.23267C4 7.61437 4.21524 7.08769 4.64571 6.65262C5.07618 6.21754 5.59734 6 6.20917 6H21.7673C22.3856 6 22.9123 6.21754 23.3474 6.65262C23.7825 7.08769 24 7.61437 24 8.23267V20.0306C24 20.6424 23.7825 21.1635 23.3474 21.594C22.9123 22.0245 22.3856 22.2397 21.7673 22.2397H6.20917ZM13.9882 15.0717C14.0979 15.0717 14.1998 15.056 14.2938 15.0247C14.3878 14.9933 14.4907 14.9459 14.6026 14.8825L21.4383 10.3008C21.5166 10.2617 21.5911 10.1853 21.6616 10.0717C21.7321 9.95809 21.7673 9.82871 21.7673 9.68355C21.7673 9.41143 21.6381 9.18776 21.3796 9.01255C21.121 8.83732 20.8586 8.84371 20.5922 9.03173L13.9882 13.3561L7.40776 9.03173C7.1414 8.85938 6.87505 8.84371 6.6087 8.98472C6.34234 9.12573 6.20917 9.35167 6.20917 9.66254C6.20917 9.80142 6.24834 9.92685 6.32667 10.0388C6.40501 10.1508 6.48483 10.2387 6.56613 10.3024L13.3744 14.8825C13.486 14.946 13.5887 14.9933 13.6827 15.0247C13.7767 15.056 13.8786 15.0717 13.9882 15.0717Z" fill={selectedMethod === 'email' ? '#DE7834' : '#777C89'} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#9EA3BE] text-[14px]">이메일</p>
                    <input
                      type="email"
                      value={emailForPassword}
                      onChange={(e) => setEmailForPassword(e.target.value)}
                      placeholder="이메일을 입력해 주세요"
                      className={`bg-transparent border-none p-0 ${selectedMethod === 'email' ? 'text-white' : 'text-[#9EA3BE]'} text-[16px] font-medium focus:outline-none`}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleResetPassword}
              className="w-full h-[60px] bg-[#DE7834] text-white rounded-[16px] text-[18px] font-semibold mt-6"
            >
              코드 보내기
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Verification Code Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#252932] p-6 rounded-[16px] w-[90%] max-w-[400px]">
            <h2 className="text-xl font-bold mb-4">인증 코드 입력</h2>
            <p className="text-[#9EA3BE] mb-4">
              {selectedMethod === 'phone' ? phoneForPassword : emailForPassword}로 발송된 6자리 인증코드를 입력하세요.
            </p>
            <div className="flex gap-3 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex-1 h-16 bg-[#181A20] rounded-lg flex items-center justify-center">
                  {verificationCode.length > i ? (
                    <span className="text-xl font-bold">{verificationCode[i]}</span>
                  ) : (
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-[#9EA3BE] mb-6">
              <span>인증번호 입력까지 </span>
              <span className="text-[#DE7834]">59초</span>
              <span> 남았습니다.</span>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowVerificationModal(false)}
                variant="outline"
                className="flex-1"
              >
                취소
              </Button>
              <Button 
                onClick={handleVerifyCode}
                className="flex-1 bg-[#DE7834]"
                disabled={verificationCode.length !== 6}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
