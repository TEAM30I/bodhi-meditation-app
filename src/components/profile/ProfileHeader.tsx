
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  profileImage: string;
}

export default function ProfileHeader({ username, profileImage }: ProfileHeaderProps) {
  return (
    <div className="flex items-center px-5 py-4">
      <Avatar className="w-[50px] h-[50px]">
        <AvatarImage src={profileImage} alt={username} />
        <AvatarFallback className="bg-[#e49b51]" />
      </Avatar>
      <div className="flex-1 ml-3 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-bold text-lg">{username}</span>
          <span className="text-sm text-gray-500">내 정보 관리 {'>'}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}
