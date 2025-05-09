import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { typedData } from '@/utils/typeUtils';
import { getScriptureList } from '@/lib/repository';
import { Scripture as ScriptureType } from '@/types';
import { ScriptureCalendar } from '@/components/scripture/ScriptureCalendar';
import BookmarkList from '@/components/scripture/BookmarkList';
import ShareOptions from '@/components/scripture/ShareOptions';
import SettingsPanel from '@/components/scripture/SettingsPanel';
import { ScriptureCalendarPrev } from '@/components/scripture/ScriptureCalendar_prev';

const Scripture: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] =
    useState<'reading' | 'calendar' | 'bookmark' | 'share' | 'settings'>('reading');
  const [scriptures, setScriptures] = useState<ScriptureType[]>([]);
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('default');
  const [theme, setTheme] = useState('light');
  const [readingMode, setReadingMode] = useState('scroll');
  
  useEffect(() => {
    const fetchScriptures = async () => {
      try {
        const scriptureData = await getScriptureList();
        setScriptures(scriptureData);
      } catch (error) {
        console.error('Error fetching scriptures:', error);
      }
    };
    
    fetchScriptures();
  }, []);

  const typedScriptures = typedData<ScriptureType[]>(scriptures);
  const startedScriptures = typedScriptures.filter((s: ScriptureType) => s.hasStarted);
  const notStartedScriptures = typedScriptures.filter((s: ScriptureType) => !s.hasStarted);

  const handleNavigateToCalendar = () => navigate('/scripture/calendar');

  return (
    <PageLayout title="경전 읽기" showBackButton={true} onBackButtonClick={() => navigate(-1)}>
      <div className="w-full max-w-[480px] mx-auto min-h-screen bg-gray-50 relative">
        {/* 블러 오버레이 */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] z-10 flex items-center justify-center">
          <div className="bg-white/90 px-6 py-4 rounded-lg shadow-sm">
            <p className="text-gray-700 font-medium text-center">
              곧 새로운 내용으로
              <br />업데이트될 예정입니다.
            </p>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {activeTab === 'reading' ? (
            <>
              {/* 경전 캘린더 미리보기 */}
              <div 
                className="bg-white p-4 rounded-2xl shadow-sm cursor-pointer active:scale-[0.98] transition-transform" 
                onClick={handleNavigateToCalendar}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">경전 캘린더</h2>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
                <div className="mt-2">
                  <ScriptureCalendarPrev />
                </div>
              </div>

              {/* 이어보기 섹션 */}
              {startedScriptures.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold px-1">이어보기</h2>
                  <div className="space-y-3">
                    {startedScriptures.map((s) => (
                      <ScriptureCard 
                        key={s.id}
                        scripture={s}
                        onClick={() => navigate(`/scripture/${s.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 아직 펼치지 않은 이야기 */}
              {notStartedScriptures.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold px-1">아직 펼치지 않은 이야기</h2>
                  <div className="space-y-3">
                    {notStartedScriptures.map((s) => (
                      <ScriptureCard 
                        key={s.id}
                        scripture={s}
                        onClick={() => navigate(`/scripture/${s.id}`)}
                        progress={0}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mt-4">
              {activeTab === 'calendar' && <ScriptureCalendar />}
              {activeTab === 'bookmark' && <BookmarkList />}
              {activeTab === 'share' && <ShareOptions />}
              {activeTab === 'settings' && (
                <SettingsPanel 
                  fontSize={16}
                  onFontSizeChange={(size) => console.log(size)}
                  fontFamily={'gothic' as 'gothic' | 'serif'}
                  onFontFamilyChange={(family) => console.log(family)}
                  theme={'light' as 'light' | 'dark'}
                  onThemeChange={(theme) => console.log(theme)}
                  onClose={() => setActiveTab('reading')}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

interface ScriptureCardProps {
  scripture: ScriptureType;
  onClick: () => void;
  progress?: number;
}

const ScriptureCard: React.FC<ScriptureCardProps> = ({ scripture, onClick, progress }) => {
  // progress 기본값을 컴포넌트 내부에서 설정
  const displayProgress = progress !== undefined ? progress : scripture.progress;
  
  return (
    <div 
      className="bg-white p-5 rounded-2xl shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      <div 
        className="inline-flex px-3 py-1.5 rounded-lg mb-3"
        style={{ backgroundColor: getBadgeColor(scripture.id) }}
      >
        <span className="text-xs font-medium text-white">
          {scripture.title}
        </span>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-3">
        {scripture.title} 통독
      </h3>
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-2 overflow-hidden">
        <div
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: `${displayProgress}%`,
            background: `linear-gradient(90deg, rgba(218,0,0,0.55) 0%, ${getBadgeColor(scripture.id)} 44.19%)`,
          }}
        />
      </div>
      <div className="flex justify-end">
        <span className="text-xs text-gray-500">{displayProgress}%</span>
      </div>
    </div>
  );
};

const getBadgeColor = (id: string) => {
  switch(id) {
    case 'heart-sutra': return '#EF4223';
    case 'diamond-sutra': return '#21212F';
    case 'lotus-sutra': return '#0080FF';
    case 'sixpatriarch-sutra': return '#4CAF50';
    case 'avatamsaka-sutra': return '#FFB23F';
    default: return '#DE7834';
  }
};

export default Scripture;
