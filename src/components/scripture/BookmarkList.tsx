
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { bookmarks, scriptures } from '@/data/scriptureRepository';
import { format } from 'date-fns';

const BookmarkList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4">북마크</h2>
      
      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => {
            const scripture = scriptures.find(s => s.id === bookmark.scriptureId);
            
            if (!scripture) return null;
            
            return (
              <div 
                key={bookmark.id} 
                className="p-4 border rounded-lg cursor-pointer"
                onClick={() => navigate(`/scripture/${scripture.id}?position=${bookmark.position}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm">{bookmark.title}</h3>
                  <span className="text-xs text-gray-500">
                    {format(new Date(bookmark.date), 'yyyy.MM.dd')}
                  </span>
                </div>
                
                <div className="text-sm text-gray-700">
                  <p>{scripture.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    위치: {Math.round(bookmark.position / scripture.content.length * 100)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-500 mb-3">저장된 북마크가 없습니다</p>
          <button className="text-orange-500 font-medium">
            경전을 읽고 북마크를 추가해보세요
          </button>
        </div>
      )}
    </div>
  );
};

export default BookmarkList;
