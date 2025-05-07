import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 값을 가져오거나 개발용 값 사용
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kvmxzlrtfghidtosetal.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bXh6bHJ0ZmdoaWR0b3NldGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MzMxMDcsImV4cCI6MjA2MDMwOTEwN30.V9Hj8yRia5ppbM6uW63zXWuUUKo9XtRYbbHmUmZPrhQ';

// 개발 환경에서만 로깅
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseKey);