
import React from 'react';
import PageLayout from '@/components/PageLayout';
import BottomNav from '@/components/BottomNav';

const Wishlist = () => {
  return (
    <PageLayout title="찜 목록">
      <div className="px-6 py-4">
        <p className="text-gray-500">찜한 항목이 없습니다.</p>
      </div>
      <BottomNav />
    </PageLayout>
  );
};

export default Wishlist;
