import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { scriptures } from '../../../public/data/scriptureData/scriptureRepository';
import ScriptureBottomNav from '@/components/ScriptureBottomNav';

const Scripture = () => {
  const navigate = useNavigate();
  
  // Type our data properly
  const typedScriptures = typedData<typeof scriptures>(scriptures);

  // Group scriptures by read status
  const startedScriptures = Object.values(typedScriptures).filter(s => s.hasStarted);
  const notStartedScriptures = Object.values(typedScriptures).filter(s => !s.hasStarted);

  return (
    <div className="bg-[#F1F3F5] min-h-screen pb-20 font-['Pretendard']">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate('/main')}
          className="mr-4"
        >
          <Home size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">경전 읽기</h1>
        <button
          onClick={() => navigate('/scripture/bookmarks')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="px-5 py-4">
        {/* Continue Reading Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">이어보기</h2>
          <div className="space-y-2">
            {startedScriptures.length > 0 ? (
              startedScriptures.map((scripture) => {
                const badgeColor = scripture.id === "heart-sutra" ? "#EF4223" :
                                scripture.id === "diamond-sutra" ? "#21212F" :
                                scripture.id === "lotus-sutra" ? "#0080FF" :
                                scripture.id === "sixpatriarch-sutra" ? "#4CAF50" :
                                scripture.id === "avatamsaka-sutra" ? "#FFB23F" : "#DE7834";
                
                return (
                  <div
                    key={scripture.id}
                    className="bg-white p-5 rounded-3xl shadow-sm cursor-pointer"
                    onClick={() => navigate(`/scripture/${scripture.id}`)}
                  >
                    <div 
                      className="inline-flex px-2 py-2 rounded-xl mb-3"
                      style={{ backgroundColor: badgeColor }}
                    >
                      <span className="text-xs font-medium text-white">
                        {scripture.title}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">
                      보리11님의 {scripture.title} 통독
                    </h3>
                    <div className="w-full h-1 bg-[#FBF3E9] rounded-full mb-1">
                      <div 
                        className="h-1 rounded-full" 
                        style={{ 
                          width: `${scripture.progress || 0}%`,
                          background: `linear-gradient(90deg, rgba(218, 0, 0, 0.55) 0%, ${badgeColor} 44.19%)`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-xs text-gray-500">{scripture.progress}%</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
                <p className="text-gray-500">아직 시작한 경전이 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* Other Scriptures Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">아직 펼치지 않은 이야기</h2>
          <div className="space-y-2">
            {notStartedScriptures.length > 0 ? (
              notStartedScriptures.map((scripture) => {
                const badgeColor = scripture.id === "heart-sutra" ? "#EF4223" :
                                scripture.id === "diamond-sutra" ? "#21212F" :
                                scripture.id === "lotus-sutra" ? "#0080FF" :
                                scripture.id === "sixpatriarch-sutra" ? "#4CAF50" :
                                scripture.id === "avatamsaka-sutra" ? "#FFB23F" : "#DE7834";
                
                return (
                  <div
                    key={scripture.id}
                    className="bg-white p-5 rounded-3xl shadow-sm cursor-pointer"
                    onClick={() => navigate(`/scripture/${scripture.id}`)}
                  >
                    <div 
                      className="inline-flex px-2 py-2 rounded-xl mb-3"
                      style={{ backgroundColor: badgeColor }}
                    >
                      <span className="text-xs font-medium text-white">
                        {scripture.title}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">
                      보리11님의 {scripture.title} 통독
                    </h3>
                    <div className="w-full h-1 bg-[#FBF3E9] rounded-full mb-1"></div>
                    <div className="flex justify-end">
                      <span className="text-xs text-gray-500">0%</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
                <p className="text-gray-500">모든 경전을 시작했습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scripture Bottom Navigation */}
      <ScriptureBottomNav 
        activeTab="reading"
        onTabChange={(tab) => {
          if (tab === 'calendar') navigate('/scripture/calendar');
          else if (tab === 'bookmark') navigate('/scripture/bookmarks');
          else if (tab === 'share') navigate('/scripture/share');
          else if (tab === 'settings') navigate('/scripture/settings');
        }}
      />
    </div>
  );
};

export default Scripture;
