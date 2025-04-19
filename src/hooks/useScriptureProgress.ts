
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface ScriptureProgress {
  scripture_id: string;
  progress: number;
  last_chapter_id: string;
  last_chapter_title: string;
  last_page: number;
}

export const useScriptureProgress = (scriptureId?: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ScriptureProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || !scriptureId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('reading_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('scripture_id', scriptureId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        setProgress(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
        toast({
          title: "진행률 로드 실패",
          description: "경전 읽기 진행률을 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [user, scriptureId]);

  const updateProgress = async (newProgress: Partial<ScriptureProgress>) => {
    if (!user || !scriptureId) return;

    try {
      const roundedProgress = newProgress.progress 
        ? Math.floor(newProgress.progress) 
        : undefined;

      const { error } = await supabase
        .from('reading_progress')
        .upsert({
          user_id: user.id,
          scripture_id: scriptureId,
          ...progress,
          ...newProgress,
          progress: roundedProgress,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // 진행 상태 업데이트 후 여정에 기록 추가
      if (newProgress.last_chapter_id && newProgress.last_chapter_title) {
        await supabase
          .from('scripture_journey')
          .insert({
            user_id: user.id,
            scripture_id: scriptureId,
            action_type: 'read',
            chapter_id: newProgress.last_chapter_id,
            chapter_title: newProgress.last_chapter_title,
            page_number: newProgress.last_page
          });
      }

      setProgress(prev => prev ? { ...prev, ...newProgress, progress: roundedProgress ?? prev.progress } : null);
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "진행률 저장 실패",
        description: "경전 읽기 진행률을 저장하는데 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  return { progress, isLoading, updateProgress };
};
