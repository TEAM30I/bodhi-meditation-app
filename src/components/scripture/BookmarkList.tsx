
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { bookmarks, scriptures } from '@/data/scriptureRepository';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BookmarkList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col">
      <h1 className="text-lg font-bold text-center mb-4">모든 기록</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full flex rounded-none border-b mb-4">
          <TabsTrigger 
            value="all" 
            className="flex-1 pb-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 data-[state=active]:font-medium"
          >
            전체
          </TabsTrigger>
          <TabsTrigger 
            value="highlights" 
            className="flex-1 pb-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 data-[state=active]:font-medium"
          >
            하이라이트
          </TabsTrigger>
          <TabsTrigger 
            value="bookmarks" 
            className="flex-1 pb-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 data-[state=active]:font-medium"
          >
            북마크
          </TabsTrigger>
          <TabsTrigger 
            value="notes" 
            className="flex-1 pb-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 data-[state=active]:font-medium"
          >
            필기
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0 pt-2">
          <div className="space-y-6">
            {bookmarks.map((bookmark, index) => (
              <div 
                key={bookmark.id} 
                className="flex mb-6 pb-6 border-b border-gray-100 last:border-none cursor-pointer"
                onClick={() => navigate(`/scripture/${bookmark.scriptureId}?position=${bookmark.position}`)}
              >
                <div className="mr-4 w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                  {/* Placeholder for profile image */}
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="text-sm font-medium">김시은님이 반야심경 2페이지에 하이라이트 했어요</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{bookmark.date ? format(new Date(bookmark.date), 'd일 전') : '6일 전'}</p>
                  
                  <div className="flex items-center mb-2">
                    <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">반야심경 2페이지 &gt;</span>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    논도, 고도, 행도. 관자로 주색하였고,
                    보이 묘고 비는 묘대상주처이다.
                    고경실 이-내는 경절 일하다.
                  </p>
                </div>
              </div>
            ))}
            
            <div 
              className="flex mb-6 pb-6 border-b border-gray-100 last:border-none cursor-pointer"
            >
              <div className="mr-4 w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                {/* Placeholder for profile image */}
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h3 className="text-sm font-medium">김시은님이 반야심경 24페이지에 읽었어요</h3>
                </div>
                <p className="text-xs text-gray-500 mb-2">9일 전</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="highlights" className="mt-0">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">아직 하이라이트한 내용이 없습니다</p>
          </div>
        </TabsContent>
        
        <TabsContent value="bookmarks" className="mt-0">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">아직 북마크한 내용이 없습니다</p>
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-0">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">아직 필기한 내용이 없습니다</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookmarkList;
