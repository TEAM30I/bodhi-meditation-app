
import React from 'react';

interface IconMenuItemProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

const IconMenuItem: React.FC<IconMenuItemProps> = ({ icon, label, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center gap-0 cursor-pointer"
      onClick={onClick}
    >
      <img src={icon} alt={label} className="w-auto h-[42px] object-contain" />
      <div className="text-[#333] text-[11px] font-bold leading-[15px] tracking-[-0.275px] mt-1">
        {label}
      </div>
    </div>
  );
};

interface IconMenuProps {
  items: {
    icon: string;
    label: string;
    onClick?: () => void;
  }[];
}

const IconMenu: React.FC<IconMenuProps> = ({ items }) => {
  return (
    <div className="flex justify-around items-start w-full">
      {items.map((item, index) => (
        <IconMenuItem
          key={index}
          icon={item.icon}
          label={item.label}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
};

export default IconMenu;
