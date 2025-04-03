import React from 'react';

interface NewsItemProps {
  temple: string;
  source: string;
  title: string;
}

const NewsItem: React.FC<NewsItemProps> = ({ temple, source, title }) => {
  return (
    <div className="flex gap-4 sm:gap-6 items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
      <div className="text-[#222] text-[14px] sm:text-[16px] font-semibold leading-6 sm:leading-7 tracking-[-0.25px] w-[40px] sm:w-[50px] text-center">
        {temple}
      </div>
      <div className="text-[#555] text-[13px] sm:text-[15px] font-medium leading-6 sm:leading-7">
        {source} | <span className="font-semibold">"{title}"</span>
      </div>
    </div>
  );
};

export default NewsItem;