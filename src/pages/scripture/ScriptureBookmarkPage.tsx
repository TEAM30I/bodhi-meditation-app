
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { bookmarks, scriptures, scriptureCategories } from '@/utils/repository';
import { typedData } from '@/utils/typeUtils';

const ScriptureBookmarkPage = () => {
  const navigate = useNavigate();
  const [activeScripture, setActiveScripture] = useState<string | null>(null);
  const [filteredBookmarks, setFilteredBookmarks] = useState<typeof bookmarks>([]);
  
  const typedBookmarks = typedData<typeof bookmarks>(bookmarks);
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  const typedScriptureCategories = Object.keys(typedScriptures).map(id => ({
    id,
    name: typedScriptures[id].title,
    active: false
  })).slice(0, 5); // Limit to 5 scriptures
  
  useEffect(() => {
    // Set first scripture as active by default
    if (typedScriptureCategories.length > 0 && !activeScripture) {
      setActiveScripture(typedScriptureCategories[0].id);
    }
    
    // Filter bookmarks based on active scripture
    if (activeScripture) {
      setFilteredBookmarks(typedBookmarks.filter(bookmark => 
        bookmark.scriptureId === activeScripture
      ));
    } else {
      setFilteredBookmarks(typedBookmarks);
    }
  }, [activeScripture, typedBookmarks, typedScriptureCategories]);
  
  const handleScriptureClick = (id: string) => {
    setActiveScripture(id);
  };
  
  const handleBackClick = () => {
    navigate('/scripture');
  };
  
  const handleBookmarkClick = (bookmarkId: string) => {
    const bookmark = typedBookmarks.find(b => b.id === bookmarkId);
    if (bookmark) {
      navigate(`/scripture/${bookmark.scriptureId}?chapter=${bookmark.chapterId}&page=${bookmark.pageIndex}`);
    }
  };
  
  return (
    <div className="bg-[#F1F3F5] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between h-[56px] px-5 border-b border-[#EAECEE] bg-white">
        <div className="flex items-center gap-4">
          <button onClick={handleBackClick}>
            <ArrowLeft className="w-7 h-7" />
          </button>
          <h1 className="text-xl font-bold text-[#111]">북마크</h1>
        </div>
      </div>
      
      {/* Scripture filters */}
      <div className="flex gap-2 px-5 py-3 overflow-x-auto border-b border-[#EAECEE] bg-white">
        {typedScriptureCategories.map((scripture) => (
          <div 
            key={scripture.id}
            className={`flex items-center h-[32px] px-3 rounded-full cursor-pointer ${
              activeScripture === scripture.id 
              ? 'bg-[#DE7834] text-white' 
              : 'bg-gray-100 text-[#767676]'
            }`}
            onClick={() => handleScriptureClick(scripture.id)}
          >
            <span className="text-sm font-medium">
              {typedScriptures[scripture.id]?.title || scripture.name}
            </span>
          </div>
        ))}
      </div>
      
      {/* Bookmark list */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-[#111] mb-4">
          {filteredBookmarks.length}개의 북마크가 있습니다
        </h2>
        
        <div className="flex flex-col gap-2">
          {filteredBookmarks.map((bookmark) => {
            const scripture = typedScriptures[bookmark.scriptureId];
            // Default color scheme if not available
            const colorScheme = scripture?.colorScheme || { bg: '#EF4223', text: '#ffffff' };
            
            return (
              <div 
                key={bookmark.id}
                className="flex items-center p-5 bg-white rounded-2xl shadow-sm cursor-pointer"
                onClick={() => handleBookmarkClick(bookmark.id)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="flex items-center justify-center px-2 py-2 rounded-xl"
                    style={{ backgroundColor: colorScheme.bg }}
                  >
                    <span className="text-xs" style={{ color: colorScheme.text }}>
                      {scripture?.title || '경전'}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[#111]">
                    {bookmark.title}
                  </span>
                </div>
                <div className="flex items-center ml-auto gap-1">
                  <span className="text-xs text-[#767676]">시작하기</span>
                  <ChevronRight className="w-3 h-3 text-[#767676]" />
                </div>
              </div>
            );
          })}
          
          {filteredBookmarks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">북마크가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">경전 읽기에서 북마크를 추가해 보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptureBookmarkPage;
