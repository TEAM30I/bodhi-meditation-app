
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { typedData } from '@/utils/typeUtils';
import { bookmarks, scriptures } from '/public/data/scriptureData/scriptureRepository';

const BookmarkList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('diamond-sutra');
  
  const tabs = [
    { id: 'diamond-sutra', label: '반야심경' },
    { id: 'heart-sutra', label: '법화경' },
    { id: 'lotus-sutra', label: '금강경' },
    { id: 'all', label: '법화경' },
    { id: 'recent', label: '반야심경' },
  ];
  
  // Type the repository data
  const typedBookmarks = typedData<typeof bookmarks>(bookmarks);
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  
  if (typedBookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl">
        <h3 className="text-gray-500 mb-2">저장된 북마크가 없습니다</h3>
        <p className="text-sm text-gray-400">경전을 읽는 중 북마크를 추가해보세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab navigation */}
      <div className="flex overflow-x-auto pb-2 border-b whitespace-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-3 py-2 text-sm font-medium ${activeTab === tab.id ? 'text-[#DE7834] border-b-2 border-[#DE7834]' : 'text-gray-500'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Bookmarks */}
      <div className="space-y-3">
        {typedBookmarks.filter(b => activeTab === 'all' || b.scriptureId === activeTab).map((bookmark) => {
          const scripture = Object.values(typedScriptures).find(s => s.id === bookmark.scriptureId);
          if (!scripture) return null;
          
          const chapter = scripture.chapters.find(ch => ch.id === bookmark.chapterId);
          
          return (
            <div 
              key={bookmark.id}
              className="bg-white rounded-xl p-4 flex items-center"
              onClick={() => navigate(`/scripture/${bookmark.scriptureId}`)}
            >
              <div className="flex-1">
                <div className={`inline-flex px-3 py-1 ${scripture.colorScheme.bg || 'bg-[#DE7834]'} rounded-full mb-2`}>
                  <span className={`text-xs font-medium ${scripture.colorScheme.text || 'text-white'}`}>
                    {scripture.title}
                  </span>
                </div>
                
                <h3 className="font-medium text-sm mb-1">{bookmark.title}</h3>
                <p className="text-xs text-gray-500">
                  {bookmark.date} 저장됨
                </p>
              </div>
              
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookmarkList;
