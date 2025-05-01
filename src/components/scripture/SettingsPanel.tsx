import React from 'react';
import { X } from 'lucide-react';

interface SettingsPanelProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontFamily: 'gothic' | 'serif';
  onFontFamilyChange: (family: 'gothic' | 'serif') => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  fontSize,
  onFontSizeChange,
  fontFamily,
  onFontFamilyChange,
  theme,
  onThemeChange,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div 
        className="w-full bg-white rounded-t-lg p-5 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">설정</h2>
          <button onClick={onClose} className="p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* 글꼴 크기 설정 */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">글꼴 크기</h3>
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onFontSizeChange(Math.max(12, fontSize - 2))}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300"
            >
              A<sub>-</sub>
            </button>
            <span className="text-gray-700">{fontSize}px</span>
            <button 
              onClick={() => onFontSizeChange(Math.min(24, fontSize + 2))}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300"
            >
              A<sup>+</sup>
            </button>
          </div>
          <input 
            type="range" 
            min="12" 
            max="24" 
            step="1" 
            value={fontSize}
            onChange={e => onFontSizeChange(parseInt(e.target.value))}
            className="w-full mt-3"
          />
        </div>
        
        {/* 글꼴 설정 */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">글꼴</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onFontFamilyChange('gothic')}
              className={`py-2 px-4 rounded-md border ${
                fontFamily === 'gothic' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300'
              }`}
            >
              <span className="font-sans">고딕체</span>
            </button>
            <button 
              onClick={() => onFontFamilyChange('serif')}
              className={`py-2 px-4 rounded-md border ${
                fontFamily === 'serif' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300'
              }`}
            >
              <span className="font-serif">명조체</span>
            </button>
          </div>
        </div>
        
        {/* 테마 설정 */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">테마</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onThemeChange('light')}
              className={`py-2 px-4 rounded-md border ${
                theme === 'light' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 bg-white border border-gray-300 rounded-full mr-2"></div>
                <span>라이트</span>
              </div>
            </button>
            <button 
              onClick={() => onThemeChange('dark')}
              className={`py-2 px-4 rounded-md border ${
                theme === 'dark' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 bg-gray-900 border border-gray-700 rounded-full mr-2"></div>
                <span>다크</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
