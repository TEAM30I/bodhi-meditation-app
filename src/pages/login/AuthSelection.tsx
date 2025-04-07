
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthSelection = () => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleSignup = () => {
    navigate('/signup');
  };
  
  const handleGoBack = () => {
    navigate('/login/onboarding2');
  };
  
  return (
    <div className="w-full min-h-screen bg-[#181A20] flex flex-col">
      <div className="flex w-full p-[10px_20px] items-center justify-between h-[42px]">
        {/* Status bar would be here in a real mobile app */}
      </div>
      
      <div className="flex w-full h-14 items-center px-5">
        <button onClick={handleGoBack} className="w-10 h-10 flex items-center justify-center">
          <ArrowLeft className="text-white" size={24} />
        </button>
      </div>
      
      <div className="flex flex-col items-center px-5 mt-[100px]">
        <img 
          src="/assets/thank-you-3d.png" 
          alt="Thank You 3D Model" 
          className="w-[150px] h-[150px] mb-[40px]"
        />
        
        <div className="flex flex-col w-full gap-3 mt-10">
          <button className="flex p-[18px] justify-center items-center w-full rounded-[16px] border border-[#35383F] bg-[#1F222A] relative">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 12C0 5.3726 5.3726 0 12 0C18.6274 0 24 5.3726 24 12C24 18.6274 18.6274 24 12 24C5.3726 24 0 18.6274 0 12Z" fill="#FFE812"/>
                <path d="M12 5.5C7.5817 5.5 4 8.3241 4 11.8077C4 14.0599 5.4974 16.0361 7.74985 17.1521C7.6273 17.5747 6.9624 19.8709 6.9359 20.0513C6.9359 20.0513 6.92 20.1868 7.00775 20.2385C7.09555 20.2901 7.19875 20.25 7.19875 20.25C7.45045 20.2149 10.1175 18.3415 10.5791 18.0162C11.0403 18.0815 11.5151 18.1154 12 18.1154C16.4183 18.1154 20 15.2914 20 11.8077C20 8.3241 16.4183 5.5 12 5.5Z" fill="#381F1F"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M7.57692 14.0096C7.32237 14.0096 7.11537 13.8119 7.11537 13.5688V10.8269H6.39522C6.14547 10.8269 5.94232 10.6241 5.94232 10.375C5.94232 10.1258 6.14552 9.9231 6.39522 9.9231H8.75862C9.00837 9.9231 9.21152 10.1258 9.21152 10.375C9.21152 10.6241 9.00832 10.8269 8.75862 10.8269H8.03847V13.5688C8.03847 13.8119 7.83147 14.0096 7.57692 14.0096ZM11.624 14.0036C11.4315 14.0036 11.2843 13.9255 11.2399 13.7998L11.0114 13.2015L9.60397 13.2014L9.37532 13.8001C9.33107 13.9255 9.18392 14.0036 8.99147 14.0036C8.89022 14.0037 8.79012 13.982 8.69807 13.9399C8.57082 13.8812 8.44852 13.7198 8.58867 13.2845L9.69267 10.3787C9.77047 10.1577 10.0067 9.93 10.3073 9.92315C10.6088 9.92995 10.845 10.1577 10.9229 10.3791L12.0265 13.2837C12.1669 13.72 12.0446 13.8815 11.9174 13.94C11.8253 13.982 11.7252 14.0037 11.624 14.0036ZM10.3077 11.0743L10.7687 12.3839H9.84667L10.3077 11.0743ZM12.7692 13.9423C12.5253 13.9423 12.3269 13.7525 12.3269 13.5192V10.3846C12.3269 10.1301 12.5383 9.9231 12.7981 9.9231C13.0578 9.9231 13.2692 10.1301 13.2692 10.3846V13.0961H14.25C14.4939 13.0961 14.6923 13.286 14.6923 13.5192C14.6923 13.7525 14.4939 13.9423 14.25 13.9423H12.7692ZM14.8718 13.5421C14.8718 13.7966 15.0788 14.0036 15.3334 14.0036C15.4558 14.0034 15.5731 13.9547 15.6597 13.8682C15.7462 13.7816 15.7949 13.6643 15.7951 13.5418V12.5348L15.9552 12.3747L17.0376 13.8088C17.0805 13.8661 17.1361 13.9125 17.2002 13.9444C17.2642 13.9762 17.3348 13.9926 17.4063 13.9923C17.5066 13.9925 17.6041 13.9598 17.6839 13.8991C17.7324 13.8628 17.7732 13.8172 17.804 13.7649C17.8347 13.7127 17.8548 13.6548 17.863 13.5948C17.8716 13.5347 17.8682 13.4736 17.853 13.4149C17.8378 13.3562 17.8111 13.3011 17.7744 13.2528L16.6383 11.7478L17.6901 10.6961C17.7624 10.6238 17.7986 10.524 17.7919 10.4151C17.7853 10.3072 17.7371 10.2033 17.6562 10.1225C17.5695 10.0359 17.4538 9.98625 17.3386 9.98625C17.2398 9.98625 17.1488 10.0227 17.0826 10.0889L15.7949 11.3766V10.3846C15.7949 10.1301 15.5879 9.9231 15.3334 9.9231C15.0788 9.9231 14.8718 10.1301 14.8718 10.3846V13.5421Z" fill="#FFE812"/>
              </svg>
              <span className="text-white font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
                카카오 로그인
              </span>
            </div>
          </button>
          
          <button className="flex p-[18px] justify-center items-center w-full rounded-[16px] border border-[#35383F] bg-[#1F222A] relative">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_naver_login)">
                  <rect width="24" height="24" fill="#00C73C"/>
                  <path d="M13.5 6.75V12L10.5 6.75H7.5V17.25H10.5V12L13.5 17.25H16.5V6.75H13.5Z" fill="white"/>
                </g>
                <defs>
                  <clipPath id="clip0_naver_login">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-white font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
                네이버 로그인
              </span>
            </div>
          </button>
        </div>
        
        <div className="flex flex-col items-center gap-16 mt-[72px] w-full">
          <button 
            onClick={handleLogin}
            className="w-full h-[60px] flex justify-center items-center rounded-[16px] bg-bodhi-orange text-white text-[18px] font-pretendard font-medium leading-[140%] tracking-[-0.45px]"
          >
            로그인
          </button>
          
          <div className="flex items-center gap-[6px]">
            <span className="text-[#9EA3B2] font-pretendard text-[14px] leading-[140%] tracking-[-0.35px]">
              아직 회원이 아니신가요?
            </span>
            <span 
              onClick={handleSignup}
              className="text-bodhi-orange font-pretendard text-[14px] font-semibold leading-[140%] tracking-[-0.35px] underline cursor-pointer"
            >
              회원가입
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSelection;
