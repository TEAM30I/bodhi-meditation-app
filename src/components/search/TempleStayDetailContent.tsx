
import React, { useState } from 'react';
import { Heart, Share } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TempleStay } from '@/utils/repository';
import { toast } from 'sonner';

interface TempleStayDetailContentProps {
  templeStay: TempleStay;
  onGoToReservation: () => void;
}

const TempleStayDetailContent: React.FC<TempleStayDetailContentProps> = ({ 
  templeStay,
  onGoToReservation
}) => {
  const [isWishlist, setIsWishlist] = useState(false); // 찜 상태 관리

  const handleToggleWishlist = () => {
    setIsWishlist(!isWishlist);
    
    // 토스트 메시지 표시
    if (!isWishlist) {
      toast.success("찜 목록에 추가되었습니다", {
        duration: 2000,
      });
    } else {
      toast.success("찜 목록에서 삭제되었습니다", {
        duration: 2000,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 상세 정보 */}
      <div>
        <h2 className="text-xl font-bold mb-4">프로그램 일정</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-100 rounded-full py-1 px-3 text-center text-xs">
            10:00
          </div>
          <div className="bg-gray-100 rounded-full py-1 px-3 text-center text-xs">
            13:30-15:40
          </div>
          <div className="bg-gray-100 rounded-full py-1 px-3 text-center text-xs">
            17:50-19:00
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-2">
          <div className="bg-gray-200 h-6 rounded"></div>
          <div className="bg-gray-200 h-6 rounded"></div>
          <div className="bg-gray-200 h-6 rounded"></div>
        </div>
      </div>

      {/* 프로그램 소개 */}
      <div>
        <h2 className="text-xl font-bold mb-2">프로그램 소개</h2>
        <p className="text-gray-700">
          {templeStay.description || '이 템플스테이는 자연 속에서 휴식과 명상을 즐길 수 있는 프로그램입니다.'}
        </p>
      </div>

      {/* 이용 요금 */}
      <div>
        <h2 className="text-xl font-bold mb-2">이용요금</h2>
        <p className="text-gray-700">
          성인 1인: {templeStay.price.toLocaleString()}원
        </p>
      </div>

      {/* 유의사항 */}
      <div>
        <h2 className="text-xl font-bold mb-2">유의사항</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>프로그램 시작 10분 전에 도착해주세요.</li>
          <li>편안한 복장으로 참여해주세요.</li>
          <li>귀중품은 별도로 보관해주세요.</li>
        </ul>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex items-center justify-between">
        <Button
          onClick={handleToggleWishlist}
          className="w-12 h-12 rounded-full bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
          variant="outline"
        >
          <Heart className={`w-6 h-6 ${isWishlist ? 'fill-[#DE7834] stroke-[#DE7834]' : 'stroke-gray-600'}`} />
        </Button>
        <Button
          onClick={onGoToReservation}
          className="flex-1 ml-3 bg-[#1A1A1A] hover:bg-[#333333] text-white py-3 rounded-lg"
        >
          예약하러 가기
        </Button>
      </div>
    </div>
  );
};

export default TempleStayDetailContent;
