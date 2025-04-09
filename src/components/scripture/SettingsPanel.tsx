
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SettingsPanel: React.FC = () => {
  const [fontSize, setFontSize] = useState(90);
  const [fontFamily, setFontFamily] = useState<'gothic' | 'serif'>('gothic');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const decreaseFontSize = () => {
    if (fontSize > 50) {
      setFontSize(fontSize - 10);
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 150) {
      setFontSize(fontSize + 10);
    }
  };

  const handleSave = () => {
    toast({
      title: "설정 저장",
      description: "설정이 저장되었습니다",
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="w-12 h-1 bg-[#E5E6EB] rounded-full mb-3"></div>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-lg">
        <h2 className="text-xl font-bold text-[#111]">환경 설정</h2>
        <p className="text-xs text-[#767676] mt-1">나에게 맞는 설정으로 경전 읽기를 시작해보세요</p>
        
        <div className="mt-6 space-y-8">
          {/* 글자 크기 설정 */}
          <div className="flex justify-between items-center">
            <span className="text-base text-[#111]">글자 크기</span>
            <div className="flex items-center gap-7">
              <button 
                onClick={decreaseFontSize}
                className="text-base text-[#111] font-medium"
              >
                -
              </button>
              <span className="text-sm text-[#111]">{fontSize}%</span>
              <button 
                onClick={increaseFontSize}
                className="text-base text-[#111] font-medium"
              >
                +
              </button>
            </div>
          </div>
          
          {/* 글꼴 설정 */}
          <div className="flex justify-between items-center">
            <span className="text-base text-[#111]">글꼴</span>
            <div className="inline-flex p-[2px] bg-[#F1F1F5] rounded-2xl">
              <button 
                onClick={() => setFontFamily('gothic')}
                className={`w-20 py-2 text-center rounded-xl ${
                  fontFamily === 'gothic' 
                    ? 'bg-white font-bold text-black shadow-sm' 
                    : 'text-[#767676]'
                }`}
              >
                고딕체
              </button>
              <button 
                onClick={() => setFontFamily('serif')}
                className={`w-20 py-2.5 text-center ${
                  fontFamily === 'serif' 
                    ? 'bg-white font-bold text-black shadow-sm rounded-xl' 
                    : 'text-[#767676]'
                }`}
              >
                명조체
              </button>
            </div>
          </div>
          
          {/* 테마 설정 */}
          <div className="flex justify-between items-center">
            <span className="text-base text-[#111]">테마</span>
            <div className="inline-flex p-[2px] bg-[#F1F1F5] rounded-2xl">
              <button 
                onClick={() => setTheme('light')}
                className={`w-20 py-2 text-center rounded-xl ${
                  theme === 'light' 
                    ? 'bg-white font-bold text-black shadow-sm' 
                    : 'text-[#767676]'
                }`}
              >
                라이트
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`w-20 py-2.5 text-center ${
                  theme === 'dark' 
                    ? 'bg-white font-bold text-black shadow-sm rounded-xl' 
                    : 'text-[#767676]'
                }`}
              >
                다크
              </button>
            </div>
          </div>
          
          {/* 적용하기 버튼 */}
          <Button
            onClick={handleSave}
            className="w-full h-14 bg-[#DE7834] hover:bg-[#C56628] text-white font-bold text-lg rounded-xl mt-8"
          >
            적용하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
