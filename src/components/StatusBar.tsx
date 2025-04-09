
import React from 'react';

interface StatusBarProps {
  time?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ time = "9:41" }) => {
  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-5 py-2 z-50 opacity-0">
      <div className="text-white font-semibold">{time}</div>
      <div className="flex items-center space-x-1">
        <div className="w-4 h-3">
          <svg viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M3 0C1.34315 0 0 1.34315 0 3V21C0 22.6569 1.34315 24 3 24H31C32.6569 24 34 22.6569 34 21V3C34 1.34315 32.6569 0 31 0H3ZM3 2H31C31.5523 2 32 2.44772 32 3V21C32 21.5523 31.5523 22 31 22H3C2.44772 22 2 21.5523 2 21V3C2 2.44772 2.44772 2 3 2Z" fill="white"/>
          </svg>
        </div>
        <div className="text-white ml-1 mr-1">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1H3.5M16 1H11M11 1C11 1 10.5 3.5 8.5 3.5C6.5 3.5 6 1 6 1M11 1H6M1 5.5H5.5M16 5.5H11.5M1 10H7.5M16 10H12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="text-white">
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M8.5 0C10.1685 0 11.7961 0.49688 13.1562 1.42963C14.5163 2.36238 15.5435 3.69283 16.0839 5.24655C16.6244 6.80026 16.6526 8.49058 16.1644 10.0614C15.6763 11.6323 14.6941 12.9921 13.364 13.9612C12.0339 14.9302 10.4239 15.4728 8.75405 15.4982C7.08418 15.5236 5.45767 15.0306 4.09964 14.1012C2.7416 13.1718 1.71853 11.8402 1.17627 10.2842C0.634005 8.72823 0.599869 7.03897 1.06996 5.46548L2.99798 6.06707C2.65794 7.20346 2.68281 8.41965 3.07017 9.54121C3.45753 10.6628 4.19219 11.6358 5.16244 12.3344C6.13269 13.0331 7.29134 13.4224 8.48952 13.4505C9.6877 13.4786 10.8635 13.1441 11.8677 12.4931C12.8719 11.842 13.6515 10.9057 14.094 9.8057C14.5365 8.70567 14.6229 7.49399 14.3432 6.33942C14.0636 5.18485 13.4309 4.14054 12.5345 3.34342C11.6381 2.5463 10.5207 2.04121 9.33498 1.90179L9.66502 0L8.5 0Z" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
