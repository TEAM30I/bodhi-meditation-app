
export interface SearchRanking {
  id: string;
  term: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

// 지역 검색 순위 가져오기
export async function getRegionSearchRankings(): Promise<SearchRanking[]> {
  // 데이터베이스에서 검색 순위를 가져오거나 API 호출하는 대신 
  // 임시로 고정된 데이터 반환
  return [
    { id: "r1", term: "서울", count: 1250, trend: "up" },
    { id: "r2", term: "경주", count: 950, trend: "up" },
    { id: "r3", term: "부산", count: 840, trend: "down" },
    { id: "r4", term: "속리산", count: 780, trend: "stable" },
    { id: "r5", term: "양산", count: 650, trend: "up" }
  ];
}

// 템플스테이 검색 순위 가져오기
export async function getTempleStaySearchRankings(): Promise<SearchRanking[]> {
  // 데이터베이스에서 검색 순위를 가져오거나 API 호출하는 대신 
  // 임시로 고정된 데이터 반환
  return [
    { id: "ts1", term: "명상", count: 980, trend: "up" },
    { id: "ts2", term: "휴식", count: 850, trend: "up" },
    { id: "ts3", term: "템플라이프", count: 720, trend: "down" },
    { id: "ts4", term: "사찰음식", count: 680, trend: "up" },
    { id: "ts5", term: "불교문화", count: 550, trend: "stable" }
  ];
}

// 검색어 추가
export async function addSearchTerm(term: string, category: 'region' | 'temple_stay'): Promise<boolean> {
  // 여기서는 실제로 저장하지 않고 로그만 출력
  console.log(`Added search term: ${term} in category: ${category}`);
  return true;
}
