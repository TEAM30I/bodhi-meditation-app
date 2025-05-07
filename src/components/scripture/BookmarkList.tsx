import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { typedData } from '../../utils/typeUtils';
import { getBookmarks, getScriptureList } from '../../lib/repository';
import { useAuth } from '../../hooks/useAuth';
import { Bookmark, Scripture } from '../../types';

const BookmarkList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 실제 API에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setLoading(true);
          const bookmarksData = await getBookmarks(user.id);
          const scripturesData = await getScriptureList();
          
          setBookmarks(bookmarksData);
          setScriptures(scripturesData);
        } catch (error) {
          console.error('Error fetching bookmarks:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // 사용자가 로그인하지 않은 경우 빈 배열 설정
        setBookmarks([]);
        setScriptures([]);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">북마크</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <p className="text-center py-4">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">북마크</h2>
      
      {bookmarks.length > 0 ? (
        <div>
          {bookmarks.map((bookmark) => {
            // Find the scripture by id
            const scripture = scriptures.find(
              s => s.id === bookmark.scriptureId
            );
            
            // Find the chapter by id
            const chapter = scripture?.chapters.find(
              c => c.id === bookmark.chapterId
            );
            
            if (!scripture) return null;
            
            return (
              <div 
                key={bookmark.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3"
                onClick={() => navigate(`/scripture/${scripture.id}?chapter=${bookmark.chapterId}&page=${bookmark.pageIndex}`)}
              >
                <div className="flex items-center mb-2">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: scripture.colorScheme.bg }}
                  >
                    <span 
                      className="text-xs font-medium"
                      style={{ color: scripture.colorScheme.text }}
                    >
                      {scripture.title.substring(0, 1)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{bookmark.title}</h3>
                    <p className="text-xs text-gray-500">{chapter?.title || scripture.title}</p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mb-2">
                  저장일: {new Date(bookmark.date).toLocaleDateString()}
                </p>
                
                {bookmark.note && (
                  <p className="text-sm bg-gray-50 p-2 rounded mb-2">{bookmark.note}</p>
                )}
                
                <div className="flex justify-end">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            );
          })}
          
          <button 
            className="w-full py-2 text-center text-sm text-blue-600"
            onClick={() => navigate('/scripture/bookmark')}
          >
            모든 북마크 보기
          </button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg text-center">
          <p className="text-gray-500 mb-3">저장된 북마크가 없습니다.</p>
          <button 
            className="text-sm text-blue-600"
            onClick={() => navigate('/scripture')}
          >
            경전 읽기로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
};

export default BookmarkList;
