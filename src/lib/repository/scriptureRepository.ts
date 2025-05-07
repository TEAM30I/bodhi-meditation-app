// @/lib/repository/ScriptureRepository.ts
import { supabase } from '@/lib/supabase';
import {
  Scripture,
  ScriptureChapter,
  Bookmark,
  ReadingProgress,
  ReadingScheduleItem
} from '@/types';

// 1. 경전 메타 + 페이지 → Scripture 객체
export async function fetchScripture(slug: string): Promise<Scripture | null> {
  try {
    // 메타
    const { data: meta, error: mErr } = await supabase
      .from('scriptures')
      .select('*')
      .eq('id', slugToUuid(slug))
      .single();

    if (mErr || !meta) return null;

    // 페이지
    const { data: pages, error: pErr } = await supabase
      .from('scripture_pages')
      .select('page_number, content')
      .eq('scripture_id', meta.id)
      .order('page_number');

    if (pErr) throw pErr;

    const chapters: ScriptureChapter[] = pages.map((p) => ({
      id: `p${p.page_number}`,
      title: `p${p.page_number}`,
      original: p.content,
      explanation: '' // 설명이 있으면 따로 저장
    }));

    return {
      id: slug,
      title: meta.title,
      categories: ['불경'],
      colorScheme: {
        bg: '#FFF3E0',
        text: '#5D4037',
        progressBg: '#FFCC80'
      },
      chapters
    };
  } catch (error) {
    console.error('Error fetching scripture:', error);
    return null;
  }
}

// 2. 진행도 upsert
export async function updateReadingProgress(
  userId: string,
  scriptureId: string,
  progress: number,
  pageNumber: number,
  chapterId: string = ''
): Promise<void> {
  try {
    await supabase.from('reading_progress').upsert({
      id: crypto.randomUUID(),
      user_id: userId,
      scripture_id: slugToUuid(scriptureId),
      last_page: pageNumber,
      last_chapter_id: chapterId,
      progress,
      last_read_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,scripture_id' });
  } catch (error) {
    console.error('Error updating reading progress:', error);
  }
}

// 3. 북마크 추가
export async function addBookmark(
  userId: string,
  scriptureId: string,
  pageNumber: number,
  chapterId: string = '',
  title: string = ''
): Promise<Bookmark | null> {
  try {
    const { data, error } = await supabase.from('user_bookmarks').insert({
      id: crypto.randomUUID(),
      user_id: userId,
      scripture_id: slugToUuid(scriptureId),
      page_number: pageNumber,
      created_at: new Date().toISOString()
    }).select().single();

    if (error) throw error;

    return {
      id: data.id,
      scriptureId: data.scripture_id,
      chapterId: chapterId || `p${pageNumber}`,
      pageIndex: data.page_number,
      title: title || `페이지 ${pageNumber}`,
      date: data.created_at
    };
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return null;
  }
}

// 4. 경전 목록 가져오기
export async function getScriptureList(): Promise<Scripture[]> {
  try {
    const { data, error } = await supabase
      .from('scriptures')
      .select('*');
    
    if (error) throw error;
    
    return data.map(item => ({
      id: uuidToSlug(item.id),
      title: item.title,
      categories: ['불경'],
      colorScheme: {
        bg: '#FFF3E0',
        text: '#5D4037',
        progressBg: '#FFCC80'
      },
      chapters: [],
      progress: 0
    }));
  } catch (error) {
    console.error('Error fetching scripture list:', error);
    return [];
  }
}

// 5. 달력 데이터 가져오기 - 매개변수 수정
export async function getCalendarData(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('scripture_id, last_read_at, progress')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data.map(item => ({
      date: new Date(item.last_read_at),
      scriptureId: uuidToSlug(item.scripture_id),
      progress: item.progress,
      completed: item.progress >= 100
    }));
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return [];
  }
}

// 6. 읽기 일정 가져오기
export async function getReadingSchedule(userId: string): Promise<ReadingScheduleItem[]> {
  try {
    const { data: scriptures, error: scriptureError } = await supabase
      .from('scriptures')
      .select('*');
    
    if (scriptureError) throw scriptureError;
    
    const { data: progress, error: progressError } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (progressError) throw progressError;
    
    return scriptures.map((scripture, index) => {
      const userProgress = progress?.find(p => p.scripture_id === scripture.id);
      return {
        id: index + 1,
        scriptureId: uuidToSlug(scripture.id),
        chapter: userProgress?.last_chapter_id || '',
        title: scripture.title,
        progress: userProgress?.progress || 0
      };
    });
  } catch (error) {
    console.error('Error fetching reading schedule:', error);
    return [];
  }
}

// 북마크 가져오기 함수 추가
export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  try {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      scriptureId: uuidToSlug(item.scripture_id),
      chapterId: `p${item.page_number}`,
      pageIndex: item.page_number,
      title: `페이지 ${item.page_number}`,
      date: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
}

/* ------------------------------------------------------------------------------------------------ */

function slugToUuid(slug: string) {
  // FE에서 slug 그대로 쓰던 id를 uuid로 변환 (v5, namespace 고정)
  // 클라이언트에서도 동일 알고리즘 사용해야 충돌 없음
  const NS = '11111111-1111-1111-1111-111111111111';
  try {
    // @ts-ignore
    return window.uuidv5(slug, NS); // 브라우저 빌드 시 uuid 라이브러리 import
  } catch (error) {
    console.error('Error converting slug to UUID:', error);
    return slug; // 변환 실패 시 원래 slug 반환
  }
}

function uuidToSlug(uuid: string) {
  // 간단한 구현: UUID를 그대로 slug로 사용
  // 실제로는 역변환 로직이 필요할 수 있음
  return uuid;
}
