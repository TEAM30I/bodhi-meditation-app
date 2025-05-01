import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Badge } from '@/components/ui/badge';
import { bookmarks, scriptures } from '@/utils/repository';
import { typedData } from '@/utils/typeUtils';

const ScriptureBookmarkPage = () => {
  const navigate = useNavigate();
  const [activeScripture, setActiveScripture] = useState<string | null>(null);
  const [filteredBookmarks, setFilteredBookmarks] = useState<typeof bookmarks>([]);
  
  const typedBookmarks = typedData<typeof bookmarks>(bookmarks);
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  const scriptureCategories = Object.keys(typedScriptures).map(id => ({
    id,
    name: typedScriptures[id].title,
    active: false
  })).slice(0, 5);

  useEffect(() => {
    if (scriptureCategories.length > 0 && !activeScripture) {
      setActiveScripture(scriptureCategories[0].id);
    }
    
    if (activeScripture) {
      setFilteredBookmarks(typedBookmarks.filter(bookmark => 
        bookmark.scriptureId === activeScripture
      ));
    } else {
      setFilteredBookmarks(typedBookmarks);
    }
  }, [activeScripture, typedBookmarks, scriptureCategories]);
  
  const handleScriptureClick = (id: string) => {
    setActiveScripture(id);
  };
  
  const handleBookmarkClick = (bookmarkId: string) => {
    const bookmark = typedBookmarks.find(b => b.id === bookmarkId);
    if (bookmark) {
      navigate(`/scripture/${bookmark.scriptureId}?chapter=${bookmark.chapterId}&page=${bookmark.pageIndex}`);
    }
  };
  
  return (
    <PageLayout title="북마크" showBackButton={true}>
      <div className="w-full max-w-[480px] mx-auto">
        {/* Scripture filters */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {scriptureCategories.map((scripture) => (
            <div 
              key={scripture.id}
              className={`flex items-center h-8 px-3 rounded-full cursor-pointer whitespace-nowrap ${
                activeScripture === scripture.id 
                ? 'bg-[#DE7834] text-white' 
                : 'bg-gray-100 text-gray-600'
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
        <div className="px-4 py-2">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            {filteredBookmarks.length}개의 북마크
          </h2>
          
          <div className="space-y-2">
            {filteredBookmarks.map((bookmark) => {
              const scripture = typedScriptures[bookmark.scriptureId];
              const colorScheme = scripture?.colorScheme || { bg: '#EF4223', text: '#ffffff' };
              
              return (
                <div 
                  key={bookmark.id}
                  className="flex items-center p-4 bg-white rounded-xl shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => handleBookmarkClick(bookmark.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="flex items-center justify-center px-2 py-1 rounded-lg"
                      style={{ backgroundColor: colorScheme.bg }}
                    >
                      <span className="text-xs text-white">
                        {scripture?.title || '경전'}
                      </span>
                    </div>
                    <span className="text-base font-medium text-gray-900">
                      {bookmark.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              );
            })}
            
            {filteredBookmarks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">북마크가 없습니다</p>
                <p className="text-gray-400 text-sm mt-1">경전 읽기에서 북마크를 추가해보세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ScriptureBookmarkPage;
