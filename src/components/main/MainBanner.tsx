
import React from 'react';

const MainBanner: React.FC = () => {
  return (
    <div className="bg-[#DE7834] text-white p-6 rounded-xl flex flex-col gap-2">
      <h1 className="text-2xl font-bold">당신의 평화로운 여정</h1>
      <p className="text-sm opacity-90">
        마음의 안식을 찾는 특별한 순간, 보디스와 함께하세요.
      </p>
    </div>
  );
};

export default MainBanner;
