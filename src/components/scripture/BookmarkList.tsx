import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Bookmark, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { bookmarks, Bookmark as BookmarkType } from '@/data/scriptureData';

// Extend the BookmarkType to include optional date property
interface EnhancedBookmark extends BookmarkType {
  date?: Date;
}

interface BookmarkListProps {
  scriptureId?: string;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ scriptureId }) => {
  const navigate = useNavigate();
  const [bookmarkList, setBookmarkList] = useState(bookmarks);

  const filteredBookmarks = scriptureId
    ? bookmarkList.filter(bookmark => bookmark.scriptureId === scriptureId)
    : bookmarkList;

  const handleDeleteBookmark = (id: string) => {
    // Implement delete logic here, e.g., update state or call an API
    setBookmarkList(prevBookmarks => prevBookmarks.filter(bookmark => bookmark.id !== id));
  };

  return (
    <div>
      {filteredBookmarks.length > 0 ? (
        filteredBookmarks.map((bookmark) => (
          <div key={bookmark.id} className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">{bookmark.title}</h3>
                <p className="text-gray-500 text-sm mb-1">
                  {format(bookmark.createdAt, 'yyyy.MM.dd')}
                </p>
                {bookmark.note && <p className="text-gray-700 text-sm">{bookmark.note}</p>}
              </div>
              <button
                onClick={() => handleDeleteBookmark(bookmark.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-gray-500 text-sm">
                위치: {bookmark.position}
              </div>
              <button
                onClick={() => {
                  // Navigate to the scripture reading page with the specific bookmark position
                  navigate(`/scripture/${bookmark.scriptureId}`);
                }}
                className="flex items-center text-bodhi-orange hover:text-bodhi-orange-700"
              >
                <span className="mr-1">자세히 보기</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-48">
          <Bookmark size={48} className="text-gray-400 mb-2" />
          <p className="text-gray-500">북마크가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default BookmarkList;
