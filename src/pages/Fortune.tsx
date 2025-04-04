
import React from 'react';
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const Fortune = () => {
  return (
    <PageLayout title="오늘의 운세">
      <div className="flex flex-col items-center justify-center w-full h-[70vh]">
        <div className="bg-gray-100 rounded-lg p-8 text-center max-w-md w-full">
          <div className="mb-6">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e6dc8e0c8b25a242255fb31e792ed2cd0ab85019" 
              alt="Service preparation" 
              className="w-32 h-32 mx-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">서비스 준비 중</h2>
          <p className="text-gray-600 mb-6">
            더 나은 서비스를 위해 준비 중입니다.<br />
            곧 만나뵙겠습니다.
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-bodhi-orange hover:bg-bodhi-orange/90"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Fortune;
