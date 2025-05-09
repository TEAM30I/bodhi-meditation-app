import React, { useState, useEffect } from "react";
import { ChevronRight, X } from "lucide-react";
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
  const [showInquiryPopup, setShowInquiryPopup] = useState(false);
  const [inquiryText, setInquiryText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{success: boolean; message: string} | null>(null);

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

  const openInquiryPopup = () => {
    setShowInquiryPopup(true);
    setInquiryText("");
    setSendResult(null);
  };

  const closeInquiryPopup = () => {
    setShowInquiryPopup(false);
    setInquiryText("");
    setSendResult(null);
  };

  const handleSendInquiry = async () => {
    if (!inquiryText.trim()) {
      setSendResult({
        success: false,
        message: "문의 내용을 입력해주세요."
      });
      return;
    }
    
    try {
      setSending(true);
      
      // inquiry 테이블에 데이터 저장
      // user_id도 함께 저장 (사용자 식별 및 RLS 정책을 위함)
      const { data, error } = await supabase
        .from('inquiry')
        .insert([
          { 
            inquiry: inquiryText,
            user_id: user.id // 현재 인증된 사용자 ID도 함께 저장
            // created_at 필드는 Supabase가 자동으로 처리
          }
        ]);
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      setSendResult({
        success: true,
        message: "문의가 성공적으로 저장되었습니다."
      });
      
      // 3초 후 팝업 닫기
      setTimeout(() => {
        closeInquiryPopup();
      }, 3000);
    } catch (error) {
      console.error('Error saving inquiry:', error);
      setSendResult({
        success: false,
        message: "문의 저장에 실패했습니다. 다시 시도해주세요."
      });
    } finally {
      setSending(false);
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
            onClick={openInquiryPopup}
          >
            <div className="text-gray-700">문의하기</div>
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

      {/* 문의하기 팝업 */}
      {showInquiryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">문의하기</h3>
              <button 
                onClick={closeInquiryPopup}
                className="text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              아래에 문의 내용을 작성해주세요. 입력하신 내용은 저장되어 관리자에게 전달됩니다.
            </p>
            
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none mb-4"
              placeholder="문의 내용을 입력해주세요..."
              value={inquiryText}
              onChange={(e) => setInquiryText(e.target.value)}
              disabled={sending}
            />
            
            {sendResult && (
              <div className={`p-3 mb-4 rounded-lg text-sm ${
                sendResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {sendResult.message}
              </div>
            )}
            
            <button
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium disabled:bg-gray-300"
              onClick={handleSendInquiry}
              disabled={sending}
            >
              {sending ? '전송 중...' : '전송하기'}
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}