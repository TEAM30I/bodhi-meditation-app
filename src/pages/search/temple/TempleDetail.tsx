
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import HeaderSection from '@/components/temple/HeaderSection';
import TempleImageSection from '@/components/temple/TempleImageSection';
import TempleInfoSection from '@/components/temple/TempleInfoSection';

interface Temple {
  id: string;
  name: string;
  address: string;
  contact: string;
  description: string;
  image_url: string;
  region: string;
}

const TempleDetail = () => {
  const { id } = useParams();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchTemple = async () => {
      const { data, error } = await supabase
        .from('temples')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching temple:', error);
        return;
      }

      setTemple(data);
    };

    fetchTemple();
  }, [id]);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast({
        title: "찜 목록에 추가되었습니다.",
        description: temple?.name + "이(가) 찜 목록에 추가되었습니다.",
      });
    } else {
      toast({
        title: "찜 목록에서 제거되었습니다.",
        description: temple?.name + "이(가) 찜 목록에서 제거되었습니다.",
      });
    }
  };

  if (!temple) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>사찰 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20">
      <HeaderSection />
      <TempleImageSection 
        temple={temple}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
      <TempleInfoSection temple={temple} />
    </div>
  );
};

export default TempleDetail;
