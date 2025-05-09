// TempleStay Repository with Supabase Integration
import { supabase } from '@/lib/supabase';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';
import { TempleStay, TempleStaySort } from '@/types';
import { DEFAULT_LOCATION, DEFAULT_IMAGES } from '@/constants';

// Get all available regions for UI location selection
export async function getTempleStayLocations(): Promise<string[]> {
  try {
    const regions = await getTempleStayRegions();
    return regions;
  } catch (error) {
    console.error('Error fetching temple stay locations:', error);
    return [];
  }
}

// Fetch temple stays from Supabase
export async function getTempleStayList(sortBy: TempleStaySort = 'popular'): Promise<TempleStay[]> {
  try {
    // temple_stays와 temples 테이블을 조인하여 데이터 가져오기
    let query = supabase
      .from('temple_stays')
      .select(`
        *,
        temples:temple_id (
          id,
          name,
          region,
          address,
          image_url,
          latitude,
          longitude
        )
      `);
    
    // 정렬 적용
    switch (sortBy) {
      case 'recent':
        query = query.order('created_at', { ascending: false });
        break;
      case 'price':
        query = query.order('cost_adult', { ascending: true });
        break;
      case 'popular':
      default:
        query = query.order('follower_count', { ascending: false });
        break;
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    if (!data) return [];
    
    // 데이터 매핑
    const templeStays = data.map(item => ({
      id: item.id,
      templeName: item.temple_name || item.name,
      location: item.location || '',
      imageUrl: item.image_url,
      price: item.cost_adult ? parseInt(item.cost_adult.replace(/,/g, '')) : (item.price || 0),
      description: item.description || '',
      likeCount: item.like_count || 0,
      // 템플 객체 항상 포함
      temple: item.temples ? {
        id: item.temples.id,
        name: item.temples.name,
        region: item.temples.region,
        address: item.temples.address,
        imageUrl: item.temples.image_url,
        latitude: item.temples.latitude,
        longitude: item.temples.longitude
      } : {
        id: '',
        name: item.temple_name || '사찰 정보 없음',
        region: item.location || '',
        address: '',
        imageUrl: '',
        latitude: 0,
        longitude: 0
      }
    }));
    
    // 거리순 정렬 로직은 그대로 유지
    if (sortBy === 'distance') {
      const filteredTempleStays = templeStays
        .filter(templeStay => templeStay.temple?.latitude && templeStay.temple?.longitude)
        .map(templeStay => {
          const distance = calculateDistance(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
            templeStay.temple?.latitude!,
            templeStay.temple?.longitude!
          );
          return { ...templeStay, distance: formatDistance(distance) };
        })
        .sort((a, b) => {
          const distA = parseFloat(a.distance?.replace('km', '').replace('m', '') || '0');
          const distB = parseFloat(b.distance?.replace('km', '').replace('m', '') || '0');
          return distA - distB;
        });
        
      return filteredTempleStays;
    }
    
    return templeStays;
  } catch (error) {
    console.error('Error in getTempleStayList:', error);
    return [];
  }
}

// Fetch temple stay detail by ID
export async function getTempleStayDetail(id: string): Promise<TempleStay | null> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching temple stay details:', error);
      return null;
    }
    
    // Also fetch schedule if available
    const { data: scheduleData, error: scheduleError } = await supabase
      .from('timelines')
      .select('*')
      .eq('temple_stay_id', id)
      .order('day', { ascending: true })
      .order('time', { ascending: true });
    
    if (scheduleError) {
      console.error('Error fetching temple stay schedule:', scheduleError);
    }
    
    const schedule = scheduleData ? scheduleData.map(item => ({
      time: item.time,
      activity: item.content,
      day: item.day
    })) : [];
    
    const templeStay: TempleStay = {
      id: data.id,
      templeName: data.name,
      location: data.region,
      imageUrl: data.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(data.cost_adult?.replace(/,/g, '')) || 50000,
      description: data.description,
      likeCount: data.follower_count,
      direction: data.public_transportation,
      schedule: schedule,
      longitude: data.longitude,
      latitude: data.latitude,
      facilities: data.facilities ? JSON.parse(data.facilities) : [],
      tags: data.tags ? JSON.parse(data.tags) : [],
      websiteUrl: data.reservation_link,
      contact: {
        phone: data.contact
      }
    };
    
    return templeStay;
  } catch (error) {
    console.error('Error in getTempleStayDetail:', error);
    return null;
  }
}

