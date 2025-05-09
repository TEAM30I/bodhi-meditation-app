interface TempleItemProps {
  name: string;
  location: string;
  imageUrl: string;
  showButton?: boolean;
  likeCount?: number;
  isLiked?: boolean;
  onLikeToggle?: () => void;
}

export default function TempleItem({ 
  name, 
  location, 
  imageUrl, 
  showButton = false,
  likeCount = 0,
  isLiked = false,
  onLikeToggle
}: TempleItemProps) {
  // 좋아요 버튼 클릭 핸들러 추가
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 요소의 onClick 이벤트 전파 방지
    if (onLikeToggle) {
      onLikeToggle();
    }
  };
  
  return (
    <div className="flex items-center p-4 border-b border-gray-100">
      <img src={imageUrl} alt={name} className="w-[60px] h-[60px] rounded-lg object-cover" />
      <div className="flex-1 ml-3">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-500">{location}</p>
        
        {/* 좋아요 표시 */}
        {likeCount > 0 && (
          <div className="flex items-center mt-1">
            <button 
              onClick={handleLikeClick}
              className="flex items-center text-sm text-gray-500"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={isLiked ? "#ff7730" : "none"}
                stroke={isLiked ? "#ff7730" : "currentColor"}
                className="w-4 h-4 mr-1"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likeCount}
            </button>
          </div>
        )}
      </div>
      {showButton && (
        <button className="px-4 py-2 bg-[#ff7730] text-white rounded-lg text-sm">
          둘러보기
        </button>
      )}
    </div>
  );
}
