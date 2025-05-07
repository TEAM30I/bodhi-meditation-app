
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TempleItem from '@/components/search/TempleItem';
import TempleStayItem from '@/components/search/TempleStayItem';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Temple } from '@/types/temple';
import { TempleStay } from '@/types/templeStay';
import { getUserFollowedTemples, getUserFollowedTempleStays } from '@/lib/repository';

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
                    temple={temple}
                    onClick={() => navigate(`/search/temple/detail/${temple.id}`)}
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
                {templeStays.map(templeStay => (
                  <TempleStayItem
                    key={templeStay.id}
                    templeStay={templeStay}
                    onClick={() => navigate(`/search/temple-stay/detail/${templeStay.id}`)}
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
