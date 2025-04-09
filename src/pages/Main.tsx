
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import { typedData } from '@/utils/typeUtils';
import { templeBanner, logo } from '/public/data/image/imageRepository';

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen font-['Pretendard']">
      {/* Header */}
      <div className="w-full bg-white">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="text-[#DE7834] text-sm font-['Rubik_Mono_One'] leading-[140%] tracking-[-0.35px]">
              Bodhi
            </div>
            <div className="flex items-center bg-[rgba(229,233,237,0.87)] rounded-[32px] h-[31px] px-[10px]">
              <div className="flex items-center gap-[6px]">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.125 13.625L10.4062 10.9062M11.875 7.375C11.875 10.1364 9.63642 12.375 6.875 12.375C4.11358 12.375 1.875 10.1364 1.875 7.375C1.875 4.61358 4.11358 2.375 6.875 2.375C9.63642 2.375 11.875 4.61358 11.875 7.375Z" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="text-[#767676] font-['Pretendard'] text-[11px] leading-[140%] tracking-[-0.275px]">
                  검색어를 입력하세요
                </div>
              </div>
            </div>
          </div>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.9132 24.5C11.7358 25.2261 12.8165 25.6667 14 25.6667C15.1835 25.6667 16.2641 25.2261 17.0868 24.5M21 9.33334C21 7.47683 20.2625 5.69635 18.9497 4.3836C17.637 3.07084 15.8565 2.33334 14 2.33334C12.1435 2.33334 10.363 3.07084 9.05023 4.3836C7.73748 5.69635 6.99998 7.47683 6.99998 9.33334C6.99998 12.9386 6.09053 15.407 5.07459 17.0397C4.21763 18.4169 3.78915 19.1055 3.80486 19.2976C3.82226 19.5103 3.86732 19.5914 4.03872 19.7185C4.19352 19.8333 4.89134 19.8333 6.28698 19.8333H21.713C23.1086 19.8333 23.8064 19.8333 23.9612 19.7185C24.1326 19.5914 24.1777 19.5103 24.1951 19.2976C24.2108 19.1055 23.7823 18.4169 22.9254 17.0397C21.9094 15.407 21 12.9386 21 9.33334Z" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="20" cy="5" r="3" fill="#DA0000"/>
          </svg>
        </div>
      </div>

      {/* Calendar Widget */}
      <div className="w-full h-[110px] bg-white rounded-b-[32px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between px-[29px] py-5 overflow-x-auto">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center w-[43px] h-[69px] py-3 px-[11px_14px]">
              <div className="text-[#767676] font-['Pretendard'] text-xs leading-[140%] tracking-[-0.3px]">
                일
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-2">
                <g clipPath="url(#clip0_prayer)">
                  <path d="M11.075 2.90001C11.025 2.90001 10.95 2.90001 10.9 2.92501V1.60001C10.9 1.05001 10.45 0.600006 9.9 0.600006C9.475 0.600006 9.125 0.850006 8.975 1.20001C8.825 0.850006 8.475 0.600006 8.05 0.600006C7.5 0.600006 7.05 1.05001 7.05 1.60001V2.92501C7 2.92501 6.925 2.90001 6.875 2.90001C6.325 2.90001 5.875 3.35001 5.875 3.90001V11.825C5.875 12.375 6.325 12.825 6.875 12.825C7.15 12.825 7.425 12.7 7.6 12.525C7.725 12.6 7.9 12.65 8.05 12.65V12.7H10.575C10.725 12.775 10.875 12.825 11.075 12.825C11.625 12.825 12.075 12.375 12.075 11.825V3.90001C12.075 3.35001 11.65 2.90001 11.075 2.90001Z" fill="#EDC0A2"/>
                  <path d="M16.675 11.125C16.6 11 16.525 10.9 16.425 10.8C15.55 9.925 13.725 10.375 12.325 11.775C10.925 13.175 10.475 15.025 11.35 15.875C11.425 15.95 11.475 16 11.55 16.05L13.5 18H17.95L18 12.45L16.675 11.125Z" fill="#357BA8"/>
                  <path d="M15.275 10.625C15.225 10.525 15.15 10.425 15.05 10.35C13.35 8.84999 11.425 6.64999 11.425 5.87499V1.92499C11.425 1.37499 10.975 0.924988 10.425 0.924988C9.87499 0.924988 9.42499 1.37499 9.42499 1.92499V10.05C9.42499 13.175 11.25 14.975 11.325 15.05C11.475 15.175 11.675 15.275 11.875 15.325H12.075C12.525 15.325 13.45 15.15 14.575 14.025C15.875 12.75 15.625 11.3 15.275 10.625Z" fill="#FFD3B6"/>
                  <path d="M5.65001 11.775C4.25001 10.375 2.40001 9.925 1.55001 10.8C1.45001 10.9 1.37501 11 1.30001 11.125L-0.0249939 12.45L6.10389e-06 18H4.45001L6.40001 16.05C6.47501 16 6.55001 15.95 6.60001 15.875C7.50001 15 7.05001 13.175 5.65001 11.775Z" fill="#357BA8"/>
                  <path d="M7.55 0.924988C7 0.924988 6.55 1.37499 6.55 1.92499V5.87499C6.55 6.64999 4.65 8.84999 2.925 10.35C2.825 10.425 2.75 10.525 2.7 10.625C2.35 11.3 2.1 12.75 3.375 14.05C4.5 15.175 5.425 15.35 5.875 15.35H6.075C6.275 15.325 6.475 15.225 6.625 15.075C6.7 15 8.525 13.225 8.525 10.075V1.92499C8.55 1.37499 8.1 0.924988 7.55 0.924988Z" fill="#FFD3B6"/>
                  <path d="M13.625 3.45C13.65 3.45 13.65 3.45 13.675 3.425L15.45 2.425C15.475 2.4 15.5 2.375 15.5 2.35C15.5 2.325 15.5 2.3 15.475 2.275L14.7 1.5C14.675 1.5 14.65 1.475 14.6 1.5C14.575 1.5 14.55 1.525 14.525 1.55L13.525 3.325C13.5 3.375 13.5 3.4 13.55 3.45H13.625ZM2.625 2.45L4.4 3.45C4.425 3.45 4.425 3.475 4.45 3.475C4.525 3.475 4.55 3.425 4.55 3.375C4.55 3.35 4.55 3.325 4.525 3.3L3.55 1.55C3.525 1.5 3.5 1.5 3.475 1.5C3.45 1.5 3.425 1.5 3.4 1.525L2.625 2.3C2.6 2.325 2.6 2.35 2.6 2.375C2.6 2.4 2.6 2.425 2.625 2.45ZM15.525 4.675C15.5 4.65 15.475 4.65 15.45 4.65L13.5 5.2C13.45 5.2 13.425 5.25 13.425 5.3C13.425 5.35 13.45 5.375 13.5 5.4L15.45 5.95H15.475C15.5 5.95 15.525 5.95 15.525 5.925C15.55 5.9 15.575 5.875 15.575 5.85V4.75C15.55 4.725 15.55 4.675 15.525 4.675ZM4.6 5.2L2.65 4.65C2.625 4.65 2.6 4.65 2.575 4.675C2.525 4.675 2.5 4.725 2.5 4.75V5.825C2.5 5.85 2.525 5.875 2.55 5.9C2.575 5.925 2.6 5.925 2.6 5.925H2.625L4.575 5.375C4.625 5.375 4.65 5.325 4.65 5.275C4.65 5.225 4.625 5.2 4.6 5.2Z" fill="#00BEEA"/>
                </g>
                <defs>
                  <clipPath id="clip0_prayer">
                    <rect width="18" height="18" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Calendar days */}
            {/* ... Additional calendar days would go here */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 py-6">
        {/* Temple Map Section */}
        <div className="flex items-center gap-2 mb-4">
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_temple_map)">
              <path d="M16.219 2.44302C16.872 2.95502 17.322 3.78202 17.506 4.64802L17.571 4.67402L19.616 5.62002C19.7302 5.67261 19.8271 5.75674 19.8951 5.86251C19.9631 5.96827 19.9995 6.09127 20 6.21702V18.584C19.9993 18.6868 19.9747 18.7879 19.9284 18.8796C19.882 18.9712 19.815 19.0509 19.7326 19.1123C19.6503 19.1738 19.5548 19.2153 19.4537 19.2336C19.3526 19.2519 19.2487 19.2466 19.15 19.218L13.481 17.618L6.741 19.476C6.61942 19.5096 6.49082 19.5083 6.37 19.472L0.474 17.717C0.337721 17.677 0.21799 17.5941 0.132595 17.4806C0.047201 17.3671 0.00069966 17.2291 0 17.087L0 4.49802C0 4.05802 0.428 3.74202 0.855 3.86602L6.557 5.52702L9.455 4.64002C9.495 4.62802 9.53567 4.61969 9.577 4.61502C9.689 3.95902 10.002 3.32902 10.527 2.71502C11.15 1.98502 12.243 1.55702 13.308 1.50602C14.413 1.45302 15.257 1.68902 16.218 2.44202M1.333 5.38102V16.596L6.203 18.045V6.79802L1.333 5.38102ZM9.542 5.99502L7.536 6.60802V17.887L12.601 16.493V13.198C12.601 12.834 12.9 12.539 13.268 12.539C13.636 12.539 13.934 12.834 13.934 13.199V16.376L18.667 17.711V6.63602L17.547 6.11602C17.5283 6.22602 17.504 6.33369 17.474 6.43902C17.2574 7.2061 16.8925 7.92329 16.4 8.55002L13.923 11.643C13.8578 11.7243 13.7745 11.7893 13.6797 11.8328C13.585 11.8763 13.4814 11.8971 13.3772 11.8935C13.273 11.8899 13.1711 11.862 13.0796 11.8121C12.9881 11.7622 12.9095 11.6916 12.85 11.606L10.535 8.25302C10.1523 7.72036 9.88533 7.24169 9.734 6.81702C9.63885 6.55125 9.57443 6.27545 9.542 5.99502ZM13.372 2.82402C12.646 2.85902 11.9 3.15102 11.545 3.56602C11.118 4.06602 10.908 4.53402 10.866 5.00802C10.816 5.57902 10.85 5.98202 10.992 6.38102C11.097 6.67602 11.306 7.05002 11.629 7.50102L13.44 10.123L15.35 7.73802C15.7356 7.24574 16.0213 6.68287 16.191 6.08102C16.431 5.24102 16.069 4.00702 15.391 3.47702C14.696 2.93202 14.171 2.78502 13.373 2.82402M13.511 3.52102C14.615 3.52102 15.511 4.40602 15.511 5.49802C15.5076 6.02529 15.295 6.52963 14.92 6.90031C14.545 7.27098 14.0383 7.47768 13.511 7.47502C12.407 7.47502 11.511 6.59002 11.511 5.49802C11.511 4.40602 12.407 3.52102 13.511 3.52102ZM13.511 4.83902C13.4239 4.8385 13.3376 4.85512 13.257 4.88796C13.1763 4.92079 13.103 4.96919 13.041 5.03038C12.9791 5.09157 12.9298 5.16437 12.896 5.24461C12.8622 5.32485 12.8445 5.41096 12.844 5.49802C12.844 5.86202 13.143 6.15702 13.511 6.15702C13.5981 6.15742 13.6844 6.14066 13.7649 6.10771C13.8455 6.07475 13.9188 6.02625 13.9807 5.96496C14.0425 5.90367 14.0917 5.8308 14.1254 5.75052C14.1591 5.67023 14.1766 5.58409 14.177 5.49702C14.1757 5.32153 14.1048 5.15372 13.98 5.03038C13.8551 4.90704 13.6865 4.83823 13.511 4.83902Z" fill="#111111"/>
            </g>
            <defs>
              <clipPath id="clip0_temple_map">
                <rect width="20" height="20" fill="white" transform="translate(0 0.5)"/>
              </clipPath>
            </defs>
          </svg>
          <div className="text-lg font-semibold">사찰 지도</div>
        </div>
        <p className="text-sm text-[#767676] mb-4">지도로 사찰을 둘러보고, 관심 사찰로 저장해보세요</p>
        <div className="w-full h-[150px] bg-[#C9C9C9] rounded-2xl mb-8"></div>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          {/* Temple Section */}
          <div>
            <div className="flex items-center gap-[2px] mb-4">
              <div className="text-lg font-semibold">자연이 깃든 사찰, 찾아볼까요?</div>
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15.5L12.5 10.5L7.5 5.5" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-4">
              <div className="w-[100px] h-[100px] flex-shrink-0 bg-[#656565] rounded-xl"></div>
              <div className="w-[100px] h-[100px] flex-shrink-0 bg-[#656565] rounded-xl"></div>
              <div className="w-[100px] h-[100px] flex-shrink-0 bg-[#656565] rounded-xl"></div>
              <div className="w-[100px] h-[100px] flex-shrink-0 bg-[#656565] rounded-xl"></div>
            </div>
          </div>

          {/* Temple Stay Section */}
          <div>
            <div className="flex items-center gap-[2px] mb-4">
              <div className="text-lg font-semibold">쉼이 필요한 당신께, 템플스테이</div>
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15.5L12.5 10.5L7.5 5.5" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-4">
              <div className="w-[100px] h-[100px] flex-shrink-0 bg-[#656565] rounded-xl"></div>
              <div className="w-[100px] h-[100px] flex-shrink-0 bg-[#656565] rounded-xl"></div>
              <div className="w-[100px] h-[100px] flex-shrink-0 bg-[#656565] rounded-xl"></div>
              <div className="w-[100px] h-[100px] flex-shrink-0 bg-[#656565] rounded-xl"></div>
            </div>
          </div>

          {/* Scripture Section */}
          <div>
            <div className="flex items-center gap-[2px] mb-4">
              <div className="text-lg font-semibold">경전과 함께하는 하루</div>
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15.5L12.5 10.5L7.5 5.5" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col gap-3">
              {/* Scripture Card - Gold */}
              <div className="w-full bg-white rounded-[32px] p-5 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col gap-3">
                  <div className="inline-flex p-2 bg-[#21212F] rounded-xl text-white text-xs">금강경</div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-base font-semibold">"연기의 세계를 그린 거대한 불교 우주론"</div>
                    <div className="text-base text-[#767676]">제 4권 3절에서 이어보기</div>
                  </div>
                  <div className="flex items-center gap-[2px] text-xs text-[#767676]">
                    <span>시작하기</span>
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.85686 2.21422L8.14258 6.49993L3.85686 10.7856" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Scripture Card - Red */}
              <div className="w-full bg-white rounded-[32px] p-5 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col gap-3">
                  <div className="inline-flex p-2 bg-[#EF4223] rounded-xl text-white text-xs">반야심경</div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-base font-semibold">"모든 고통에서 벗어나는 지혜의 핵심"</div>
                    <div className="text-base text-[#767676]">제 1권 4절에서 이어보기</div>
                  </div>
                  <div className="flex items-center gap-[2px] text-xs text-[#767676]">
                    <span>시작하기</span>
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.85686 2.21422L8.14258 6.49993L3.85686 10.7856" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Scripture Card - Green */}
              <div className="w-full bg-white rounded-[32px] p-5 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col gap-3">
                  <div className="inline-flex p-2 bg-[#4CAF50] rounded-xl text-white text-xs">육조단경</div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-base font-semibold">"모든 고통에서 벗어나는 지혜의 핵심"</div>
                    <div className="text-base text-[#767676]">제 1권 4절에서 이어보기</div>
                  </div>
                  <div className="flex items-center gap-[2px] text-xs text-[#767676]">
                    <span>시작하기</span>
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.85686 2.21422L8.14258 6.49993L3.85686 10.7856" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <div className="flex justify-between bg-white">
          <div className="flex items-center justify-center w-[72px] h-16 rounded-[32px]">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 12.3259C3.5 11.6558 3.5 11.3208 3.58637 11.0122C3.66287 10.7389 3.78859 10.4819 3.95736 10.2537C4.14789 9.99606 4.41236 9.79037 4.94129 9.37898L12.854 3.22466C13.2639 2.90587 13.4688 2.74647 13.6951 2.6852C13.8948 2.63114 14.1052 2.63114 14.3049 2.6852C14.5312 2.74647 14.7361 2.90587 15.146 3.22467L23.0587 9.37898C23.5876 9.79037 23.8521 9.99606 24.0426 10.2537C24.2114 10.4819 24.3371 10.7389 24.4136 11.0122C24.5 11.3208 24.5 11.6558 24.5 12.3259V20.7666C24.5 22.0734 24.5 22.7268 24.2457 23.226C24.022 23.665 23.665 24.022 23.226 24.2457C22.7269 24.5 22.0735 24.5 20.7667 24.5H7.23333C5.92654 24.5 5.27315 24.5 4.77402 24.2457C4.33498 24.022 3.97802 23.665 3.75432 23.226C3.5 22.7268 3.5 22.0734 3.5 20.7666V12.3259Z" fill="#DE7834" fillOpacity="0.2"/>
              <path d="M10.5 24.5V15.8666C10.5 15.2133 10.5 14.8866 10.6272 14.637C10.739 14.4175 10.9175 14.239 11.137 14.1271C11.3866 14 11.7133 14 12.3667 14H15.6333C16.2867 14 16.6134 14 16.863 14.1271C17.0825 14.239 17.261 14.4175 17.3728 14.637C17.5 14.8866 17.5 15.2133 17.5 15.8666V24.5" fill="#DE7834" fillOpacity="0.2"/>
              <path d="M10.5 24.5V15.8666C10.5 15.2133 10.5 14.8866 10.6272 14.637C10.739 14.4175 10.9175 14.239 11.137 14.1271C11.3866 14 11.7133 14 12.3667 14H15.6333C16.2867 14 16.6134 14 16.863 14.1271C17.0825 14.239 17.261 14.4175 17.3728 14.637C17.5 14.8866 17.5 15.2133 17.5 15.8666V24.5M12.854 3.22467L4.94129 9.37898C4.41236 9.79037 4.14789 9.99606 3.95736 10.2537C3.78859 10.4819 3.66287 10.7389 3.58637 11.0122C3.5 11.3208 3.5 11.6558 3.5 12.3259V20.7666C3.5 22.0734 3.5 22.7268 3.75432 23.226C3.97802 23.665 4.33498 24.022 4.77402 24.2457C5.27315 24.5 5.92654 24.5 7.23333 24.5H20.7667C22.0735 24.5 22.7269 24.5 23.226 24.2457C23.665 24.022 24.022 23.665 24.2457 23.226C24.5 22.7268 24.5 22.0734 24.5 20.7666V12.3259C24.5 11.6558 24.5 11.3208 24.4136 11.0122C24.3371 10.7389 24.2114 10.4819 24.0426 10.2537C23.8521 9.99606 23.5876 9.79037 23.0587 9.37898L15.146 3.22467C14.7361 2.90587 14.5312 2.74647 14.3049 2.6852C14.1052 2.63114 13.8948 2.63114 13.6951 2.6852C13.4688 2.74647 13.2639 2.90587 12.854 3.22467Z" stroke="#DE7834" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex items-center justify-center w-[72px] h-16">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M14.112 6.02558L3.14161 4.22658C2.84088 4.177 2.53296 4.19348 2.23923 4.27487C1.94551 4.35626 1.67302 4.50061 1.4407 4.6979C1.20837 4.89519 1.02178 5.14069 0.89387 5.41735C0.765964 5.694 0.699814 5.99519 0.700013 6.29998V19.9332C0.699996 20.4339 0.878862 20.9181 1.20436 21.2985C1.52985 21.6789 1.98056 21.9305 2.47521 22.008L13.8922 23.793C13.992 23.8085 14.0941 23.8023 14.1913 23.7747C14.2884 23.7471 14.3785 23.6988 14.4553 23.6331C14.532 23.5674 14.5936 23.4858 14.6359 23.394C14.6781 23.3023 14.7 23.2024 14.7 23.1014V6.71578C14.6998 6.54968 14.6406 6.38905 14.5329 6.26261C14.4251 6.13617 14.276 6.05215 14.112 6.02558ZM2.91201 5.60838L13.3 7.31078V22.2824L2.69221 20.622C2.52748 20.5963 2.37732 20.5127 2.26876 20.3861C2.1602 20.2596 2.10036 20.0985 2.10001 19.9318V6.29998C2.09992 6.19853 2.12189 6.09827 2.16438 6.00615C2.20688 5.91402 2.26889 5.83224 2.34613 5.76646C2.42336 5.70067 2.51397 5.65247 2.61168 5.62517C2.70939 5.59788 2.81187 5.59215 2.91201 5.60838Z" fill="#111111"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M25.2 4.19995C25.086 4.20004 24.9722 4.2094 24.8598 4.22795L13.888 6.02415C13.7243 6.05103 13.5754 6.13517 13.468 6.26158C13.3606 6.38799 13.3015 6.54845 13.3014 6.71435V23.1C13.3014 23.201 13.3233 23.3008 13.3655 23.3926C13.4078 23.4844 13.4694 23.5659 13.5461 23.6316C13.6229 23.6973 13.713 23.7457 13.8101 23.7733C13.9073 23.8009 14.0094 23.8071 14.1092 23.7915L25.5262 22.0065C26.0208 21.9291 26.4715 21.6775 26.797 21.2971C27.1225 20.9166 27.3014 20.4324 27.3014 19.9318V6.29995C27.3014 6.02406 27.247 5.75087 27.1414 5.49599C27.0358 5.24112 26.881 5.00955 26.6858 4.81453C26.4907 4.61951 26.259 4.46486 26.0041 4.3594C25.7491 4.25395 25.4759 4.19977 25.2 4.19995ZM25.3078 20.622L14.7 22.2838V7.31075L25.088 5.60835C25.1881 5.59212 25.2906 5.59785 25.3883 5.62514C25.486 5.65244 25.5766 5.70065 25.6539 5.76643C25.7311 5.83221 25.7931 5.914 25.8356 6.00612C25.8781 6.09824 25.9001 6.1985 25.9 6.29995V19.9318C25.8996 20.0985 25.8398 20.2596 25.7312 20.3861C25.6227 20.5126 25.4725 20.5963 25.3078 20.622Z" fill="#111111"/>
            </svg>
          </div>
          <div className="flex items-center justify-center w-[72px] h-16">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24.5 24.5L19.425 19.425M22.1667 12.8333C22.1667 17.988 17.988 22.1667 12.8333 22.1667C7.67868 22.1667 3.5 17.988 3.5 12.8333C3.5 7.67868 7.67868 3.5 12.8333 3.5C17.988 3.5 22.1667 7.67868 22.1667 12.8333Z" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex items-center justify-center w-[72px] h-16">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.7963 3.5C22.9055 3.5 25.6666 7.41125 25.6666 11.06C25.6666 18.4494 14.2074 24.5 14 24.5C13.7926 24.5 2.33331 18.4494 2.33331 11.06C2.33331 7.41125 5.09442 3.5 9.20368 3.5C11.5629 3.5 13.1055 4.69437 14 5.74437C14.8944 4.69437 16.437 3.5 18.7963 3.5Z" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex items-center justify-center w-[72px] h-16 rounded-[32px]">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="14" cy="8.16699" rx="3.5" ry="3.5" stroke="#111111" strokeWidth="1.5"></ellipse>
              <path d="M4.66675 20.333C4.66675 18.1239 6.45761 16.333 8.66675 16.333H19.3334C21.5426 16.333 23.3334 18.1239 23.3334 20.333V21.333C23.3334 22.4376 22.438 23.333 21.3334 23.333H6.66675C5.56218 23.333 4.66675 22.4376 4.66675 21.333V20.333Z" stroke="#111111" strokeWidth="1.5" strokeLinejoin="round"></path>
            </svg>
          </div>
        </div>
        <div className="h-[34px] bg-white flex justify-center items-center">
          <div className="w-[134px] h-[5px] bg-[#111] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Main;
