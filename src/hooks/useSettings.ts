
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface UserSettings {
  font_size: number;
  font_family: string;
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
        
        // Type conversion for theme
        const safeSettings: UserSettings = {
          font_size: data.font_size ?? 16,
          font_family: data.font_family ?? 'Pretendard',
          theme: data.theme === 'light' || data.theme === 'dark' 
            ? data.theme 
            : 'light' // default to light if invalid
        };

        setSettings(safeSettings);
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
      // Ensure theme is correctly typed
      const safeNewSettings = {
        ...newSettings,
        theme: newSettings.theme === 'light' || newSettings.theme === 'dark' 
          ? newSettings.theme 
          : undefined
      };

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          ...safeNewSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Safely update the state
      setSettings(prev => prev ? { 
        ...prev, 
        ...safeNewSettings 
      } : null);

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
