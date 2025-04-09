
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { bookmarks, scriptures } from '../../../public/data/scriptureData/scriptureRepository';

const ScriptureBookmarkPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeScripture, setActiveScripture] = useState<string | null>(null);

  // Type our data properly
  const typedBookmarks = typedData<typeof bookmarks>(bookmarks);
  const typedScriptures = typedData<typeof scriptures>(scriptures);

  // Get unique scripture IDs from bookmarks
  const scriptureIds = [...new Set(typedBookmarks.map(bookmark => bookmark.scriptureId))];
  
  // Get all scripture titles from repository
  const allScriptureOptions = Object.values(typedScriptures).map(scripture => ({
    id: scripture.id,
    title: scripture.title,
    colorScheme: scripture.colorScheme,
    badgeColor: scripture.id === "heart-sutra" ? "#EF4223" :
                scripture.id === "diamond-sutra" ? "#21212F" :
                scripture.id === "lotus-sutra" ? "#0080FF" :
                scripture.id === "sixpatriarch-sutra" ? "#4CAF50" : "#DE7834"
  }));

  // Filter bookmarks by active scripture
  const filteredBookmarks = activeScripture 
    ? typedBookmarks.filter(bookmark => bookmark.scriptureId === activeScripture)
    : typedBookmarks;

  const handleScriptureSelect = (id: string) => {
    setActiveScripture(activeScripture === id ? null : id);
  };

  return (
    <div className="bg-white min-h-screen font-['Pretendard']">
      <div className="flex flex-col w-full max-w-[360px] mx-auto">
        {/* Status Bar */}
        <div className="h-11 px-5 flex items-center justify-between">
          <span className="text-base">9:41</span>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-[#EAECEE]">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/scripture')}>
              <ArrowLeft size={28} />
            </button>
            <span className="font-bold text-xl text-[#111]">북마크</span>
          </div>
        </div>
        
        {/* Scripture tabs */}
        <div className="flex overflow-x-auto gap-0 px-5 py-2 border-b border-[#EAECEE]">
          {allScriptureOptions.map((option) => (
            <button
              key={option.id}
              className={`h-8 px-3 mx-0 flex items-center border-2 ${
                activeScripture === option.id
                  ? 'border-[#DE7834] text-[#DE7834]'
                  : 'border-[#76767680] text-[#767676]'
              }`}
              onClick={() => handleScriptureSelect(option.id)}
            >
              <span className="text-sm font-bold whitespace-nowrap">
                {option.title}
              </span>
            </button>
          ))}
        </div>

        {/* Bookmark list */}
        <div className="p-5">
          <h2 className="text-xl font-bold text-[#111] mb-4">
            {filteredBookmarks.length}개의 북마크가 있습니다
          </h2>
          
          {filteredBookmarks.length > 0 ? (
            <div className="space-y-2">
              {filteredBookmarks.map((bookmark) => {
                const scripture = Object.values(typedScriptures).find(s => s.id === bookmark.scriptureId);
                const chapter = scripture?.chapters.find(ch => ch.id === bookmark.chapterId);
                
                if (!scripture) return null;
                
                let badgeColor = "#EF4223";
                if (scripture.id === "diamond-sutra") {
                  badgeColor = "#21212F";
                } else if (scripture.id === "lotus-sutra") {
                  badgeColor = "#0080FF";
                } else if (scripture.id === "sixpatriarch-sutra") {
                  badgeColor = "#4CAF50";
                }
                
                return (
                  <div
                    key={bookmark.id}
                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center cursor-pointer"
                    onClick={() => navigate(`/scripture/${bookmark.scriptureId}`)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="px-2 py-2 rounded-xl"
                        style={{ backgroundColor: badgeColor }}
                      >
                        <span className="text-xs text-white">
                          {scripture.title}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-[#111]">
                        {chapter?.title || '제1권 1장'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-[#767676]">시작하기</span>
                      <ChevronRight size={12} className="text-[#767676]" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500">북마크가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptureBookmarkPage;
