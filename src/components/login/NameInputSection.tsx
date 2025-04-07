
import React from 'react';

interface NameInputSectionProps {
  name: string;
  setName: (name: string) => void;
}

const NameInputSection: React.FC<NameInputSectionProps> = ({ name, setName }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#9EA3BE] font-pretendard text-[14px] font-medium leading-[140%] tracking-[-0.35px]">
        이름
      </label>
      <div className="flex items-center p-[18px_20px] rounded-[16px] bg-[#252932] w-full h-[60px]">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력해 주세요"
          className="w-full bg-transparent text-white placeholder-[#777C89] focus:outline-none"
        />
      </div>
    </div>
  );
};

export default NameInputSection;
