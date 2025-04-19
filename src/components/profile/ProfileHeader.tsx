
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  username: string;
  profileImage: string;
}

export default function ProfileHeader({ username, profileImage }: ProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center px-5 py-4">
      <Avatar className="w-[50px] h-[50px]">
        <AvatarImage src={profileImage} alt={username} />
        <AvatarFallback className="bg-[#e49b51]" />
      </Avatar>
      <div className="flex-1 ml-3 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-bold text-lg">{username}</span>
          <button 
            onClick={() => navigate('/profile/manage')} 
            className="text-sm text-gray-500 flex items-center"
          >
            내 정보 관리 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}
