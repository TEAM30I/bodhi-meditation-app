
export interface SearchRanking {
  id: number;
  name: string;
  query: string;
}

export const regionSearchRankings: SearchRanking[] = [
  { id: 1, name: "경주", query: "경주" },
  { id: 2, name: "서울", query: "서울" },
  { id: 3, name: "대구", query: "대구" },
  { id: 4, name: "속초", query: "속초" },
  { id: 5, name: "제주", query: "제주" },
  { id: 6, name: "강릉", query: "강릉" },
  { id: 7, name: "잠실", query: "잠실" },
  { id: 8, name: "인천", query: "인천" },
  { id: 9, name: "경북 경주시", query: "경북 경주시" }
];
