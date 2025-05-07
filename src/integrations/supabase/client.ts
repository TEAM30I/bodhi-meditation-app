// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kvmxzlrtfghidtosetal.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bXh6bHJ0ZmdoaWR0b3NldGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MzMxMDcsImV4cCI6MjA2MDMwOTEwN30.V9Hj8yRia5ppbM6uW63zXWuUUKo9XtRYbbHmUmZPrhQ";

// 새로운 옵션 설정으로 Supabase 클라이언트 생성
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'supabase_auth_token', // 명시적인 스토리지 키 설정
    storage: {
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          return item;
        } catch (error) {
          console.error('Error getting item from localStorage', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error setting item to localStorage', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing item from localStorage', error);
        }
      }
    }
  }
});