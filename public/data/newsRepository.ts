
export interface NewsItem {
  id: string;
  temple: string;
  source: string;
  title: string;
  link: string;
  date: string;
}

export const newsData: NewsItem[] = [
  {
    id: "news1",
    temple: "조계사",
    source: "불교신문",
    title: "부처님오신날 특별 법회 일정 안내",
    link: "/news/1",
    date: "2025-04-02"
  },
  {
    id: "news2",
    temple: "봉은사",
    source: "연합뉴스",
    title: "전통 사찰 문화 체험 행사 개최",
    link: "/news/2",
    date: "2025-04-01"
  },
  {
    id: "news3",
    temple: "미륵사",
    source: "유튜브",
    title: "천년 고찰의 비밀, 미륵사의 유래",
    link: "/news/3",
    date: "2025-03-31"
  },
  {
    id: "news4",
    temple: "송광사",
    source: "송광사 - 네이버 블로그",
    title: "힐링이 필요할 땐, 송광사 템플스테이 후기",
    link: "/news/4",
    date: "2025-03-30"
  },
  {
    id: "news5",
    temple: "통도사",
    source: "통도사 - 인스타그램",
    title: "오늘의 풍경, 봄꽃이 만개한 사찰의 모습",
    link: "/news/5",
    date: "2025-03-29"
  }
];
