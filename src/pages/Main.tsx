
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

import PrayerCard from '@/components/main/PrayerCard';
import MainBanner from '@/components/main/MainBanner';
import TempleCard from '@/components/main/TempleCard';
import TempleStayCard from '@/components/main/TempleStayCard';
import { Button } from '@/components/ui/button';

import {
  regionTags,
  readingSchedule,
  getNearbyTemples,
  getTempleStayList
} from '@/repositories';
import { useQuery } from '@tanstack/react-query';

const Main: React.FC = () => {
  const navigate = useNavigate();

  const { data: nearbyTemples = [] } = useQuery({
    queryKey: ['nearbyTemples'],
    queryFn: () => getNearbyTemples(37.5665, 126.9780) // Seoul coordinates
  });

  const { data: templeStays = [] } = useQuery({
    queryKey: ['templeStays'],
    queryFn: getTempleStayList
  });

  return (
    <div className="pb-24">
      {/* 메인 배너 */}
      <MainBanner />

      {/* 지역 태그 */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">가까운 지역의 사찰</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {regionTags.map((tag) => (
            <Button
              key={tag.id}
              variant={tag.active ? 'default' : 'outline'}
              size="sm"
              className={tag.active ? 'bg-[#DE7834]' : 'bg-white'}
              onClick={() => navigate(`/search?region=${tag.name}`)}
            >
              {tag.name}
            </Button>
          ))}
        </div>
      </section>

      {/* 기도 카드 */}
      <PrayerCard />

      {/* 경전 읽기 일정 */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">경전 읽기 일정</h2>
          <button 
            onClick={() => navigate('/scripture')}
            className="text-sm text-[#DE7834]"
          >
            더보기
          </button>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          {readingSchedule.length > 0 ? (
            readingSchedule.map((schedule) => (
              <div 
                key={schedule.id}
                className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <h3 className="font-medium">{schedule.title}</h3>
                  <p className="text-sm text-gray-500">{schedule.chapter}</p>
                </div>
                <div className="bg-gray-100 h-2 w-24 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#DE7834] h-full rounded-full"
                    style={{ width: `${schedule.progress}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center">
              <p className="text-gray-500">읽기 일정이 없습니다</p>
              <button 
                onClick={() => navigate('/scripture')}
                className="mt-2 text-sm text-[#DE7834] font-medium"
              >
                경전 읽기 시작하기
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 주변 추천 사찰 */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">가까운 추천 사찰</h2>
          <button
            onClick={() => navigate('/search')}
            className="text-sm text-[#DE7834]"
          >
            더보기
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {nearbyTemples.map((temple) => (
            <TempleCard
              key={temple.id}
              temple={temple}
              onClick={() => navigate(`/temple/${temple.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 템플스테이 추천 */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">추천 템플스테이</h2>
          <button
            onClick={() => navigate('/search/temple-stay')}
            className="text-sm text-[#DE7834]"
          >
            더보기
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {templeStays.slice(0, 4).map((templeStay) => (
            <TempleStayCard
              key={templeStay.id}
              templeStay={{
                id: templeStay.id,
                templeName: templeStay.templeName,
                location: templeStay.location,
                imageUrl: templeStay.imageUrl,
                price: templeStay.price,
                likeCount: templeStay.likeCount,
              }}
              onClick={() => navigate(`/search/temple-stay/detail/${templeStay.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 캘린더 */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">이번 달의 행사</h2>
          <button className="text-sm text-[#DE7834]">더보기</button>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <Calendar className="h-6 w-6 text-gray-500" />
        </div>
      </section>
    </div>
  );
};

export default Main;
