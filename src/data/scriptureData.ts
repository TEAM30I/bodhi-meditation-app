
// Consolidated scripture data
import { 
  scriptures, 
  scriptureCategories, 
  readingSchedule, 
  bookmarks, 
  calendarData,
  scriptureColorSchemes
} from '../../public/data/scriptureData/scriptureRepository';

// Export basic scripture types and data
export type { 
  Scripture, 
  Bookmark, 
  ReadingProgress,
  ScriptureColorScheme
} from '../../public/data/scriptureData/scriptureRepository';

// Define scripture text content
export const scriptureTexts = {
  "금강경": {
    title: "금강경",
    color: scriptureColorSchemes['금강경'],
    content: `如是我聞：一時佛在舍衛國祇樹給孤獨園，與大比丘衆千二百五十人俱。爾時，世尊食時，著衣持缽，入舍衛大城乞食。於其城中，次第乞已，還至本處。飯食訖，收衣缽，洗足已，敷座而坐。
須菩提白佛言：「希有世尊，如來善護念諸菩薩，善付囑諸菩薩。世尊，善男子善女人，發阿耨多羅三藐三菩提心，應云何住？云何降伏其心？」
佛言：「善哉善哉，須菩提，如汝所說，如來善護念諸菩薩，善付囑諸菩薩，汝今諦聽，當為汝說。善男子善女人，發阿耨多羅三藐三菩提心，應如是住，如是降伏其心。」
「唯然，世尊，願樂欲聞。」`,
    chapters: [
      {
        id: "ch1",
        title: "1. 개경 (開經)",
        original: "사시아문, 일시불제서왕사성, 기사굴산중, 여대비구증만이천인구...",
        explanation: "부처님과 수행자들이 모인 곳에서 시작된 가르침..."
      },
      {
        id: "ch2",
        title: "2. 묘행무주분 (妙行無住分)",
        original: "시제수보리 재중작, 이종리석 이정업중 개협승기...",
        explanation: "수보리가 질문하고 부처님이 답하시는 금강경의 핵심..."
      },
      {
        id: "ch3",
        title: "3. 대승정종분 (大乘正宗分)",
        original: "불고수보리 여여일체보살마하살 응여시항복기심...",
        explanation: "대승불교의 핵심 가르침에 대한 설명..."
      }
    ]
  },
  "반야심경": {
    title: "반야심경",
    color: scriptureColorSchemes['반야심경'],
    content: `관자재보살이 깊은 반야바라밀다를 행할 때 오온이 공함을 비추어 보고 일체의 고통에서 건지느니라.
사리자여, 색은 공과 다르지 않고 공은 색과 다르지 않으니, 색이 곧 공이요 공이 곧 색이며, 수상행식도 또한 그러하니라.
사리자여, 모든 법은 공상이니 나지도 않고 멸하지도 않으며, 더럽지도 않고 깨끗하지도 않으며, 늘지도 않고 줄지도 않느니라.`,
    chapters: [
      {
        id: "ch1",
        title: "1. 개경 (開經)",
        original: "관자재보살이 깊은 반야바라밀다를 행할 때에 오온이 공함을 비추어 보고 온갖 괴로움에서 건지느니라.",
        explanation: "반야심경의 시작 부분으로, 관자재보살의 수행을 설명합니다."
      },
      {
        id: "ch2",
        title: "2. 색공분 (色空分)",
        original: "사리자여, 색(色)이 공(空)과 다르지 않고 공이 색과 다르지 않으니, 색이 곧 공이요 공이 곧 색이며, 수(受)·상(想)·행(行)·식(識)도 또한 그러하니라.",
        explanation: "불교의 핵심 개념인 색즉시공, 공즉시색에 대한 설명입니다."
      },
      {
        id: "ch3",
        title: "3. 진언분 (眞言分)",
        original: "그러므로 큰 신묘한 주문, 큰 밝은 주문, 가장 위없는 주문, 더없이 위없는 주문, 즉 반야바라밀다 주문은 이에 보이는 바와 같나니, 곧 가섭아 가섭아 바라가섭아 바라승가섭아 보리 사바하.",
        explanation: "반야심경의 마지막 부분으로, 진언(만트라)을 포함합니다."
      }
    ]
  },
  "법화경": {
    title: "법화경",
    color: scriptureColorSchemes['법화경'],
    content: "여시아문：일시불주왕사성기사굴산중，여대비구증만이천인구，개시아라한，제루이진...",
    chapters: [
      {
        id: "ch1",
        title: "1. 서품 (序品)",
        original: "여시아문：일시불주왕사성기사굴산중，여대비구증만이천인구，개시아라한，제루이진...",
        explanation: "법화경의 시작 부분으로, 부처님이 설법하는 장면을 묘사합니다."
      },
      {
        id: "ch2",
        title: "2. 방편품 (方便品)",
        original: "이시세존종삼매안녕이출정，고문수사리법왕자...",
        explanation: "불교의 방편에 대한 설명으로, 부처님의 지혜를 강조합니다."
      }
    ]
  }
};

// Export all scripture data
export {
  scriptures,
  scriptureCategories,
  readingSchedule,
  bookmarks,
  calendarData,
  scriptureColorSchemes
};

// Function to get scripture by ID
export const getScriptureById = (id: string): typeof scriptures[0] | undefined => {
  return scriptures.find(scripture => scripture.id === id);
};

// Function to get scripture text by title
export const getScriptureTextByTitle = (title: string) => {
  return scriptureTexts[title as keyof typeof scriptureTexts];
};
