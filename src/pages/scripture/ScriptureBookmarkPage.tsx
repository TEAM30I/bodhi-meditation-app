
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { scriptures, bookmarks } from '../../../public/data/scriptureData/scriptureRepository';
import ScriptureBottomNav from '@/components/ScriptureBottomNav';

const ScriptureBookmarkPage = () => {
  const navigate = useNavigate();
  const [activeScriptureId, setActiveScriptureId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  const typedBookmarks = typedData<typeof bookmarks>(bookmarks);
  
  // Get unique scripture IDs from bookmarks
  const scriptureIds = [...new Set(typedBookmarks.map(bookmark => bookmark.scriptureId))];

  useEffect(() => {
    // If we have scripture IDs, set the first one as active by default
    if (scriptureIds.length > 0 && !activeScriptureId) {
      setActiveScriptureId(scriptureIds[0]);
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [scriptureIds, activeScriptureId]);

  // Filter bookmarks by active scripture
  const filteredBookmarks = activeScriptureId 
    ? typedBookmarks.filter(bookmark => bookmark.scriptureId === activeScriptureId)
    : typedBookmarks;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DE7834]"></div>
      </div>
    );
  }

  // Get a list of all scripture titles from the typedScriptures object
  const scriptureList = Object.values(typedScriptures).map(scripture => ({
    id: scripture.id,
    title: scripture.title
  }));

  return (
    <div className="bg-[#F1F3F5] min-h-screen pb-20 font-['Pretendard']">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate('/scripture')}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">북마크</h1>
      </div>

      {/* Scripture Filter Tabs */}
      <div className="bg-white w-full overflow-x-auto px-5 py-3 border-b border-[#E5E5EC]">
        <div className="flex space-x-3">
          {scriptureList.map(scripture => (
            <button
              key={scripture.id}
              className={`px-3 py-2 whitespace-nowrap ${
                activeScriptureId === scripture.id 
                  ? 'border-2 border-[#DE7834] text-[#DE7834] font-bold'
                  : 'border-2 border-gray-300 text-gray-500'
              }`}
              onClick={() => setActiveScriptureId(scripture.id)}
            >
              {scripture.title}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmark List */}
      <div className="px-5 py-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {filteredBookmarks.length}개의 북마크가 있습니다
        </h2>
        
        <div className="space-y-3">
          {filteredBookmarks.map(bookmark => {
            const scripture = typedScriptures[bookmark.scriptureId];
            if (!scripture) return null;
            
            // Determine badge color based on scripture ID
            const badgeColor = scripture.id === "heart-sutra" ? "#EF4223" :
                          scripture.id === "diamond-sutra" ? "#21212F" :
                          scripture.id === "lotus-sutra" ? "#0080FF" :
                          scripture.id === "sixpatriarch-sutra" ? "#4CAF50" :
                          scripture.id === "avatamsaka-sutra" ? "#FFB23F" : "#DE7834";
            
            return (
              <div 
                key={bookmark.id}
                className="bg-white p-5 rounded-xl shadow-sm cursor-pointer"
                onClick={() => navigate(`/scripture/${bookmark.scriptureId}`)}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center px-2 py-2 rounded-xl mb-3"
                         style={{ backgroundColor: badgeColor }}>
                      <span className="text-xs font-medium text-white">
                        {scripture.title}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {bookmark.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <span className="text-xs mr-1">시작하기</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredBookmarks.length === 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <p className="text-gray-500">북마크가 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* Scripture Bottom Navigation */}
      <ScriptureBottomNav 
        activeTab="bookmark"
        onTabChange={(tab) => {
          if (tab === 'reading') navigate('/scripture');
          else if (tab === 'calendar') navigate('/scripture/calendar');
          else if (tab === 'share') navigate('/scripture/share');
          else if (tab === 'settings') navigate('/scripture/settings');
        }}
      />
    </div>
  );
};

export default ScriptureBookmarkPage;
