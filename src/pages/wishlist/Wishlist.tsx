import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TempleItem from '@/components/search/TempleItem';
import TempleStayItem from '@/components/search/TempleStayItem';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Temple } from '@/types/temple';
import { TempleStay } from '@/types/templeStay';
import { getUserFollowedTemples, getUserFollowedTempleStays, toggleTempleStayFollow } from '@/lib/repository';
import { toast } from 'sonner';
import { toggleTempleFollow } from '@/lib/repository';

const Wishlist = () => {
  const { user } = useAuth();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [templeStays, setTempleStays] = useState<TempleStay[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          setLoading(true);
          // Use a default ID if user.id is not available
          const userId = user.id || 'anonymous';
          
          const [templesData, templeStaysData] = await Promise.all([
            getUserFollowedTemples(userId),
            getUserFollowedTempleStays(userId)
          ]);
          
          setTemples(templesData);
          setTempleStays(templeStaysData);
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, [user]);

  const handleTempleUnfollow = async (templeId: string) => {
    try {
      if (!user) return;
      
      await toggleTempleFollow(user.id, templeId);
      setTemples(prev => prev.filter(temple => temple.id !== templeId));
      toast.success('찜 목록에서 제거했습니다.');
    } catch (error) {
      console.error('Error unfollowing temple:', error);
      toast.error('처리 중 오류가 발생했습니다.');
    }
  };

  const handleTempleStayUnfollow = async (e: React.MouseEvent, templeStayId: string) => {
    e.stopPropagation();
    try {
      if (!user) return;
      
      await toggleTempleStayFollow(user.id, templeStayId);
      setTempleStays(prev => prev.filter(ts => ts.id !== templeStayId));
      toast.success('찜 목록에서 제거했습니다.');
    } catch (error) {
      console.error('Error unfollowing temple stay:', error);
      toast.error('처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <PageLayout title="찜 목록">
      <div className="p-4">
        <Tabs defaultValue="temples" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="temples" className="flex-1">사찰</TabsTrigger>
            <TabsTrigger value="templeStays" className="flex-1">템플스테이</TabsTrigger>
          </TabsList>
          
          <TabsContent value="temples">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#DE7834]"></div>
              </div>
            ) : temples.length > 0 ? (
              <div className="grid gap-3">
                {temples.map(temple => (
                  <TempleItem
                    key={temple.id}
                    temple={{
                      ...temple,
                      follower_count: temple.follower_count || temple.likeCount || 0
                    }}
                    onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
                    isLiked={true}
                    onLikeToggle={() => handleTempleUnfollow(temple.id)}
                    showLikeCount={true}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">찜한 사찰이 없습니다.</p>
            )}
          </TabsContent>
          
          <TabsContent value="templeStays">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#DE7834]"></div>
              </div>
            ) : templeStays.length > 0 ? (
              <div className="grid gap-4">
                {templeStays.map((templeStay) => (
                  <TempleStayItem
                    key={templeStay.id}
                    templeStay={{
                      ...templeStay,
                      // 템플스테이 정보가 완전하게 표시되도록 보장 - SearchResults와 정확히 동일
                      templeName: (templeStay as any).temple_name || (templeStay as any).name || templeStay.templeName,
                      location: templeStay.temple?.address || templeStay.location || '주소 정보 없음',
                      price: typeof templeStay.price === 'number' ? templeStay.price : 
                             (typeof templeStay.price === 'string' ? parseInt((templeStay.price as string).replace(/[^\d]/g, '') || '0') : 0),
                      likeCount: templeStay.likeCount || 0
                      // temple 객체는 이미 포함되어 있으므로 추가할 필요 없음
                    }}
                    onClick={() => navigate(`/search/temple-stay/detail/${templeStay.id}`)}
                    isLiked={true}
                    onLikeToggle={(e) => handleTempleStayUnfollow(e, templeStay.id)}
                    showLikeCount={true}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">찜한 템플스테이가 없습니다.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      {/* <BottomNav /> */}
    </PageLayout>
  );
};

export default Wishlist;
