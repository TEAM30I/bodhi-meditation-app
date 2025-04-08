
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookmarks } from '@/data/scriptureRepository';
import { format } from 'date-fns';

const ScriptureBookmarkList: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Filter bookmarks for current scripture only
  const scriptureBookmarks = bookmarks.filter(bookmark => bookmark.scriptureId === id);

  return (
    <div className="w-full flex flex-col">
      <h1 className="text-lg font-bold text-center mb-4">북마크</h1>
      
      {scriptureBookmarks.length > 0 ? (
        <div className="space-y-6">
          {scriptureBookmarks.map((bookmark) => (
            <div 
              key={bookmark.id} 
              className="flex mb-6 pb-6 border-b border-gray-100 last:border-none cursor-pointer"
              onClick={() => navigate(`/scripture/${bookmark.scriptureId}?position=${bookmark.position}`)}
            >
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                  <span className="text-sm font-medium">{bookmark.title || "북마크"}</span>
                </div>
                
                <p className="text-xs text-gray-500 mb-2">{bookmark.date ? format(new Date(bookmark.date), 'd일 전') : '6일 전'}</p>
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

export default ScriptureBookmarkList;
