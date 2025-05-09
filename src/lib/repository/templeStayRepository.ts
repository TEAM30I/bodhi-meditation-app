// TempleStay Repository with Supabase Integration
import { supabase } from '@/lib/supabase';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';
import { TempleStay, TempleStaySort } from '@/types';
import { DEFAULT_LOCATION, DEFAULT_IMAGES } from '@/constants';

// Fetch temple stay detail by ID
export async function getTempleStayDetail(id: string): Promise<TempleStay | null> {
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
          image_url,
          latitude,
          longitude
        )
      `)
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
      },
      // 사찰 정보 추가
      temple: data.temples ? {
        id: data.temples.id,
        name: data.temples.name,
        region: data.temples.region,
        address: data.temples.address,
        imageUrl: data.temples.image_url,
        latitude: data.temples.latitude,
        longitude: data.temples.longitude
      } : undefined
    };
    
    return templeStay;
  } catch (error) {
    console.error('Error in getTempleStayDetail:', error);
    return null;
  }
}

// 통합된 검색 함수
export async function searchTempleStays(query: string = '', sortBy: TempleStaySort = 'popular'): Promise<TempleStay[]> {
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
          address,
          image_url,
          latitude,
          longitude
        )
      `);
    
    if (error) {
      console.error('Error searching temple stays:', error);
      return [];
    }
    
    // 검색어가 없으면 모든 데이터 반환
    let filteredData = data;
    
    // 검색어가 있는 경우에만 필터링 수행
    if (query) {
      // 지역명 검색을 위한 정규화된 쿼리 생성
      const normalizedQuery = query.trim().toLowerCase();
      
      // 지역명 약어 매핑
      const regionMappings: Record<string, string[]> = {
        '경상북도': ['경북'],
        '경상남도': ['경남'],
        '전라북도': ['전북'],
        '전라남도': ['전남'],
        '충청북도': ['충북'],
        '충청남도': ['충남'],
        '경기도': ['경기'],
        '강원도': ['강원'],
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
      
      // 검색어 확장
      let expandedQueries = [normalizedQuery];
      
      for (const [fullName, shortNames] of Object.entries(regionMappings)) {
        if (fullName.toLowerCase().includes(normalizedQuery)) {
          expandedQueries.push(fullName.toLowerCase());
          expandedQueries.push(...shortNames.map(name => name.toLowerCase()));
        }
        
        if (shortNames.some(name => name.toLowerCase().includes(normalizedQuery))) {
          expandedQueries.push(fullName.toLowerCase());
          expandedQueries.push(...shortNames.map(name => name.toLowerCase()));
        }
      }
      
      // 중복 제거
      expandedQueries = [...new Set(expandedQueries)];
      
      // 클라이언트 측에서 필터링
      filteredData = data.filter(item => {
        // 템플스테이 이름으로 검색
        if ((item.name && item.name.toLowerCase().includes(normalizedQuery)) ||
            (item.temple_name && item.temple_name.toLowerCase().includes(normalizedQuery))) {
          return true;
        }
        
        // 사찰 이름으로 검색
        if (item.temples && item.temples.name && 
            item.temples.name.toLowerCase().includes(normalizedQuery)) {
          return true;
        }
        
        // 지역명으로 검색 (확장된 쿼리 사용)
        if (item.location) {
          const normalizedLocation = item.location.toLowerCase();
          if (expandedQueries.some(q => normalizedLocation.includes(q))) {
            return true;
          }
        }
        
        // 사찰 지역명으로 검색
        if (item.temples && item.temples.region) {
          const normalizedRegion = item.temples.region.toLowerCase();
          if (expandedQueries.some(q => normalizedRegion.includes(q))) {
            return true;
          }
        }
        
        // 사찰 주소로 검색
        if (item.temples && item.temples.address && 
            item.temples.address.toLowerCase().includes(normalizedQuery)) {
          return true;
        }
        
        return false;
      });
    }
    
    // 정렬 적용
    let sortedData = [...filteredData];
    
    switch (sortBy) {
      case 'price_low':
        sortedData.sort((a, b) => {
          const priceA = a.cost_adult ? parseInt(a.cost_adult.replace(/,/g, '')) : (a.price || 0);
          const priceB = b.cost_adult ? parseInt(b.cost_adult.replace(/,/g, '')) : (b.price || 0);
          return priceA - priceB;
        });
        break;
      case 'price_high':
        sortedData.sort((a, b) => {
          const priceA = a.cost_adult ? parseInt(a.cost_adult.replace(/,/g, '')) : (a.price || 0);
          const priceB = b.cost_adult ? parseInt(b.cost_adult.replace(/,/g, '')) : (b.price || 0);
          return priceB - priceA;
        });
        break;
      case 'distance':
        // 모든 데이터에 대해 거리 계산
        sortedData = sortedData.map(item => {
          if (item.temples?.latitude && item.temples?.longitude) {
            const distance = calculateDistance(
              DEFAULT_LOCATION.latitude,
              DEFAULT_LOCATION.longitude,
              item.temples.latitude,
              item.temples.longitude
            );
            return { ...item, distance: formatDistance(distance) };
          }
          return { ...item, distance: '거리 정보 없음' };
        });

        // 거리 정보가 있는 항목을 앞으로 정렬
        sortedData.sort((a, b) => {
          if (!a.distance || a.distance === '거리 정보 없음') return 1;
          if (!b.distance || b.distance === '거리 정보 없음') return -1;
          
          const distA = parseFloat(a.distance.replace('km', '').replace('m', '')) || 0;
          const distB = parseFloat(b.distance.replace('km', '').replace('m', '')) || 0;
          return distA - distB;
        });
        break;
      case 'popular':
      default:
        sortedData.sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0));
        break;
    }
    
    return sortedData.map(item => ({
      id: item.id,
      templeName: item.name || item.temple_name || '',
      name: item.name || item.temple_name || '',
      temple_name: item.temple_name || item.name || '',
      location: item.location || '',
      imageUrl: item.image_url || DEFAULT_IMAGES.TEMPLE_STAY,
      price: item.cost_adult ? parseInt(item.cost_adult.replace(/,/g, '')) : (item.price || 0),
      description: item.description || '',
      likeCount: item.like_count || item.follower_count || 0,
      direction: item.public_transportation || '',
      facilities: item.facilities ? JSON.parse(item.facilities) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
      longitude: item.temples?.longitude,
      latitude: item.temples?.latitude,
      distance: item.distance,
      temple: item.temples ? {
        id: item.temples.id,
        name: item.temples.name,
        region: item.temples.region,
        address: item.temples.address,
        imageUrl: item.temples.image_url,
        latitude: item.temples.latitude,
        longitude: item.temples.longitude
      } : undefined
    }));
  } catch (error) {
    console.error('Error in searchTempleStays:', error);
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
      .select(`
        temple_stay_id, 
        temple_stays(
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
        )
      `)
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
          templeName: templeStay.name || templeStay.temple_name || '',
          name: templeStay.name || templeStay.temple_name || '',
          location: templeStay.location || templeStay.region || '',
          imageUrl: templeStay.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=TempleStay",
          price: parseInt(templeStay.cost_adult?.replace(/,/g, '')) || 50000,
          likeCount: templeStay.follower_count || 0,
          direction: templeStay.public_transportation || '',
          // 사찰 정보 추가
          temple: templeStay.temples ? {
            id: templeStay.temples.id,
            name: templeStay.temples.name,
            region: templeStay.temples.region,
            address: templeStay.temples.address,
            imageUrl: templeStay.temples.image_url,
            latitude: templeStay.temples.latitude,
            longitude: templeStay.temples.longitude
          } : undefined
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

// 템플스테이 토글 함수 추가
export async function toggleTempleStayFollow(userId: string, templeStayId: string): Promise<boolean> {
  try {
    // 현재 팔로우 상태 확인
    const isFollowed = await isTempleStayFollowed(userId, templeStayId);
    
    if (isFollowed) {
      // 이미 팔로우한 경우 -> 팔로우 해제
      const result = await unfollowTempleStay(userId, templeStayId);
      return !result; // unfollowTempleStay가 성공하면 false 반환 (팔로우 해제됨)
    } else {
      // 팔로우하지 않은 경우 -> 팔로우 추가
      const result = await followTempleStay(userId, templeStayId);
      return result; // followTempleStay가 성공하면 true 반환 (팔로우 추가됨)
    }
  } catch (error) {
    console.error('Error in toggleTempleStayFollow:', error);
    return false;
  }
}

// 템플스테이 팔로우 상태 확인 함수 추가
export async function isTempleStayFollowed(userId: string, templeStayId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_follow_temple_stays')
      .select('*')
      .eq('user_id', userId)
      .eq('temple_stay_id', templeStayId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116: 결과가 없음
      console.error('Error checking temple stay follow status:', error);
      return false;
    }
    
    return !!data; // data가 있으면 true, 없으면 false
  } catch (error) {
    console.error('Error in isTempleStayFollowed:', error);
    return false;
  }
}
