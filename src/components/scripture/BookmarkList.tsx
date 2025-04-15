
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';

// Use path that matches our wildcard type definition
import { bookmarks, scriptures } from '../../../public/data/scriptureData/scriptureRepository';

const BookmarkList = () => {
  const navigate = useNavigate();
  
  const typedBookmarks = typedData<typeof bookmarks>(bookmarks);
  const typedScriptures = typedData<typeof scriptures>(scriptures);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">북마크</h2>
      
      {typedBookmarks.length > 0 ? (
        <div>
          {typedBookmarks.map((bookmark) => {
            // Find the scripture by id
            const scripture = Object.values(typedScriptures).find(
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
                onClick={() => navigate(`/scripture/${scripture.id}`)}
              >
                <div className="flex items-center mb-2">
                  <div className={`${scripture.colorScheme.bg} h-8 w-8 rounded-full flex items-center justify-center mr-3`}>
                    <span className={`${scripture.colorScheme.text} text-xs font-medium`}>{scripture.title.substring(0, 1)}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{bookmark.title}</h3>
                    <p className="text-xs text-gray-500">{chapter?.title || scripture.title}</p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mb-2">저장일: {bookmark.date}</p>
                
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
