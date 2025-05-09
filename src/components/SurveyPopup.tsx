import React, { useState } from 'react';

interface SurveyPopupProps {
  onClose: () => void;
}

const SurveyPopup: React.FC<SurveyPopupProps> = ({ onClose }) => {
  const [dontShowForWeek, setDontShowForWeek] = useState(false);

  const handleClose = () => {
    if (dontShowForWeek) {
      // 7일 동안 팝업 보지 않기 설정
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      document.cookie = `hideSurveyPopup=true; expires=${expiryDate.toUTCString()}; path=/`;
    }
    onClose();
  };

  const handleSurveyClick = () => {
    window.open('https://bodhis.kr', '_blank');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 px-4">
      <div className="w-full max-w-[235px] bg-white rounded-[16px] flex flex-col items-center relative">
        {/* 닫기 버튼 */}
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="absolute right-[15px] top-[15px] cursor-pointer"
          onClick={handleClose}
        >
          <path d="M13 3L3 13" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"></path>
          <path d="M13 13L3 3" stroke="#111111" strokeWidth="1.5" strokeLinecap="round"></path>
        </svg>

        {/* 타이틀 배지 */}
        <div className="mt-[55px] w-[107px] h-[30px] relative">
          <div className="w-[107px] h-[25px] rounded-[16px] bg-[#D9D9D9]"></div>
          <div className="absolute top-[4px] left-[9px] text-[#353231] font-['Pretendard'] text-[12px] font-semibold leading-[140%] tracking-[-0.3px]">
            보리 맞춤 취향 설문
          </div>
        </div>

        {/* 제목 */}
        <div className="mt-4 text-[#353231] font-['Pretendard'] text-[22px] font-extrabold leading-[140%] text-center px-[29px]">
          설문에 참여해주세요
        </div>

        {/* 설명 */}
        <div className="mt-2 text-[#111] text-center font-['Pretendard'] text-[12px] font-medium leading-[140%] tracking-[-0.048px] px-[21px]">
          관심 사찰과 좋아하는 스님을 알려주세요. 더 나은 서비스를 위해 도움이 됩니다.
        </div>

        {/* 7일 동안 보지 않기 체크박스 */}
        <div className="flex items-center mt-4 self-start ml-[21px]">
          <input 
            type="checkbox" 
            id="dontShowForWeek" 
            checked={dontShowForWeek}
            onChange={(e) => setDontShowForWeek(e.target.checked)}
            className="w-3 h-3"
          />
          <label 
            htmlFor="dontShowForWeek" 
            className="ml-1 text-[10px] text-gray-500 cursor-pointer"
          >
            7일 동안 보지 않기
          </label>
        </div>

        {/* 버튼 */}
        <div className="mt-6 mb-[29px]">
          <div 
            className="inline-flex px-[29px] py-[11px] justify-center items-center rounded-[12px] bg-[#3B3633] cursor-pointer"
            onClick={handleSurveyClick}
          >
            <div className="text-white font-['Pretendard'] text-[14px] font-bold leading-[140%]">
              설문페이지로 이동하기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPopup;