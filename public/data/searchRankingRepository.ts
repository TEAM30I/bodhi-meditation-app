
// 검색 순위 데이터

export interface SearchRanking {
  id: string;
  term: string;
  count: number;
  trend: 'up' | 'down' | 'new' | 'same';
}

// 인기 검색어 - 지역별
export const regionSearchRankings: SearchRanking[] = [
  { id: "1", term: "서울 주변 사찰", count: 5420, trend: 'up' },
  { id: "2", term: "경주 불국사", count: 4350, trend: 'same' },
  { id: "3", term: "템플스테이 주말", count: 3870, trend: 'up' },
  { id: "4", term: "부산 범어사", count: 3510, trend: 'down' },
  { id: "5", term: "서울 조계사", count: 3120, trend: 'up' },
  { id: "6", term: "제주 사찰", count: 2980, trend: 'new' },
  { id: "7", term: "양산 통도사", count: 2780, trend: 'down' },
  { id: "8", term: "봉은사 템플스테이", count: 2340, trend: 'same' },
  { id: "9", term: "전주 한옥마을 사찰", count: 2110, trend: 'up' },
  { id: "10", term: "송광사", count: 1890, trend: 'down' }
];

// 템플스테이 인기 검색어
export const templeStaySearchRankings: SearchRanking[] = [
  { id: "1", term: "주말 템플스테이", count: 7250, trend: 'up' },
  { id: "2", term: "1박2일 템플스테이", count: 6180, trend: 'up' },
  { id: "3", term: "서울 근교 템플스테이", count: 5730, trend: 'same' },
  { id: "4", term: "명상 템플스테이", count: 4650, trend: 'up' },
  { id: "5", term: "가족 템플스테이", count: 4120, trend: 'down' },
  { id: "6", term: "당일 템플스테이", count: 3870, trend: 'up' },
  { id: "7", term: "산사 템플스테이", count: 3340, trend: 'new' },
  { id: "8", term: "힐링 템플스테이", count: 2980, trend: 'same' },
  { id: "9", term: "봄 템플스테이", count: 2650, trend: 'up' },
  { id: "10", term: "불교 체험", count: 2340, trend: 'down' }
];
