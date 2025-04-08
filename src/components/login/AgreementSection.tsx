
import React from 'react';

interface AgreementSectionProps {
  agreed: boolean;
  setAgreed: (agreed: boolean) => void;
}

const AgreementSection: React.FC<AgreementSectionProps> = ({ agreed, setAgreed }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="agreement"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        className="mr-2 rounded"
      />
      <label htmlFor="agreement" className="text-[#9EA3BE] font-pretendard text-[14px] font-medium">
        서비스 이용약관에 동의합니다.
      </label>
    </div>
  );
};

export default AgreementSection;
