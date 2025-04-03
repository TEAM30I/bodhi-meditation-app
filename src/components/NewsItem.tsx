
import React from 'react';

interface NewsItemProps {
  temple: string;
  source: string;
  title: string;
}

const NewsItem: React.FC<NewsItemProps> = ({ temple, source, title }) => {
  return (
    <div className="flex gap-[9px] items-center">
      <div className="text-[#222] text-[10px] font-semibold leading-[18px] tracking-[-0.25px] w-[26px] text-center">
        {temple}
      </div>
      <div className="text-[#999] text-[9px] font-semibold leading-[18px]">
        {source} | "{title}"
      </div>
    </div>
  );
};

export default NewsItem;
