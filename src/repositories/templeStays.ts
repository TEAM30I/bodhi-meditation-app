
import { supabase } from "@/integrations/supabase/client";
import { TempleStay } from "@/types/templeStay";

export const getTempleStayList = async (): Promise<TempleStay[]> => {
  try {
    const { data: templeStayData, error: templeStayError } = await supabase
      .from('temple_stays')
      .select('*');
      
    if (templeStayError) {
      console.error('Error fetching temple stays:', templeStayError);
      return [];
    }
    
    const result: TempleStay[] = [];
    
    for (const stay of templeStayData) {
      const { data: timelineData, error: timelineError } = await supabase
        .from('timelines')
        .select('*')
        .eq('temple_stay_id', stay.id)
        .order('day', { ascending: true })
        .order('time', { ascending: true });
        
      if (timelineError) {
        console.error('Error fetching timelines:', timelineError);
        continue;
      }
      
      const schedule = timelineData.map(item => ({
        time: item.time,
        activity: item.content
      }));
      
      result.push({
        id: stay.id,
        templeName: stay.name,
        location: stay.region || 'Unknown',
        direction: stay.public_transportation || '',
        price: parseInt(stay.cost_adult) || 0,
        likeCount: stay.follower_count || 0,
        description: stay.description || '',
        duration: stay.start_date && stay.end_date ? `${stay.start_date}~${stay.end_date}` : '당일',
        imageUrl: stay.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
        websiteUrl: stay.reservation_link || '',
        schedule: schedule,
        // Safely handle tags with a default empty array
        tags: stay.tags ? JSON.parse(stay.tags as string) : []
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in getTempleStayList:', error);
    return [];
  }
};

export const searchTempleStays = async (query: string): Promise<TempleStay[]> => {
  if (!query.trim()) return [];
  
  try {
    // Find temples with matching name first
    const templeResponse = await supabase
      .from('temples')
      .select('id, name')
      .ilike('name', `%${query}%`);
      
    if (templeResponse.error) {
      console.error('Error searching temples for temple stays:', templeResponse.error);
    }
    
    let templeIds: string[] = [];
    if (templeResponse.data && templeResponse.data.length > 0) {
      templeIds = templeResponse.data.map(t => t.id);
    }
    
    // Search temple stays by name, region, description, or associated temple
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .or(`name.ilike.%${query}%,region.ilike.%${query}%,description.ilike.%${query}%${templeIds.length > 0 ? `,temple_id.in.(${templeIds.join(',')})` : ''}`);
    
    if (error) {
      console.error('Error searching temple stays:', error);
      return [];
    }
    
    return data.map(stay => ({
      id: stay.id,
      templeName: stay.name,
      location: stay.region || 'Unknown',
      direction: stay.public_transportation || '',
      price: parseInt(stay.cost_adult) || 0,
      likeCount: stay.follower_count || 0,
      description: stay.description || '',
      duration: stay.start_date && stay.end_date ? `${stay.start_date}~${stay.end_date}` : '당일',
      imageUrl: stay.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      websiteUrl: stay.reservation_link || '',
      schedule: [],
      tags: stay.tags ? JSON.parse(stay.tags as string) : []
    }));
  } catch (error) {
    console.error('Exception searching temple stays:', error);
    return [];
  }
};

export const getTempleStayDetail = async (id: string): Promise<TempleStay | null> => {
  try {
    const { data: stay, error: stayError } = await supabase
      .from('temple_stays')
      .select('*')
      .eq('id', id)
      .single();
      
    if (stayError) {
      console.error('Error fetching temple stay details:', stayError);
      return null;
    }
    
    const { data: timelineData, error: timelineError } = await supabase
      .from('timelines')
      .select('*')
      .eq('temple_stay_id', id)
      .order('day', { ascending: true })
      .order('time', { ascending: true });
      
    const schedule = timelineData && !timelineError 
      ? timelineData.map(item => ({
          time: item.time,
          activity: item.content
        }))
      : [];
    
    return {
      id: stay.id,
      templeName: stay.name,
      location: stay.region || 'Unknown',
      direction: stay.public_transportation || '',
      price: parseInt(stay.cost_adult) || 0,
      likeCount: stay.follower_count || 0,
      description: stay.description || '',
      duration: stay.start_date && stay.end_date ? `${stay.start_date}~${stay.end_date}` : '당일',
      imageUrl: stay.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      websiteUrl: stay.reservation_link || '',
      schedule: schedule,
      tags: stay.tags ? JSON.parse(stay.tags as string) : []
    };
  } catch (error) {
    console.error('Error in getTempleStayDetail:', error);
    return null;
  }
};

export const getTempleStaysByRegion = async (region: string): Promise<TempleStay[]> => {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .eq('region', region);
    
    if (error) {
      console.error('Error fetching temple stays by region:', error);
      return [];
    }
    
    return data.map(stay => ({
      id: stay.id,
      templeName: stay.name,
      location: stay.region || 'Unknown',
      direction: stay.public_transportation || '',
      price: parseInt(stay.cost_adult) || 0,
      likeCount: stay.follower_count || 0,
      description: stay.description || '',
      duration: stay.start_date && stay.end_date ? `${stay.start_date}~${stay.end_date}` : '당일',
      imageUrl: stay.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      websiteUrl: stay.reservation_link || '',
      schedule: [],
      tags: stay.tags ? JSON.parse(stay.tags as string) : []
    }));
  } catch (error) {
    console.error('Error in getTempleStaysByRegion:', error);
    return [];
  }
};

