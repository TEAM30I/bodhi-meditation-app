
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { bookmarks, scriptures } from '@/data/scriptureData';

const BookmarkList: React.FC = () => {
  const navigate = useNavigate();
  
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl">
        <h3 className="text-gray-500 mb-2">저장된 북마크가 없습니다</h3>
        <p className="text-sm text-gray-400">경전을 읽는 중 북마크를 추가해보세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">북마크</h2>
      
      {bookmarks.map((bookmark) => {
        const scripture = Object.values(scriptures).find(s => s.id === bookmark.scriptureId);
        if (!scripture) return null;
        
        const chapter = scripture.chapters.find(ch => ch.id === bookmark.chapterId);
        
        return (
          <div 
            key={bookmark.id}
            className="bg-white rounded-xl p-4 shadow-sm"
            onClick={() => navigate(`/scripture/${bookmark.scriptureId}`)}
          >
            <div className={`inline-flex px-3 py-1 ${scripture.colorScheme.bg} rounded-full mb-2`}>
              <span className={`text-xs font-medium ${scripture.colorScheme.text}`}>
                {chapter?.title || scripture.title}
              </span>
            </div>
            
            <h3 className="font-medium mb-1">{bookmark.title}</h3>
            <p className="text-xs text-gray-500 mb-2">
              {bookmark.date} 저장됨
            </p>
            
            {bookmark.note && (
              <p className="text-sm text-gray-700 border-t border-gray-100 pt-2 mt-2">
                {bookmark.note}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookmarkList;
