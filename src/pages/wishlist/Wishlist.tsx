
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
          
          // Fetch temples directly from Supabase
          const templesResponse = await supabase
            .from('user_follow_temples')
            .select('temple_id, temples(*)')
            .eq('user_id', userId);
            
          const templeStaysResponse = await supabase
            .from('user_follow_temple_stays')
            .select('temple_stay_id, temple_stays(*)')
            .eq('user_id', userId);
          
          if (templesResponse.error) {
            console.error("Error fetching temples:", templesResponse.error);
          } else {
            const templesData = templesResponse.data.map(item => ({
              id: item.temples.id,
              name: item.temples.name,
              location: item.temples.region,
              imageUrl: item.temples.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
              description: item.temples.description,
              likeCount: item.temples.follower_count,
              latitude: item.temples.latitude,
              longitude: item.temples.longitude
            }));
            setTemples(templesData);
          }
          
          if (templeStaysResponse.error) {
            console.error("Error fetching temple stays:", templeStaysResponse.error);
          } else {
            const templeStaysData = templeStaysResponse.data.map(item => ({
              id: item.temple_stays.id,
              templeName: item.temple_stays.name,
              location: item.temple_stays.region,
              imageUrl: item.temple_stays.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
              price: parseInt(item.temple_stays.cost_adult) || 50000,
              likeCount: item.temple_stays.follower_count || 0,
              direction: item.temple_stays.public_transportation || "대중교통 이용 가능",
              schedule: []
            }));
            setTempleStays(templeStaysData);
          }
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
      <BottomNav />
    </PageLayout>
  );
};

export default Wishlist;
