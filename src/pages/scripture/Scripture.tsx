
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

import { typedData } from '@/utils/typeUtils';
import { scriptures, readingSchedule } from '../../../public/data/scriptureData/scriptureRepository';

import { ScriptureCalendar } from '@/components/scripture/ScriptureCalendar';
import BookmarkList from '@/components/scripture/BookmarkList';
import ShareOptions from '@/components/scripture/ShareOptions';
import SettingsPanel from '@/components/scripture/SettingsPanel';
import { ScriptureCalendarPrev } from '@/components/scripture/ScriptureCalendar_prev';

const Scripture: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] =
    useState<'reading' | 'calendar' | 'bookmark' | 'share' | 'settings'>('reading');

  /* 데이터 타입 보정 */
  const typedScriptures = typedData<typeof scriptures>(scriptures);
  // (현재 화면에서 readingSchedule 은 사용되지 않으므로 주석 처리해도 무방)
  // const typedReadingSchedule = typedData<typeof readingSchedule>(readingSchedule);

  /* 읽기 진행 상태 그룹화 */
  const startedScriptures    = Object.values(typedScriptures).filter((s) => s.hasStarted);
  const notStartedScriptures = Object.values(typedScriptures).filter((s) => !s.hasStarted);

  /* 캘린더 화면으로 이동 */
  const handleNavigateToCalendar = () => navigate('/scripture/calendar');

  /* 메인 페이지로 이동 */
  const handleNavigateToMain = () => navigate('/main');

  return (
    <div className="bg-[#F1F3F5] min-h-screen pb-20 font-['Pretendard']">
      {/* ───── 헤더 ───── */}
      <div className="sticky top-0 z-10 bg-white h-[56px] flex items-center justify-between border-b border-[#E5E5EC] px-5">
        <div className="flex items-center">
          <button onClick={handleNavigateToMain} className="mr-4">
            <Home size={24} />
          </button>
          <h1 className="text-lg font-bold">경전 읽기</h1>
        </div>
        <button onClick={() => navigate('/scripture/bookmarks')}>
          {/* 북마크 아이콘(SVG) */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z"
              stroke="#111111"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ───── 본문 ───── */}
      <div className="px-5 py-4">
        {activeTab === 'reading' ? (
          <>
            {/* ── 경전 캘린더 미리보기 ── */}
            <div
              className="mb-3 cursor-pointer"
              onClick={handleNavigateToCalendar}
            >
              <div className="flex items-center">
                <h2 className="text-lg font-bold">경전 캘린더</h2>
                <ChevronRight size={18} className="text-gray-400 ml-1" />
              </div>
              <div className="mb-6">
              <ScriptureCalendarPrev />
              </div>
            </div>

            {/* 실제 미리보기 컴포넌트 */}


            {/* ── 이어보기 섹션 ── */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">이어보기</h2>
              <div className="space-y-2">
                {startedScriptures.length ? (
                  startedScriptures.map((s) => {
                    const badgeColor =
                      s.id === 'heart-sutra'        ? '#EF4223' :
                      s.id === 'diamond-sutra'      ? '#21212F' :
                      s.id === 'lotus-sutra'        ? '#0080FF' :
                      s.id === 'sixpatriarch-sutra' ? '#4CAF50' :
                      s.id === 'avatamsaka-sutra'   ? '#FFB23F' : '#DE7834';

                    return (
                      <div
                        key={s.id}
                        className="bg-white p-5 rounded-3xl shadow-sm cursor-pointer"
                        onClick={() => navigate(`/scripture/${s.id}`)}
                      >
                        <div
                          className="inline-flex px-2 py-2 rounded-xl mb-3"
                          style={{ backgroundColor: badgeColor }}
                        >
                          <span className="text-xs font-medium text-white">
                            {s.title}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-gray-900 mb-3">
                          보리11님의 {s.title} 통독
                        </h3>

                        <div className="w-full h-1 bg-[#FBF3E9] rounded-full mb-1">
                          <div
                            className="h-1 rounded-full"
                            style={{
                              width: `${s.progress || 0}%`,
                              background: `linear-gradient(90deg, rgba(218,0,0,0.55) 0%, ${badgeColor} 44.19%)`,
                            }}
                          />
                        </div>
                        <div className="flex justify-end">
                          <span className="text-xs text-gray-500">
                            {s.progress}%
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
                    <p className="text-gray-500">아직 시작한 경전이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── 아직 펼치지 않은 이야기 ── */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4">아직 펼치지 않은 이야기</h2>
              <div className="space-y-2">
                {notStartedScriptures.length ? (
                  notStartedScriptures.map((s) => {
                    const badgeColor =
                      s.id === 'heart-sutra'        ? '#EF4223' :
                      s.id === 'diamond-sutra'      ? '#21212F' :
                      s.id === 'lotus-sutra'        ? '#0080FF' :
                      s.id === 'sixpatriarch-sutra' ? '#4CAF50' :
                      s.id === 'avatamsaka-sutra'   ? '#FFB23F' : '#DE7834';

                    return (
                      <div
                        key={s.id}
                        className="bg-white p-5 rounded-3xl shadow-sm cursor-pointer"
                        onClick={() => navigate(`/scripture/${s.id}`)}
                      >
                        <div
                          className="inline-flex px-2 py-2 rounded-xl mb-3"
                          style={{ backgroundColor: badgeColor }}
                        >
                          <span className="text-xs font-medium text-white">
                            {s.title}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-gray-900 mb-3">
                          보리11님의 {s.title} 통독
                        </h3>

                        <div className="w-full h-1 bg-[#FBF3E9] rounded-full mb-1" />
                        <div className="flex justify-end">
                          <span className="text-xs text-gray-500">0%</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white p-6 rounded-3xl shadow-sm text-center">
                    <p className="text-gray-500">모든 경전을 시작했습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {activeTab === 'calendar'  && <ScriptureCalendar />}
            {activeTab === 'bookmark'  && <BookmarkList />}
            {activeTab === 'share'     && <ShareOptions />}
            {activeTab === 'settings'  && <SettingsPanel />}
          </>
        )}
      </div>
    </div>
  );
};

export default Scripture;
