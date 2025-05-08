import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pencil, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ProfileManage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: "로딩 중...",
    id: "",
    phone: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [isEditNameDialogOpen, setIsEditNameDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // user_settings 테이블에서 사용자 정보 가져오기
      const { data, error } = await supabase
        .from('user_settings')
        .select('nickname, id, phone_number')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Supabase Auth에서 이메일 가져오기
      const { data: { user: userData } } = await supabase.auth.getUser();
      
      setProfileData({
        name: data.nickname || '사용자',
        id: data.id || (userData.email ? maskEmail(userData.email) : '로그인 ID'),
        phone: data.phone_number ? maskPhoneNumber(data.phone_number) : '휴대폰 정보 없음'
      });
      
      setNewName(data.nickname || '');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "프로필 정보 로드 실패",
        description: "정보를 불러오는 데 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 4) {
      return username.substring(0, 1) + '****@' + domain;
    }
    return username.substring(0, 4) + '****@' + domain;
  };

  const maskPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
  };

  const handleUpdateName = async () => {
    try {
      if (!newName.trim()) {
        toast({
          title: "입력 오류",
          description: "이름은 비워둘 수 없습니다.",
          variant: "destructive",
        });
        return;
      }
      
      // user_settings 테이블 업데이트
      const { error } = await supabase
        .from('user_settings')
        .update({ nickname: newName })
        .eq('user_id', user.id);

      if (error) throw error;

      // 메타데이터 업데이트 (auth.users 테이블)
      const { data: userData, error: userError } = await supabase.auth.updateUser({
        data: { username: newName }
      });

      if (userError) throw userError;

      setProfileData({ ...profileData, name: newName });
      setIsEditNameDialogOpen(false);
      
      toast({
        title: "이름 변경 성공",
        description: "프로필 이름이 변경되었습니다.",
      });
    } catch (error) {
      console.error('Error updating name:', error);
      toast({
        title: "이름 변경 실패",
        description: "이름을 변경하는 데 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // 회원 탈퇴 로직
      // 1. 유저 관련 데이터 삭제
      // 2. 계정 삭제
      
      // 사찰 팔로우 정보 삭제
      await supabase
        .from('user_follow_temples')
        .delete()
        .eq('user_id', user.id);
      
      // 템플스테이 팔로우 정보 삭제
      await supabase
        .from('user_follow_temple_stays')
        .delete()
        .eq('user_id', user.id);
      
      // user_settings 테이블 데이터 삭제
      await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', user.id);
      
      // Supabase Auth 계정 삭제 (admin API 필요)
      // 실제 계정 삭제는 대개 서버 측에서 처리해야 함
      // 여기서는 로그아웃 처리만 진행
      
      await supabase.auth.signOut();
      
      toast({
        title: "계정 탈퇴 완료",
        description: "계정이 삭제되었습니다.",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "계정 탈퇴 실패",
        description: "계정을 삭제하는 데 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <button className="p-2" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">내 정보 관리</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Profile Section - 이미지 관련 코드 제거 */}
          <div className="px-6 py-8 flex flex-col items-center border-b border-gray-100">
            <div className="mt-4 flex items-center">
              <span className="text-xl font-bold">{profileData.name}</span>
              <button 
                onClick={() => setIsEditNameDialogOpen(true)} 
                className="ml-2 text-gray-500"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="px-6 py-6">
            <h2 className="font-bold mb-4">개인정보</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">아이디</span>
                <span>{profileData.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">휴대폰번호</span>
                <span>{profileData.phone}</span>
              </div>
            </div>
          </div>

          {/* Membership Section */}
          <div className="px-6 mt-4">
            <div 
              className="flex justify-between items-center py-3 cursor-pointer"
              onClick={() => setIsDeleteAccountDialogOpen(true)}
            >
              <span className="text-gray-700">회원탈퇴</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </>
      )}

      {/* Edit Name Dialog */}
      <Dialog open={isEditNameDialogOpen} onOpenChange={setIsEditNameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>이름 변경</DialogTitle>
            <DialogDescription>
              새로운 이름을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
                maxLength={20}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditNameDialogOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleUpdateName}>변경</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteAccountDialogOpen} onOpenChange={setIsDeleteAccountDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500">
              <AlertCircle className="mr-2 h-5 w-5" />
              회원탈퇴
            </DialogTitle>
            <DialogDescription>
              정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteAccountDialogOpen(false)}
              className="sm:flex-1"
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              className="sm:flex-1"
            >
              탈퇴하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}