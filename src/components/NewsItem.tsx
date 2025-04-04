
import React from 'react';

interface NewsItemProps {
  temple: string;
  source: string;
  title: string;
}

const NewsItem: React.FC<NewsItemProps> = ({ temple, source, title }) => {
  return (
    <div className="w-full mx-auto bg-white rounded-[10px] p-[15px] shadow-sm cursor-pointer hover:shadow-md transition-shadow">
      <div className="mb-[6px] flex items-center">
        <span className="font-semibold text-bodhi-darkOrange text-[15px] leading-[22px] tracking-[-0.38px]">
          {temple}
        </span>
        <span className="mx-[6px] text-bodhi-textLight">|</span>
        <span className="font-medium text-bodhi-textLight text-[12px] leading-[22px] tracking-[-0.3px]">
          {source}
        </span>
      </div>
      <div className="font-bold text-bodhi-textDark text-[14px] leading-[22px] tracking-[-0.35px]">
        {title}
      </div>
    </div>
  );
};

export default NewsItem;
