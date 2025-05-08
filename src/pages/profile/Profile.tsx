import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

// 컴포넌트 Props 타입 정의
interface FollowedItem {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  followedAt: string;
  type: 'temple' | 'temple_stay';
}

export default function Profile(): JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    username: "로딩 중..."
  });
  const [followedItems, setFollowedItems] = useState<FollowedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchFollowedItems();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      // user_settings 테이블에서 사용자 정보 가져오기
      const { data, error } = await supabase
        .from('user_settings')
        .select('nickname')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProfileData({
        username: `안녕하세요, ${data.nickname || '사용자'}님`
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // 에러가 발생해도 기본값으로 표시
      setProfileData({
        username: "안녕하세요, 사용자님"
      });
    }
  };

  const fetchFollowedItems = async () => {
    try {
      setLoading(true);
      
      // 사찰 팔로우 정보 가져오기
      const { data: templeFollowData, error: templeFollowError } = await supabase
        .from('user_follow_temples')
        .select('temple_id, created_at')
        .eq('user_id', user.id);

      if (templeFollowError) throw templeFollowError;

      let templesWithFollowDate: FollowedItem[] = [];
      
      if (templeFollowData && templeFollowData.length > 0) {
        const templeIds = templeFollowData.map(item => item.temple_id);
        
        const { data: templesData, error: templesError } = await supabase
          .from('temples')
          .select('id, name, region, image_url')
          .in('id', templeIds);

        if (templesError) throw templesError;

        templesWithFollowDate = templesData.map(temple => {
          const followInfo = templeFollowData.find(f => f.temple_id === temple.id);
          return {
            id: temple.id,
            name: temple.name,
            location: temple.region,
            imageUrl: temple.image_url || "/temple.png",
            followedAt: followInfo?.created_at || "",
            type: 'temple' as const
          };
        });
      }

      // 템플스테이 팔로우 정보 가져오기
      const { data: templeStayFollowData, error: templeStayFollowError } = await supabase
        .from('user_follow_temple_stays')
        .select('temple_stay_id, created_at')
        .eq('user_id', user.id);

      if (templeStayFollowError) throw templeStayFollowError;

      let templeStaysWithFollowDate: FollowedItem[] = [];
      
      if (templeStayFollowData && templeStayFollowData.length > 0) {
        const templeStayIds = templeStayFollowData.map(item => item.temple_stay_id);
        
        const { data: templeStaysData, error: templeStaysError } = await supabase
          .from('temple_stays')
          .select('id, name, region, image_url')
          .in('id', templeStayIds);

        if (templeStaysError) throw templeStaysError;

        templeStaysWithFollowDate = templeStaysData.map(templeStay => {
          const followInfo = templeStayFollowData.find(f => f.temple_stay_id === templeStay.id);
          return {
            id: templeStay.id,
            name: templeStay.name,
            location: templeStay.region,
            imageUrl: templeStay.image_url || "/temple.png",
            followedAt: followInfo?.created_at || "",
            type: 'temple_stay' as const
          };
        });
      }

      // 모든 팔로우 항목 (사찰 + 템플스테이)
      const allFollowed = [...templesWithFollowDate, ...templeStaysWithFollowDate].sort((a, b) => {
        // Date 객체로 변환하여 비교 (유효한 날짜가 아닐 경우 현재 시간 사용)
        const dateA = a.followedAt ? new Date(a.followedAt) : new Date();
        const dateB = b.followedAt ? new Date(b.followedAt) : new Date();
        return dateB.getTime() - dateA.getTime();
      });

      setFollowedItems(allFollowed);
    } catch (error) {
      console.error('Error fetching followed items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUnfollow = async (id: string, type: 'temple' | 'temple_stay') => {
    try {
      if (type === 'temple') {
        // 사찰 언팔로우
        const { error } = await supabase
          .from('user_follow_temples')
          .delete()
          .match({ user_id: user.id, temple_id: id });

        if (error) throw error;
      } else {
        // 템플스테이 언팔로우
        const { error } = await supabase
          .from('user_follow_temple_stays')
          .delete()
          .match({ user_id: user.id, temple_stay_id: id });

        if (error) throw error;
      }
      
      // 목록에서 제거
      setFollowedItems(followedItems.filter(item => !(item.id === id && item.type === type)));
    } catch (error) {
      console.error('Error unfollowing:', error);
    }
  };

  return (
    <PageLayout title="마이페이지" showBackButton={true}>
      <div className="w-full max-w-[480px] mx-auto flex flex-col">
        {/* 프로필 헤더 - 이미지 제거 */}
        <div className="p-4 flex items-center">
          <div>
            <h2 className="font-bold text-lg">{profileData.username}</h2>
          </div>
          <button 
            className="ml-auto text-blue-500"
            onClick={() => navigate('/profile/manage')}
          >
            관리
          </button>
        </div>
        
        {/* 팔로우 목록 */}
        <div className="mt-4 px-4">
          <h3 className="font-bold mb-2">팔로우 목록</h3>
          {loading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : followedItems.length > 0 ? (
            followedItems.map((item) => (
              <div 
                key={`${item.type}-${item.id}`}
                className="flex items-center p-3 mb-3 border-b border-gray-100"
              >
                <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.location}</div>
                  <div className="text-xs text-gray-400">
                    {item.type === 'temple' ? '사찰' : '템플스테이'}
                  </div>
                </div>
                <button
                  className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded-full"
                  onClick={() => handleUnfollow(item.id, item.type)}
                >
                  언팔로우
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              팔로우한 사찰이나 템플스테이가 없습니다.
            </div>
          )}
        </div>

        {/* Bottom Menu Items */}
        <div className="px-5 mt-6 space-y-4 mb-20">
          <div 
            className="flex justify-between items-center py-3 border-t border-gray-100 cursor-pointer"
            onClick={() => navigate('/reviews/write')}
          >
            <span className="text-gray-700">리뷰 작성하기</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div 
            className="flex justify-between items-center py-3 cursor-pointer"
            onClick={handleLogout}
          >
            <span className="text-gray-700">로그아웃</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="py-3">
            <span className="text-gray-500 text-sm">앱 버전 v1.0.0</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}