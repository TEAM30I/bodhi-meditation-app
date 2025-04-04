
import React from 'react';

interface IconMenuItem {
  icon: string;
  label: string;
  onClick?: () => void;
}

interface IconMenuProps {
  items: IconMenuItem[];
}

const IconMenu: React.FC<IconMenuProps> = ({ items }) => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="grid grid-cols-5 gap-4 md:gap-6 lg:gap-8 w-full max-w-2xl">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={item.onClick}
          >
            <div className="w-[52px] h-[52px] flex items-center justify-center mb-[6px]">
              <img 
                src={item.icon} 
                alt={item.label}
                className="w-[32px] h-[32px] object-contain"
              />
            </div>
            <div className="text-bodhi-textDark text-[12px] leading-[15px] tracking-[-0.3px] text-center">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconMenu;