// Search temple stays by text query
export async function searchTempleStays(query: string, sortBy: TempleStaySort = 'popular'): Promise<TempleStay[]> {
  if (!query) return [];
  
  try {
    // 템플스테이 테이블과 사찰 테이블을 조인하여 검색
    const { data, error } = await supabase
      .from('temple_stays')
      .select(`
        *,
        temples:temple_id (
          id,
          name,
          region,
          address
        )
      `);
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    // 검색어를 소문자로 변환
    const normalizedQuery = query.toLowerCase();
    
    // 템플스테이 이름, 사찰 이름, 지역명으로 필터링
    const filteredData = data.filter(item => {
      // 템플스테이 자체 이름 검색
      if (item.temple_name && item.temple_name.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      // 연관된 사찰 정보로 검색
      if (item.temples) {
        // 사찰 이름으로 검색
        if (item.temples.name && item.temples.name.toLowerCase().includes(normalizedQuery)) {
          return true;
        }
        
        // 사찰 지역으로 검색 (전체 지역명 또는 약식 지역명)
        if (item.temples.region) {
          const region = item.temples.region.toLowerCase();
          
          // 지역명 정규화 (예: '경상북도 경주시' -> '경북', '경주')
          const normalizedRegion = normalizeRegion(region);
          
          if (region.includes(normalizedQuery) || 
              normalizedRegion.some(r => r.includes(normalizedQuery))) {
            return true;
          }
        }
        
        // 사찰 주소로 검색
        if (item.temples.address && item.temples.address.toLowerCase().includes(normalizedQuery)) {
          return true;
        }
      }
      
      return false;
    });
    
    // 정렬 적용
    let sortedData = [...filteredData];
    
    switch (sortBy) {
      case 'recent':
        sortedData.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
        break;
      case 'price':
        sortedData.sort((a, b) => {
          const priceA = a.cost_adult ? parseInt(a.cost_adult.replace(/,/g, '')) : (a.price || 0);
          const priceB = b.cost_adult ? parseInt(b.cost_adult.replace(/,/g, '')) : (b.price || 0);
          return priceA - priceB;
        });
        break;
      case 'popular':
      default:
        sortedData.sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0));
        break;
    }
    
    // 결과 매핑 및 반환
    return sortedData.map(item => ({
      id: item.id,
      templeName: item.temple_name,
      location: item.location || '',
      imageUrl: item.image_url,
      price: item.cost_adult ? parseInt(item.cost_adult.replace(/,/g, '')) : (item.price || 0),
      description: item.description || '',
      likeCount: item.like_count || 0,
      // ... 기타 필드 매핑 ...
      temple: item.temples ? {
        id: item.temples.id,
        name: item.temples.name,
        region: item.temples.region,
        address: item.temples.address
      } : null
    }));
  } catch (error) {
    console.error('Error in searchTempleStays:', error);
    return [];
  }
}

// 지역명 정규화 함수
function normalizeRegion(region: string): string[] {
  const result: string[] = [];
  
  // 도/시 약칭 매핑
  const regionMappings: Record<string, string[]> = {
    '경상북도': ['경북'],
    '경상남도': ['경남'],
    '전라북도': ['전북'],
    '전라남도': ['전남'],
    '충청북도': ['충북'],
    '충청남도': ['충남'],
    '강원도': ['강원'],
    '경기도': ['경기'],
    '제주특별자치도': ['제주'],
    '서울특별시': ['서울'],
    '부산광역시': ['부산'],
    '대구광역시': ['대구'],
    '인천광역시': ['인천'],
    '광주광역시': ['광주'],
    '대전광역시': ['대전'],
    '울산광역시': ['울산'],
    '세종특별자치시': ['세종']
  };
  
  // 전체 지역명에서 도/시 부분 추출
  for (const [fullName, shortNames] of Object.entries(regionMappings)) {
    if (region.includes(fullName)) {
      result.push(...shortNames);
      
      // 시/군/구 추출 (예: '경상북도 경주시' -> '경주')
      const cityMatch = region.match(new RegExp(`${fullName}\\s+([^\\s]+)`));
      if (cityMatch && cityMatch[1]) {
        const city = cityMatch[1].replace(/(시|군|구)$/, '');
        result.push(city);
      }
      
      break;
    }
  }
  
  return result;
}

// Filter temple stays by tag
export async function filterTempleStaysByTag(tag: string): Promise<TempleStay[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .eq('region', tag);
    
    if (error) {
      console.error('Error filtering temple stays by tag:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      templeName: item.name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(item.cost_adult?.replace(/,/g, '')) || 50000,
      likeCount: item.follower_count,
      direction: item.public_transportation
    }));
  } catch (error) {
    console.error('Error in filterTempleStaysByTag:', error);
    return [];
  }
}

