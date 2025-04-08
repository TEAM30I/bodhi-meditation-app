
import React from 'react';
import PageLayout from "@/components/PageLayout";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage(): JSX.Element {
  return (
    <PageLayout title="내 정보">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">내 정보</h1>
        {/* Profile content will go here */}
      </div>
      <BottomNav />
    </PageLayout>
  );
}
