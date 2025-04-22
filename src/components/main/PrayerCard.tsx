
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const PrayerCard: React.FC = () => {
  return (
    <section className="mt-8">
      <Card className="bg-white">
        <CardHeader>
          <h2 className="text-xl font-bold">오늘의 기도</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            마음의 평화를 찾는 여정에서 우리는 늘 새로운 깨달음을 얻습니다.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default PrayerCard;
