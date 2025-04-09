
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';

// Use relative imports
import { bookmarks, scriptures } from '../../public/data/scriptureData/scriptureRepository';

const ScriptureBookmarkPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeScripture, setActiveScripture] = useState<string | null>(null);

  // Type our data properly
  const typedBookmarks = typedData<typeof bookmarks>(bookmarks);
  const typedScriptures = typedData<typeof scriptures>(scriptures);

  // Get unique scripture IDs from bookmarks
  const scriptureIds = [...new Set(typedBookmarks.map(bookmark => bookmark.scriptureId))];
  const scriptureOptions = scriptureIds.map(id => {
    const scripture = Object.values(typedScriptures).find(s => s.id === id);
    return {
      id,
      title: scripture?.title || '',
      colorScheme: scripture?.colorScheme
    };
  });

  // Filter bookmarks by active scripture
  const filteredBookmarks = activeScripture 
    ? typedBookmarks.filter(bookmark => bookmark.scriptureId === activeScripture)
    : typedBookmarks;

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <div className="sticky top-0 z-10 bg-white w-full h-[56px] flex items-center border-b border-[#E5E5EC] px-5">
        <button 
          onClick={() => navigate('/scripture')}
          className="mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-center flex-1">북마크</h1>
      </div>

      <div className="px-5 pt-4">
        {/* Scripture tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4">
          {scriptureOptions.map((option) => (
            <button
              key={option.id}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                activeScripture === option.id
                  ? `${option.colorScheme?.bg || 'bg-gray-800'} ${option.colorScheme?.text || 'text-white'}`
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
              onClick={() => setActiveScripture(activeScripture === option.id ? null : option.id)}
            >
              {option.title}
            </button>
          ))}
        </div>

        {/* Bookmark list */}
        <div className="pb-20">
          {filteredBookmarks.length > 0 ? (
            <div className="space-y-3">
              {filteredBookmarks.map((bookmark) => {
                const scripture = Object.values(typedScriptures).find(s => s.id === bookmark.scriptureId);
                const colorScheme = scripture?.colorScheme || {
                  bg: "bg-gray-800",
                  text: "text-white"
                };
                
                const chapter = scripture?.chapters.find(ch => ch.id === bookmark.chapterId);
                
                return (
                  <div
                    key={bookmark.id}
                    className="bg-white rounded-xl p-4 shadow-sm"
                    onClick={() => navigate(`/scripture/${bookmark.scriptureId}`)}
                  >
                    <div className={`inline-flex px-3 py-1 ${colorScheme.bg} rounded-full mb-2`}>
                      <span className={`text-xs font-medium ${colorScheme.text}`}>
                        {chapter?.title || scripture?.title}
                      </span>
                    </div>
                    <h3 className="font-medium text-base mb-1">{bookmark.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {bookmark.date} 저장됨
                    </p>
                    {bookmark.note && (
                      <p className="text-sm text-gray-700 border-t border-gray-100 pt-2">
                        {bookmark.note}
                      </p>
                    )}
                    <div className="flex justify-end">
                      <button className="text-sm text-orange-500">
                        자세히 &gt;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl">
              <p className="text-gray-500">북마크가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptureBookmarkPage;
