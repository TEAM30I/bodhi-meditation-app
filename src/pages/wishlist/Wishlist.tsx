
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/context/AuthContext';
import {
  // Import the types but not the functions as they'll be mocked below
  Temple, TempleStay,
} from '@/utils/repository';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TempleItem from '@/components/search/TempleItem';
import TempleStayItem from '@/components/search/TempleStayItem';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Create temporary mock implementations based on supabase schema
const getUserFollowedTemples = async (userId: string): Promise<Temple[]> => {
  try {
    const { data, error } = await supabase
      .from('user_follow_temples')
      .select('temple_id, temples(*)')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user followed temples:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      id: item.temples.id,
      name: item.temples.name,
      location: item.temples.region,
      imageUrl: item.temples.image_url,
      description: item.temples.description,
      likeCount: item.temples.follower_count,
      latitude: item.temples.latitude,
      longitude: item.temples.longitude
    }));
  } catch (error) {
    console.error('Error in getUserFollowedTemples:', error);
    return [];
  }
};

const getUserFollowedTempleStays = async (userId: string): Promise<TempleStay[]> => {
  try {
    const { data, error } = await supabase
      .from('user_follow_temple_stays')
      .select('temple_stay_id, temple_stays(*)')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user followed temple stays:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      id: item.temple_stays.id,
      templeName: item.temple_stays.name,
      location: item.temple_stays.region,
      imageUrl: item.temple_stays.image_url,
      price: parseInt(item.temple_stays.cost_adult) || 50000,
      likeCount: item.temple_stays.follower_count
    }));
  } catch (error) {
    console.error('Error in getUserFollowedTempleStays:', error);
    return [];
  }
};

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
      <BottomNav />
    </PageLayout>
  );
};

export default Wishlist;
