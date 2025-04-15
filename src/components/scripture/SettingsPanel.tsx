
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface SettingsPanelProps {
  onFontSizeChange?: (size: number) => void;
  onFontFamilyChange?: (family: 'gothic' | 'serif') => void;
  onThemeChange?: (theme: 'light' | 'dark') => void;
  initialFontSize?: number;
  initialFontFamily?: 'gothic' | 'serif';
  initialTheme?: 'light' | 'dark';
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  onFontSizeChange, 
  onFontFamilyChange,
  onThemeChange,
  initialFontSize = 90,
  initialFontFamily = 'gothic',
  initialTheme = 'light'
}) => {
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [fontFamily, setFontFamily] = useState<'gothic' | 'serif'>(initialFontFamily);
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

  useEffect(() => {
    // Immediately apply initial settings
    if (onFontSizeChange) onFontSizeChange((initialFontSize / 100) * 16);
    if (onFontFamilyChange) onFontFamilyChange(initialFontFamily);
    if (onThemeChange) onThemeChange(initialTheme);
  }, []);

  const decreaseFontSize = () => {
    if (fontSize > 50) {
      const newSize = fontSize - 10;
      setFontSize(newSize);
      if (onFontSizeChange) {
        onFontSizeChange((newSize / 100) * 16);
      }
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 150) {
      const newSize = fontSize + 10;
      setFontSize(newSize);
      if (onFontSizeChange) {
        onFontSizeChange((newSize / 100) * 16);
      }
    }
  };

  const handleFontFamilyChange = (family: 'gothic' | 'serif') => {
    setFontFamily(family);
    if (onFontFamilyChange) {
      onFontFamilyChange(family);
    }
  };

  const handleThemeChange = (themeMode: 'light' | 'dark') => {
    setTheme(themeMode);
    if (onThemeChange) {
      onThemeChange(themeMode);
    }
  };

  const handleSave = () => {
    toast({
      title: "설정 저장",
      description: "설정이 저장되었습니다",
    });
  };

  return (
    <div className="w-full font-['Pretendard']">
      <div className="flex justify-center">
        <div className="w-12 h-1 bg-[#E5E6EB] rounded-full mb-3"></div>
      </div>
      <div className="bg-white rounded-3xl">
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
                onClick={() => handleFontFamilyChange('gothic')}
                className={`w-20 py-2 text-center rounded-xl ${
                  fontFamily === 'gothic' 
                    ? 'bg-white font-bold text-black shadow-sm' 
                    : 'text-[#767676]'
                }`}
              >
                고딕체
              </button>
              <button 
                onClick={() => handleFontFamilyChange('serif')}
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
                onClick={() => handleThemeChange('light')}
                className={`w-20 py-2 text-center rounded-xl ${
                  theme === 'light' 
                    ? 'bg-white font-bold text-black shadow-sm' 
                    : 'text-[#767676]'
                }`}
              >
                라이트
              </button>
              <button 
                onClick={() => handleThemeChange('dark')}
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
