import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// In a real app, these would be stored in environment variables
const supabaseUrl = 'https://kvmxzlrtfghidtosetal.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);