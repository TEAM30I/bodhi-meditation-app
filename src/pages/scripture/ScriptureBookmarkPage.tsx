import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import { Badge } from '../../components/ui/badge';
import { getBookmarks, getScriptureList } from '../../lib/repository';
import { typedData } from '../../utils/typeUtils';
import { Bookmark, Scripture } from '../../types';

const ScriptureBookmarkPage = () => {
  const navigate = useNavigate();
  const [activeScripture, setActiveScripture] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userId = 'current-user-id';
        const bookmarksData = await getBookmarks(userId);
        const scripturesData = await getScriptureList();
        
        setBookmarks(bookmarksData);
        setScriptures(scripturesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const scriptureCategories = scriptures.map(scripture => ({
    id: scripture.id,
    name: scripture.title,
    active: false
  })).slice(0, 5);
  
  useEffect(() => {
    if (scriptureCategories.length > 0 && !activeScripture) {
      setActiveScripture(scriptureCategories[0].id);
    }
    
    if (activeScripture) {
      setFilteredBookmarks(bookmarks.filter(bookmark => 
        bookmark.scriptureId === activeScripture
      ));
    } else {
      setFilteredBookmarks(bookmarks);
    }
  }, [activeScripture, bookmarks, scriptureCategories]);
  
  const handleScriptureClick = (id: string) => {
    setActiveScripture(id);
  };
  
  const handleBookmarkClick = (bookmarkId: string) => {
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    if (bookmark) {
      navigate(`/scripture/${bookmark.scriptureId}?chapter=${bookmark.chapterId}&page=${bookmark.pageIndex}`);
    }
  };
  
  if (loading) {
    return (
      <PageLayout title="북마크" showBackButton={true}>
        <div className="flex items-center justify-center h-64">
          <p>북마크를 불러오는 중...</p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="북마크" showBackButton={true}>
      <div className="w-full max-w-[480px] mx-auto">
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
                {scriptures.find(s => s.id === scripture.id)?.title || scripture.name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="px-4 py-2">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            {filteredBookmarks.length}개의 북마크
          </h2>
          
          <div className="space-y-2">
            {filteredBookmarks.map((bookmark) => {
              const scripture = scriptures.find(s => s.id === bookmark.scriptureId);
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
