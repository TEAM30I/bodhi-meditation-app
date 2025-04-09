
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

const SettingsPanel: React.FC = () => {
  const [fontSize, setFontSize] = useState(16);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [darkMode, setDarkMode] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);

  const handleSave = () => {
    toast({
      title: "설정 저장",
      description: "설정이 저장되었습니다",
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-medium mb-4">경전 설정</h2>
      
      <div className="space-y-5">
        <div className="space-y-3">
          <label className="text-sm font-medium">글자 크기</label>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">작게</span>
            <input
              type="range"
              value={fontSize}
              min={12}
              max={24}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-200 cursor-pointer"
            />
            <span className="text-sm text-gray-500">크게</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">줄 간격</label>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">좁게</span>
            <input
              type="range"
              value={lineSpacing * 10}
              min={10}
              max={30}
              onChange={(e) => setLineSpacing(parseInt(e.target.value) / 10)}
              className="flex-1 h-2 rounded-lg appearance-none bg-gray-200 cursor-pointer"
            />
            <span className="text-sm text-gray-500">넓게</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>기본</span>
            <span>최대</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <span className="text-sm">다크 모드</span>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100 mb-4">
          <span className="text-sm">자동 스크롤</span>
          <Switch
            checked={autoScroll}
            onCheckedChange={setAutoScroll}
          />
        </div>
        
        <Button
          className="w-full py-6 h-auto bg-[#FF4D00] hover:bg-[#E04400] text-white rounded-lg"
          onClick={handleSave}
        >
          적용하기
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
