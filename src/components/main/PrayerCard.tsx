
import React from 'react';
import { Quote } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const PrayerCard: React.FC = () => {
  return (
    <section className="mt-6">
      <Card className="bg-[#FDF4ED]">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Quote className="w-5 h-5 text-[#DE7834]" />
            <h2 className="text-lg font-bold">오늘의 기도</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-sm leading-relaxed">
            모든 생명에 자비로운 마음을 보내며, 평화로운 하루가 되기를 기원합니다.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default PrayerCard;
