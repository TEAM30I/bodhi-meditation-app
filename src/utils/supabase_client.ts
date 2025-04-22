
// supabase_client.ts - Supabase 클라이언트
import { createClient } from '@supabase/supabase-js';

// Using Vite's import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL || 'https://kvmxzlrtfghidtosetal.supabase.co';
const supabaseKey = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bXh6bHJ0ZmdoaWR0b3NldGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MzMxMDcsImV4cCI6MjA2MDMwOTEwN30.V9Hj8yRia5ppbM6uW63zXWuUUKo9XtRYbbHmUmZPrhQ';

// For debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key length:', supabaseKey ? supabaseKey.length : 0);

export const supabase = createClient(supabaseUrl, supabaseKey);
