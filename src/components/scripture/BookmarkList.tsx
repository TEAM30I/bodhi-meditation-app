
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { bookmarks } from '@/data/scriptureData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BookmarkList: React.FC<{ scriptureId?: string }> = ({ scriptureId }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Filter bookmarks by category
  const handleCategoryChange = (value: string) => {
    setActiveTab(value);
  };

  const filteredBookmarks = scriptureId 
    ? bookmarks.filter(bookmark => bookmark.scriptureId === scriptureId)
    : activeTab === 'all' 
      ? bookmarks
      : bookmarks.filter(bookmark => bookmark.scriptureId === activeTab);

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full px-4">
        <h1 className="text-xl font-bold mb-6">북마크</h1>

        {!scriptureId && (
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={handleCategoryChange}>
              <TabsList className="flex">
                <TabsTrigger 
                  value="all" 
                  className={`flex-1 px-4 py-2 ${activeTab === 'all' ? 'bg-gray-100' : ''}`}
                >
                  전체
                </TabsTrigger>
                <TabsTrigger 
                  value="금강경" 
                  className={`flex-1 px-4 py-2 ${activeTab === '금강경' ? 'bg-gray-100' : ''}`}
                >
                  금강경
                </TabsTrigger>
                <TabsTrigger 
                  value="반야심경" 
                  className={`flex-1 px-4 py-2 ${activeTab === '반야심경' ? 'bg-gray-100' : ''}`}
                >
                  반야심경
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        <div className="space-y-4">
          {filteredBookmarks.length > 0 ? (
            filteredBookmarks.map((bookmark) => (
              <div 
                key={bookmark.id}
                className="p-4 border rounded-lg cursor-pointer"
                onClick={() => navigate(`/scripture/${bookmark.scriptureId}?position=${bookmark.position}`)}
              >
                <div className="flex items-start">
                  <BookOpen className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <h3 className="text-base font-medium mb-1">{bookmark.title}</h3>
                    <p className="text-sm text-gray-600">
                      {/* Show position as page for display purposes */}
                      페이지 {Math.floor(bookmark.position / 300) + 1}
                    </p>
                    {/* Fixed error: excerpt property doesn't exist */}
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      이 부분에 마음이 와닿아 북마크했습니다...
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{bookmark.date}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <BookOpen className="w-12 h-12 mb-4" />
              <p>북마크를 찾을 수 없습니다.</p>
              <p className="text-sm mt-1">관심있는 내용을 북마크해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkList;
