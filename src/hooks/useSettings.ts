
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface UserSettings {
  font_size: number;
  font_family: 'gothic' | 'serif';
  theme: 'light' | 'dark';
}

export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: "설정 로드 실패",
          description: "설정을 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          ...newSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      toast({
        title: "설정 저장 완료",
        description: "설정이 성공적으로 저장되었습니다."
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "설정 저장 실패",
        description: "설정을 저장하는데 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  return { settings, isLoading, updateSettings };
};
