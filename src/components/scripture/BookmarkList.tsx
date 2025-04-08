
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { bookmarks, scriptures } from '@/data/scriptureRepository';
import { format } from 'date-fns';

interface BookmarkListProps {
  scriptureId?: string;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ scriptureId }) => {
  const navigate = useNavigate();
  
  // Filter bookmarks for the current scripture if scriptureId is provided
  const filteredBookmarks = scriptureId 
    ? bookmarks.filter(bookmark => bookmark.scriptureId === scriptureId)
    : bookmarks;
  
  // Find the scripture title
  const scripture = scriptureId ? scriptures.find(s => s.id === scriptureId) : null;

  return (
    <div className="w-full flex flex-col">
      {scripture && (
        <p className="text-sm text-gray-500 mb-4">
          {scripture.title} 북마크 목록
        </p>
      )}
      
      {filteredBookmarks.length > 0 ? (
        <div className="space-y-4">
          {filteredBookmarks.map((bookmark) => (
            <div 
              key={bookmark.id} 
              className="flex mb-4 pb-4 border-b border-gray-100 last:border-none cursor-pointer"
              onClick={() => navigate(`/scripture/${bookmark.scriptureId}?position=${bookmark.position}`)}
            >
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h3 className="text-sm font-medium">{bookmark.title || '북마크'}</h3>
                </div>
                <p className="text-xs text-gray-500 mb-2">{bookmark.date ? format(new Date(bookmark.date), 'd일 전') : '6일 전'}</p>
                
                <div className="flex items-center mb-2">
                  <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                  <span className="text-sm font-medium">{bookmark.page || '1'} 페이지</span>
                </div>
                
                <p className="text-sm text-gray-500">
                  {bookmark.excerpt || '북마크 내용이 없습니다.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500">아직 북마크한 내용이 없습니다</p>
        </div>
      )}
    </div>
  );
};

export default BookmarkList;
