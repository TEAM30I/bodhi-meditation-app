import React, { useState, useEffect } from "react";
import { Bell, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SearchBar from "@/components/profile/SearchBar";
import TempleItem from "@/components/profile/TempleItem";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    username: "로딩 중...",
    profileImage: ""
  });
  const [followedTemples, setFollowedTemples] = useState<FollowedItem[]>([]);
  const [followedTempleStays, setFollowedTempleStays] = useState<FollowedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("temples");

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchFollowedTemples();
      fetchFollowedTempleStays();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfileData({
        username: `안녕하세요, ${data.username || '사용자'}님`,
        profileImage: data.avatar_url || ""
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchFollowedTemples = async () => {
    try {
      setLoading(true);
      
      // user_follow_temples에서 팔로우 정보 가져오기
      const { data: followData, error: followError } = await supabase
        .from('user_follow_temples')
        .select('temple_id, created_at')
        .eq('user_id', user.id);

      if (followError) throw followError;

      if (followData && followData.length > 0) {
        // 팔로우한 사찰 ID 배열 생성
        const templeIds = followData.map(item => item.temple_id);
        
        // temples 테이블에서 해당 사찰 정보 가져오기
        const { data: templesData, error: templesError } = await supabase
          .from('temples')
          .select('id, name, region, image_url')
          .in('id', templeIds);

        if (templesError) throw templesError;

        // 팔로우 날짜 정보와 사찰 정보 합치기
        const templesWithFollowDate = templesData.map(temple => {
          const followInfo = followData.find(f => f.temple_id === temple.id);
          return {
            id: temple.id,
            name: temple.name,
            location: temple.region,
            imageUrl: temple.image_url || "/temple.png",
            followedAt: followInfo?.created_at || "",
            type: 'temple' as const
          };
        });

        setFollowedTemples(templesWithFollowDate);
      } else {
        setFollowedTemples([]);
      }
    } catch (error) {
      console.error('Error fetching followed temples:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowedTempleStays = async () => {
    try {
      // user_follow_temple_stays에서 팔로우 정보 가져오기
      const { data: followData, error: followError } = await supabase
        .from('user_follow_temple_stays')
        .select('temple_stay_id, created_at')
        .eq('user_id', user.id);

      if (followError) throw followError;

      if (followData && followData.length > 0) {
        // 팔로우한 템플스테이 ID 배열 생성
        const templeStayIds = followData.map(item => item.temple_stay_id);
        
        // temple_stays 테이블에서 해당 템플스테이 정보 가져오기
        const { data: templeStaysData, error: templeStaysError } = await supabase
          .from('temple_stays')
          .select('id, name, region, image_url')
          .in('id', templeStayIds);

        if (templeStaysError) throw templeStaysError;

        // 팔로우 날짜 정보와 템플스테이 정보 합치기
        const templeStaysWithFollowDate = templeStaysData.map(templeStay => {
          const followInfo = followData.find(f => f.temple_stay_id === templeStay.id);
          return {
            id: templeStay.id,
            name: templeStay.name,
            location: templeStay.region,
            imageUrl: templeStay.image_url || "/temple.png",
            followedAt: followInfo?.created_at || "",
            type: 'temple_stay' as const
          };
        });

        setFollowedTempleStays(templeStaysWithFollowDate);
      } else {
        setFollowedTempleStays([]);
      }
    } catch (error) {
      console.error('Error fetching followed temple stays:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
        
        // 상태 업데이트
        setFollowedTemples(followedTemples.filter(temple => temple.id !== id));
      } else {
        // 템플스테이 언팔로우
        const { error } = await supabase
          .from('user_follow_temple_stays')
          .delete()
          .match({ user_id: user.id, temple_stay_id: id });

        if (error) throw error;
        
        // 상태 업데이트
        setFollowedTempleStays(followedTempleStays.filter(templeStay => templeStay.id !== id));
      }
    } catch (error) {
      console.error('Error unfollowing:', error);
    }
  };

  const filteredTemples = followedTemples.filter(temple => 
    temple.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    temple.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTempleStays = followedTempleStays.filter(templeStay => 
    templeStay.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    templeStay.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 모든 팔로우 항목 (사찰 + 템플스테이)
  const allFollowed = [...followedTemples, ...followedTempleStays].sort((a, b) => {
    // Date 객체로 변환하여 비교 (유효한 날짜가 아닐 경우 현재 시간 사용)
    const dateA = a.followedAt ? new Date(a.followedAt) : new Date();
    const dateB = b.followedAt ? new Date(b.followedAt) : new Date();
    return dateB.getTime() - dateA.getTime();
  });

  const filteredAllFollowed = allFollowed.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout title="마이페이지" showBackButton={true}>
      <div className="w-full max-w-[480px] mx-auto flex flex-col">
        {/* 기존 ProfileHeader 컴포넌트를 사용하는 방식으로 수정 */}
        <div className="p-4 flex items-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
            {profileData.profileImage && (
              <img 
                src={profileData.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
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
        
        {/* 기존 SearchBar 컴포넌트를 인라인으로 대체 */}
        <div className="px-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="사찰 이름으로 검색"
              className="w-full p-2 pl-10 border border-gray-300 rounded-full"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              {/* 검색 아이콘 */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mt-4 px-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">전체</TabsTrigger>
            <TabsTrigger value="temples" className="flex-1">사찰</TabsTrigger>
            <TabsTrigger value="templeStays" className="flex-1">템플스테이</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-2">
            {loading ? (
              <div className="text-center py-8">로딩 중...</div>
            ) : filteredAllFollowed.length > 0 ? (
              filteredAllFollowed.map((item) => (
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
          </TabsContent>
          
          <TabsContent value="temples" className="mt-2">
            {loading ? (
              <div className="text-center py-8">로딩 중...</div>
            ) : filteredTemples.length > 0 ? (
              filteredTemples.map((temple) => (
                <div 
                  key={temple.id}
                  className="flex items-center p-3 mb-3 border-b border-gray-100"
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                    <img 
                      src={temple.imageUrl} 
                      alt={temple.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{temple.name}</div>
                    <div className="text-sm text-gray-500">{temple.location}</div>
                  </div>
                  <button
                    className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded-full"
                    onClick={() => handleUnfollow(temple.id, 'temple')}
                  >
                    언팔로우
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                팔로우한 사찰이 없습니다.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="templeStays" className="mt-2">
            {loading ? (
              <div className="text-center py-8">로딩 중...</div>
            ) : filteredTempleStays.length > 0 ? (
              filteredTempleStays.map((templeStay) => (
                <div 
                  key={templeStay.id}
                  className="flex items-center p-3 mb-3 border-b border-gray-100"
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                    <img 
                      src={templeStay.imageUrl} 
                      alt={templeStay.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{templeStay.name}</div>
                    <div className="text-sm text-gray-500">{templeStay.location}</div>
                  </div>
                  <button
                    className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded-full"
                    onClick={() => handleUnfollow(templeStay.id, 'temple_stay')}
                  >
                    언팔로우
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                팔로우한 템플스테이가 없습니다.
              </div>
            )}
          </TabsContent>
        </Tabs>

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
            <span className="text-gray-500 text-sm">앱 버전 v1.2.3</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}