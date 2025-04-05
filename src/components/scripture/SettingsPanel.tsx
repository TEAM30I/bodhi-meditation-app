
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SettingsPanel: React.FC = () => {
  const [fontSize, setFontSize] = useState(16);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [darkMode, setDarkMode] = useState(false);
  const [autoScrolling, setAutoScrolling] = useState(false);

  const handleReset = () => {
    setFontSize(16);
    setLineSpacing(1.5);
    setDarkMode(false);
    setAutoScrolling(false);
    
    toast({
      title: "설정 초기화",
      description: "모든 설정이 기본값으로 복원되었습니다",
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-6">설정</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">글자 크기</label>
          <div className="flex items-center space-x-4">
            <span className="text-xs">A</span>
            <Slider
              value={[fontSize]}
              min={12}
              max={24}
              step={1}
              onValueChange={(value) => setFontSize(value[0])}
              className="flex-1"
            />
            <span className="text-base font-bold">A</span>
          </div>
          <p className="text-xs text-gray-500">현재: {fontSize}px</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">줄 간격</label>
          <div className="flex items-center space-x-4">
            <span className="text-xs">좁게</span>
            <Slider
              value={[lineSpacing * 10]}
              min={10}
              max={30}
              step={1}
              onValueChange={(value) => setLineSpacing(value[0] / 10)}
              className="flex-1"
            />
            <span className="text-xs">넓게</span>
          </div>
          <p className="text-xs text-gray-500">현재: {lineSpacing}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">다크 모드</span>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">자동 스크롤</span>
          <Switch
            checked={autoScrolling}
            onCheckedChange={setAutoScrolling}
          />
        </div>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={handleReset}
        >
          기본 설정으로 복원
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
