
import { supabase } from "@/integrations/supabase/client";
import { Temple } from "@/types/temple";

// Export temple-related functions
export const getTempleList = async (): Promise<Temple[]> => {
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('*');
      
    if (error) {
      console.error('Error fetching temples:', error);
      return []; 
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
      description: item.description,
      direction: item.address,
      likeCount: item.follower_count,
      contact: {
        phone: item.contact
      },
      latitude: item.latitude,
      longitude: item.longitude,
      facilities: [], // Empty array as default
      tags: [] // Empty array as default
    }));
  } catch (error) {
    console.error('Error in getTempleList:', error);
    return []; 
  }
};

export const getTempleDetail = async (id: string): Promise<Temple | null> => {
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching temple details:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      location: data.region,
      imageUrl: data.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
      description: data.description,
      direction: data.address,
      likeCount: data.follower_count,
      contact: {
        phone: data.contact
      },
      latitude: data.latitude,
      longitude: data.longitude,
      facilities: [], // Empty array as default
      tags: [] // Empty array as default
    };
  } catch (error) {
    console.error('Error in getTempleDetail:', error);
    return null;
  }
};

export const searchTemples = async (query: string): Promise<Temple[]> => {
  try {
    if (!query.trim()) return [];
    
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .or(`name.ilike.%${query}%,region.ilike.%${query}%,description.ilike.%${query}%`);
      
    if (error) {
      console.error('Error searching temples:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
      description: item.description,
      direction: item.address,
      likeCount: item.follower_count,
      contact: {
        phone: item.contact
      },
      latitude: item.latitude,
      longitude: item.longitude,
      facilities: [], // Empty array as default
      tags: [] // Empty array as default
    }));
  } catch (error) {
    console.error('Error in searchTemples:', error);
    return [];
  }
};

export const getNearbyTemples = async (latitude: number, longitude: number, limit = 4): Promise<Temple[]> => {
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .limit(limit);
    
    if (error) {
      console.error('Error fetching temples for nearby calculation:', error);
      return [];
    }
    
    const templesWithLocation = data.filter(temple => 
      temple.latitude && temple.longitude
    );
    
    const templesWithDistance = templesWithLocation.map(temple => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        temple.latitude!, 
        temple.longitude!
      );
      
      return {
        ...temple,
        distance: distance
      };
    });
    
    const sortedTemples = templesWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
    
    return sortedTemples.map(temple => ({
      id: temple.id,
      name: temple.name,
      location: temple.region,
      imageUrl: temple.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
      description: temple.description,
      direction: temple.address,
      distance: formatDistance(temple.distance),
      likeCount: temple.follower_count,
      latitude: temple.latitude,
      longitude: temple.longitude,
      facilities: [], // Empty array as default
      tags: [] // Empty array as default
    }));
  } catch (error) {
    console.error('Error in getNearbyTemples:', error);
    return [];
  }
};

// Helper functions for distance calculations
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
}
