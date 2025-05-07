// @/lib/repository/ScriptureRepository.ts
import { supabase } from '@/lib/supabase';
import {
  Scripture,
  ScriptureChapter,
  Bookmark,
  ReadingProgress
} from '@/types';

// 1. 경전 메타 + 페이지 → Scripture 객체
export async function fetchScripture(slug: string): Promise<Scripture | null> {
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
      bg: '',
      text: '',
      progressBg: ''
    },
    chapters
  };
}

// 2. 진행도 upsert
export async function upsertReadingProgress(
  userId: string,
  scriptureId: string,
  progress: number,
  pageNumber: number
) {
  await supabase.from('reading_progress').upsert({
    id: crypto.randomUUID(),
    user_id: userId,
    scripture_id: slugToUuid(scriptureId),
    last_page: pageNumber,
    progress,
    last_read_at: new Date(),
    updated_at: new Date()
  }, { onConflict: 'user_id,scripture_id' });
}

// 3. 북마크 추가
export async function addBookmark(
  userId: string,
  scriptureId: string,
  pageNumber: number
): Promise<void> {
  await supabase.from('user_bookmarks').insert({
    id: crypto.randomUUID(),
    user_id: userId,
    scripture_id: slugToUuid(scriptureId),
    page_number: pageNumber,
    created_at: new Date()
  });
}

/* ------------------------------------------------------------------------------------------------ */

function slugToUuid(slug: string) {
  // FE에서 slug 그대로 쓰던 id를 uuid로 변환 (v5, namespace 고정)
  // 클라이언트에서도 동일 알고리즘 사용해야 충돌 없음
  const NS = '11111111-1111-1111-1111-111111111111';
  // @ts-ignore
  return window.uuidv5(slug, NS);          // 브라우저 빌드 시 uuid 라이브러리 import
}