// Get temple stays by region
export async function getTempleStaysByRegion(region: string): Promise<TempleStay[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('*')
      .eq('region', region);
    
    if (error) {
      console.error('Error fetching temple stays by region:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      templeName: item.name,
      location: item.region,
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(item.cost_adult?.replace(/,/g, '')) || 50000,
      likeCount: item.follower_count,
      direction: item.public_transportation
    }));
  } catch (error) {
    console.error('Error in getTempleStaysByRegion:', error);
    return [];
  }
}

// Follow temple stay
export async function followTempleStay(userId: string, templeStayId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_follow_temple_stays')
      .insert({ user_id: userId, temple_stay_id: templeStayId });
    
    if (error) {
      console.error('Error following temple stay:', error);
      return false;
    }
    
    // Update follower count
    const { error: updateError } = await supabase
      .from('temple_stays')
      .update({ follower_count: supabase.rpc('increment', { row_id: templeStayId }) })
      .eq('id', templeStayId);
    
    if (updateError) {
      console.error('Error updating follower count:', updateError);
    }
    
    return true;
  } catch (error) {
    console.error('Error in followTempleStay:', error);
    return false;
  }
}

// Unfollow temple stay
export async function unfollowTempleStay(userId: string, templeStayId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_follow_temple_stays')
      .delete()
      .eq('user_id', userId)
      .eq('temple_stay_id', templeStayId);
    
    if (error) {
      console.error('Error unfollowing temple stay:', error);
      return false;
    }
    
    // Update follower count
    const { error: updateError } = await supabase
      .from('temple_stays')
      .update({ follower_count: supabase.rpc('decrement', { row_id: templeStayId }) })
      .eq('id', templeStayId);
    
    if (updateError) {
      console.error('Error updating follower count:', updateError);
    }
    
    return true;
  } catch (error) {
    console.error('Error in unfollowTempleStay:', error);
    return false;
  }
}

// Get user followed temple stays
export async function getUserFollowedTempleStays(userId: string): Promise<TempleStay[]> {
  try {
    const { data, error } = await supabase
      .from('user_follow_temple_stays')
      .select('temple_stay_id, temple_stays(*)')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user followed temple stays:', error);
      return [];
    }
    
    // Check if data exists and is not empty
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map data to the expected format with proper type checking
    const templeStays = data
      .filter(item => item && item.temple_stays)
      .map(item => {
        const templeStay = item.temple_stays as any;
        
        return {
          id: templeStay.id,
          templeName: templeStay.name,
          location: templeStay.region,
          imageUrl: templeStay.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
          price: parseInt(templeStay.cost_adult?.replace(/,/g, '')) || 50000,
          likeCount: templeStay.follower_count,
          direction: templeStay.public_transportation
        };
      });
      
    return templeStays;
  } catch (error) {
    console.error('Error in getUserFollowedTempleStays:', error);
    return [];
  }
}

// Get top liked temple stays
export async function getTopLikedTempleStays(limit = 5): Promise<TempleStay[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select(`
        *,
        temples:temple_id (
          id,
          name,
          region,
          address,
          image_url
        )
      `)
      .order('follower_count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching top liked temple stays:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      templeName: item.temple_name || item.name,
      location: item.region || '',
      imageUrl: item.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
      price: parseInt(item.cost_adult?.replace(/,/g, '')) || 50000,
      likeCount: item.follower_count,
      direction: item.public_transportation,
      temple: item.temples ? {
        id: item.temples.id,
        name: item.temples.name,
        region: item.temples.region,
        address: item.temples.address,
        imageUrl: item.temples.image_url
      } : null
    }));
  } catch (error) {
    console.error('Error in getTopLikedTempleStays:', error);
    return [];
  }
}

// Get all available regions from database
export async function getTempleStayRegions(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('temple_stays')
      .select('region')
      .not('region', 'is', null)
      .order('region', { ascending: true });
    
    if (error) {
      console.error('Error fetching temple stay regions:', error);
      return [];
    }
    
    // Extract unique regions
    const regions = [...new Set(data.map(item => item.region).filter(Boolean))];
    return regions;
  } catch (error) {
    console.error('Error in getTempleStayRegions:', error);
    return [];
  }
}

// Export empty locations array for backward compatibility
// This will be filled by the getTempleStayLocations function instead of being hardcoded
export const locations: string[] = [];
