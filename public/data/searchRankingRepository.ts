
// Search ranking data

export interface SearchRanking {
  id: string;
  term: string;
  count: number;
  trend: 'up' | 'down' | 'new' | 'same';
}

export const regionSearchRankings: SearchRanking[] = [
  { id: "1", term: "경주 불국사", count: 10560, trend: 'up' },
  { id: "2", term: "합천 해인사", count: 9280, trend: 'down' },
  { id: "3", term: "양산 통도사", count: 7650, trend: 'same' },
  { id: "4", term: "순천 송광사", count: 6540, trend: 'up' },
  { id: "5", term: "서울 조계사", count: 5980, trend: 'new' },
  { id: "6", term: "봉은사", count: 5420, trend: 'down' },
  { id: "7", term: "법주사", count: 4860, trend: 'same' },
  { id: "8", term: "bulguksa", count: 4250, trend: 'up' }
];

export const templeStaySearchRankings: SearchRanking[] = [
  { id: "1", term: "불국사 체험", count: 4280, trend: 'up' },
  { id: "2", term: "해인사 템플스테이", count: 3950, trend: 'new' },
  { id: "3", term: "송광사 명상", count: 3210, trend: 'down' },
  { id: "4", term: "수도권 템플스테이", count: 2870, trend: 'up' },
  { id: "5", term: "산사체험", count: 2540, trend: 'same' },
  { id: "6", term: "주말 템플스테이", count: 2190, trend: 'down' },
  { id: "7", term: "당일 템플스테이", count: 1860, trend: 'up' },
  { id: "8", term: "명상 프로그램", count: 1520, trend: 'same' }
];
