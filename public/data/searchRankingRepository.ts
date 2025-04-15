
export interface SearchRanking {
  id: string;
  term: string;
  count: number;
  trend: 'up' | 'down' | 'new' | 'same';
}

export const regionSearchRankings: SearchRanking[] = [
  { id: "r1", term: "경주", count: 8452, trend: 'up' },
  { id: "r2", term: "서울", count: 7123, trend: 'same' },
  { id: "r3", term: "불국사", count: 5678, trend: 'up' },
  { id: "r4", term: "해인사", count: 4521, trend: 'down' },
  { id: "r5", term: "통도사", count: 3987, trend: 'up' },
  { id: "r6", term: "부산", count: 3654, trend: 'down' },
  { id: "r7", term: "양산", count: 2987, trend: 'new' },
  { id: "r8", term: "조계사", count: 2854, trend: 'up' },
  { id: "r9", term: "봉은사", count: 2753, trend: 'same' },
  { id: "r10", term: "속초", count: 2541, trend: 'down' }
];

export const templeStaySearchRankings: SearchRanking[] = [
  { id: "ts1", term: "서울", count: 9876, trend: 'same' },
  { id: "ts2", term: "경주", count: 8765, trend: 'up' },
  { id: "ts3", term: "명상", count: 7654, trend: 'up' },
  { id: "ts4", term: "참선", count: 6543, trend: 'down' },
  { id: "ts5", term: "불국사", count: 5432, trend: 'up' },
  { id: "ts6", term: "당일", count: 4321, trend: 'new' },
  { id: "ts7", term: "해인사", count: 3210, trend: 'down' },
  { id: "ts8", term: "통도사", count: 2987, trend: 'same' },
  { id: "ts9", term: "1박2일", count: 2876, trend: 'up' },
  { id: "ts10", term: "송광사", count: 2654, trend: 'new' }
];
