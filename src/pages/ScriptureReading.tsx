
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { scriptures, scriptureCategories } from '@/data/scriptureRepository';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ScriptureBottomNav from '@/components/ScriptureBottomNav';
import ScriptureCalendar from '@/components/scripture/ScriptureCalendar';
import BookmarkList from '@/components/scripture/BookmarkList';
import ShareOptions from '@/components/scripture/ShareOptions';
import SettingsPanel from '@/components/scripture/SettingsPanel';

const ScriptureReading = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'calendar' | 'bookmark' | 'share' | 'settings' | null>(null);
  const [activeCategory, setActiveCategory] = useState('original');
  const [fontSize, setFontSize] = useState(16);
  
  // 경전 데이터 찾기
  const scripture = scriptures.find(s => s.id === id);
  
  if (!scripture) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>경전을 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 사이드 패널 컴포넌트 매핑
  const sidePanelComponents = {
    calendar: <ScriptureCalendar />,
    bookmark: <BookmarkList />,
    share: <ShareOptions />,
    settings: <SettingsPanel />
  };
  
  const handleTabChange = (tab: 'calendar' | 'bookmark' | 'share' | 'settings') => {
    setActiveTab(activeTab === tab ? null : tab);
  };
  
  // 경전 내용을 단락으로 분리
  const paragraphs = scripture.content.split('\n').filter(p => p.trim());
  
  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full px-6 py-4 flex items-center border-b">
        <button 
          onClick={() => navigate('/scripture')}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex-1">
          <h1 className="text-lg font-bold flex items-center">
            {scripture.title}
            <ChevronDown className="ml-1 h-5 w-5" />
          </h1>
        </div>
        
        <div className="flex space-x-2">
          {/* Header actions if needed */}
        </div>
      </div>
      
      {/* Categories */}
      <div className="px-6 py-3 flex space-x-2 overflow-x-auto">
        {scriptureCategories.map((category) => (
          <Badge
            key={category.id}
            variant={category.id === activeCategory ? "default" : "outline"}
            className={`rounded-full px-4 py-1 cursor-pointer ${
              category.id === activeCategory 
                ? "bg-black text-white" 
                : "bg-white text-black border-gray-300"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </Badge>
        ))}
      </div>
      
      {/* Scripture Content */}
      {activeTab === null ? (
        <div className="px-6 py-4" style={{ fontSize: `${fontSize}px` }}>
          <h2 className="font-bold text-lg mb-4">1. 개경 (開經)</h2>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <div className="px-6 py-4">
          {sidePanelComponents[activeTab]}
        </div>
      )}
      
      {/* Bottom Navigation */}
      <ScriptureBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default ScriptureReading;
