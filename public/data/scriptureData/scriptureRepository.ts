
// Interface for Scripture data model
export interface Scripture {
  id: string;
  title: string;
  content: string;
  categories: string[];
  chapters?: { title: string; content: string }[];
}

// Interface for user's reading progress
export interface ReadingProgress {
  userId: string;
  scriptureId: string;
  lastReadPosition: number;
  completedChapters: string[];
  lastReadTimestamp: Date;
}

// Interface for user's bookmarks
export interface Bookmark {
  id: string;
  userId: string;
  scriptureId: string;
  position: number;
  title: string;
  note?: string;
  createdAt: Date;
}

// Scripture categories for filtering
export const scriptureCategories = [
  { id: 'original', label: '원문' },
  { id: 'translation', label: '번역문' },
  { id: 'annotation', label: '주석' },
  { id: 'interpretation', label: '해설' }
];

// Sample reading schedule data
export const readingSchedule = [
  {
    id: 1,
    category: '금강경',
    title: '금강경 1일차',
    chapter: '제1 분, 법회인유분',
    color: 'bg-black',
    textColor: 'text-white'
  },
  {
    id: 2,
    category: '반야심경',
    title: '반야심경 1일차',
    chapter: '시작',
    color: 'bg-red-500',
    textColor: 'text-white'
  },
  {
    id: 3,
    category: '법화경',
    title: '법화경 1일차',
    chapter: '제1품 서품',
    color: 'bg-blue-500',
    textColor: 'text-white'
  }
];

// Sample scripture data
export const scriptures: Scripture[] = [
  {
    id: 'diamond-sutra',
    title: '금강경',
    categories: ['금강경', '대승경전'],
    content: '如是我聞：一時佛在舍衛國祇樹給孤獨園，與大比丘衆千二百五十人俱。爾時，世尊食時，著衣持缽，入舍衛大城乞食。於其城中，次第乞已，還至本處。飯食訖，收衣缽，洗足已，敷座而坐。...'
  },
  {
    id: 'heart-sutra',
    title: '반야심경',
    categories: ['반야심', '대승경전'],
    content: '관자재보살이 깊은 반야바라밀다를 행할 때 오온이 공함을 비추어 보고 일체의 고통에서 건지느니라...'
  },
  {
    id: 'lotus-sutra',
    title: '법화경',
    categories: ['법화경', '대승경전'],
    content: '如是我聞：一時佛住王舍城耆闍崛山中，與大比丘衆萬二千人俱，皆是阿羅漢，諸漏已盡，無復煩惱，逮得己利，盡諸有結，心得自在。...'
  }
];

// Sample user bookmarks
export const bookmarks: Bookmark[] = [
  {
    id: 'bm1',
    userId: 'user1',
    scriptureId: 'diamond-sutra',
    position: 120,
    title: '깨달음의 구절',
    note: '중요한 구절, 다시 읽기',
    createdAt: new Date('2025-03-20')
  },
  {
    id: 'bm2',
    userId: 'user1',
    scriptureId: 'heart-sutra',
    position: 50,
    title: '심경의 핵심',
    createdAt: new Date('2025-03-22')
  }
];
