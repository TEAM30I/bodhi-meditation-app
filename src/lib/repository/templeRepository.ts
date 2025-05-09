// src/lib/repository/templeRepository.ts
import { supabase } from '@/lib/supabase';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';
import { Temple, TempleSort, RegionTag } from '@/types';
import { DEFAULT_LOCATION } from '@/constants';
import { DEFAULT_IMAGES } from '@/constants';


// Export regionTags for UI components that need immediate access
// This will be populated with data from the database rather than hardcoded
export const regionTags: RegionTag[] = [];

// Initialize regionTags on module load
(async () => {
  try {
    const tags = await getRegionTags();
    // Clear the array and add the fetched tags
    regionTags.length = 0;
    regionTags.push(...tags);
  } catch (error) {
    console.error('Error initializing regionTags array:', error);
  }
})();


// Get all regions as an array 
export async function getRegionTags(): Promise<RegionTag[]> {
  try {
    const regions = await getTempleRegions();
    return regions.map((region, index) => ({
      id: `region-${index}`,
      name: region,
      active: index === 0
    }));
  } catch (error) {
    console.error('Error getting region tags:', error);
    return [];
  }
}

// 지역명을 광역시/도 단위로 정규화하는 함수
function normalizeRegionToProvince(region: string): string {
  // 광역시/도 추출 정규식
  const provinceRegex = /^(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)/;
  
  const match = region.match(provinceRegex);
  if (match) {
    return match[1];
  }
  
  // 특별한 케이스 처리
  if (region.includes('충청북도')) return '충북';
  if (region.includes('충청남도')) return '충남';
  if (region.includes('전라북도')) return '전북';
  if (region.includes('전라남도')) return '전남';
  if (region.includes('경상북도')) return '경북';
  if (region.includes('경상남도')) return '경남';
  if (region.includes('제주특별자치도')) return '제주';
  if (region.includes('세종특별자치시')) return '세종';
  
  // 기본값 반환
  return region;
}

// 사찰 지역 목록 가져오기 (광역시/도 단위로 그룹화)
export async function getTempleRegions(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('region')
      .not('region', 'is', null);
    
    if (error) {
      console.error('Error fetching temple regions:', error);
      return [];
    }
    
    // 모든 지역을 광역시/도 단위로 정규화
    const normalizedRegions = data
      .map(item => normalizeRegionToProvince(item.region || ''))
      .filter(Boolean); // 빈 문자열 제거
    
    // 중복 제거 및 정렬
    const uniqueRegions = [...new Set(normalizedRegions)].sort();
    
    // 기본 지역 목록 (데이터가 없을 경우 대비)
    const defaultRegions = [
      '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
      '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
    ];
    
    // 데이터베이스에서 가져온 지역이 없으면 기본 지역 목록 반환
    return uniqueRegions.length > 0 ? uniqueRegions : defaultRegions;
  } catch (error) {
    console.error('Error in getTempleRegions:', error);
    
    // 오류 발생 시 기본 지역 목록 반환
    return [
      '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
      '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
    ];
  }
}

// Supabase 데이터베이스에서 사찰 목록 가져오기
export async function getTempleList(sortBy: TempleSort = 'popular'): Promise<Temple[]> {
  try {
    let query = supabase.from('temples').select('*');
    
    if (sortBy === 'popular') {
      query = query.order('follower_count', { ascending: false });
    } else if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching temples:', error);
      return []; 
    }
    
    let temples = data.map(item => ({
      id: item.id,
      name: item.name,
      address: item.address || item.region || '',
      region: item.region || '',
      contact: item.contact || '',
      description: item.description,
      imageUrl: item.image_url || DEFAULT_IMAGES.TEMPLE,
      image_url: item.image_url || DEFAULT_IMAGES.TEMPLE,
      likeCount: item.follower_count,
      latitude: item.latitude,
      longitude: item.longitude,
      facilities: item.facilities ? JSON.parse(item.facilities) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
      openingHours: item.opening_hours,
      websiteUrl: item.website_url
    }));
    
    // 거리 정렬은 프론트엔드에서 처리
    if (sortBy === 'distance') {
      temples = temples
        .filter(temple => temple.latitude && temple.longitude)
        .map(temple => {
          const distance = calculateDistance(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
            temple.latitude!,
            temple.longitude!
          );
          return { ...temple, distance: formatDistance(distance) };
        })
        .sort((a, b) => {
          const distA = parseFloat(a.distance?.replace('km', '').replace('m', '') || '0');
          const distB = parseFloat(b.distance?.replace('km', '').replace('m', '') || '0');
          return distA - distB;
        });
    }
    
    return temples;
  } catch (error) {
    console.error('Error in getTempleList:', error);
    return []; 
  }
}
// Supabase에서 좋아요 기준으로 정렬된 사찰 목록 가져오기
export async function getTopLikedTemples(limit = 5): Promise<Temple[]> {
  try {
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .order('follower_count', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching top liked temples:', error);
      return [];
    }
    
    return data.map(temple => ({
      id: temple.id,
      name: temple.name,
      address: temple.address || temple.region || '',
      region: temple.region || '',
      contact: temple.contact || '',
      imageUrl: temple.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
      image_url: temple.image_url,
      likeCount: temple.follower_count,
      description: temple.description,
      latitude: temple.latitude,
      longitude: temple.longitude
    }));
  } catch (error) {
    console.error('Error in getTopLikedTemples:', error);
    return [];
  }
}

// 사찰 태그 기반 필터링
export async function filterTemplesByTag(tag: string): Promise<Temple[]> {
  try {
    // 태그 필드가 JSON 배열로 저장되어 있을 경우 유의
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .ilike('tags', `%${tag}%`);
      
    if (error) {
      console.error('Error filtering temples by tag:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      address: item.address || item.region || '',
      region: item.region || '',
      contact: item.contact || '',
      imageUrl: item.image_url,
      image_url: item.image_url,
      description: item.description,
      likeCount: item.follower_count,
      latitude: item.latitude,
      longitude: item.longitude
    }));
  } catch (error) {
    console.error('Error in filterTemplesByTag:', error);
    return [];
  }
}

// 사찰 검색 기능
export async function searchTemples(query: string): Promise<Temple[]> {
  if (!query) return [];
  
  try {
    // 지역명 검색을 위한 정규화된 쿼리 생성
    // 예: '경상북도' 검색 시 '경북'도 포함, '경주시' 검색 시 '경주'도 포함
    const normalizedQuery = query.trim();
    
    // 지역명 약어 매핑 (예: 경상북도 -> 경북)
    const regionMappings: Record<string, string[]> = {
      '경상북도': ['경북'],
      '경상남도': ['경남'],
      '전라북도': ['전북'],
      '전라남도': ['전남'],
      '충청북도': ['충북'],
      '충청남도': ['충남'],
      '경기도': ['경기'],
      '강원도': ['강원']
    };
    
    // 시/군/구 매핑 (예: 경주시 -> 경주)
    const cityMappings: string[] = ['시', '군', '구'];
    
    // 검색어 확장
    let expandedQueries = [normalizedQuery];
    
    // 지역명 약어 확장
    for (const [fullName, shortNames] of Object.entries(regionMappings)) {
      if (normalizedQuery.includes(fullName)) {
        shortNames.forEach(short => expandedQueries.push(normalizedQuery.replace(fullName, short)));
      } else {
        shortNames.forEach(short => {
          if (normalizedQuery.includes(short)) {
            expandedQueries.push(normalizedQuery.replace(short, fullName));
          }
        });
      }
    }
    
    // 시/군/구 확장
    cityMappings.forEach(suffix => {
      if (normalizedQuery.endsWith(suffix)) {
        expandedQueries.push(normalizedQuery.slice(0, -1));
      } else if (!normalizedQuery.endsWith(suffix)) {
        expandedQueries.push(`${normalizedQuery}${suffix}`);
      }
    });
    
    // 중복 제거
    expandedQueries = [...new Set(expandedQueries)];
    
    // OR 조건으로 검색 쿼리 구성
    let orConditions = expandedQueries.map(q => `name.ilike.%${q}%`).join(',');
    orConditions += ',' + expandedQueries.map(q => `region.ilike.%${q}%`).join(',');
    orConditions += ',' + expandedQueries.map(q => `address.ilike.%${q}%`).join(',');
    orConditions += ',' + expandedQueries.map(q => `description.ilike.%${q}%`).join(',');
    
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .or(orConditions);
      
    if (error) {
      console.error('Error searching temples:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      address: item.address || item.region || '',
      region: item.region || '',
      contact: item.contact || '',
      imageUrl: item.image_url,
      image_url: item.image_url,
      description: item.description,
      likeCount: item.follower_count,
      latitude: item.latitude,
      longitude: item.longitude
    }));
  } catch (error) {
    console.error('Error in searchTemples:', error);
    return [];
  }
}

// 사용자 사찰 팔로우 기능
export async function followTemple(userId: string, templeId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_follow_temples')
      .insert({ user_id: userId, temple_id: templeId });
      
    if (error) {
      console.error('Error following temple:', error);
      return false;
    }
    
    // 팔로워 카운트 업데이트
    const { error: updateError } = await supabase
      .from('temples')
      .update({ follower_count: supabase.rpc('increment', { row_id: templeId }) })
      .eq('id', templeId);
      
    if (updateError) {
      console.error('Error updating follower count:', updateError);
    }
    
    return true;
  } catch (error) {
    console.error('Error in followTemple:', error);
    return false;
  }
}

// 사용자 사찰 언팔로우 기능
export async function unfollowTemple(userId: string, templeId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_follow_temples')
      .delete()
      .eq('user_id', userId)
      .eq('temple_id', templeId);
      
    if (error) {
      console.error('Error unfollowing temple:', error);
      return false;
    }
    
    // 팔로워 카운트 감소
    const { error: updateError } = await supabase
      .from('temples')
      .update({ follower_count: supabase.rpc('decrement', { row_id: templeId }) })
      .eq('id', templeId);
      
    if (updateError) {
      console.error('Error updating follower count:', updateError);
    }
    
    return true;
  } catch (error) {
    console.error('Error in unfollowTemple:', error);
    return false;
  }
}

// 사찰 상세 정보 가져오기
export async function getTempleDetail(id: string): Promise<Temple | null> {
  try {
    console.log('Fetching temple detail for ID:', id); // 디버깅용 로그 추가
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching temple details:', error);
      return null;
    }
    
    console.log('Raw temple data from DB:', data); // 디버깅용 로그 추가
    
    // Temple 인터페이스에 맞게 데이터 변환
    return {
      id: data.id,
      name: data.name,
      address: data.address,
      region: data.region,
      contact: data.contact, // 문자열로 반환
      description: data.description,
      image_url: data.image_url,
      imageUrl: data.image_url,
      likeCount: data.follower_count,
      latitude: data.latitude,
      longitude: data.longitude,
      // 기타 필요한 필드들...
    };
  } catch (error) {
    console.error('Error in getTempleDetail:', error);
    return null;
  }
}

// 현재 위치 기반으로 근처 사찰 가져오기
export async function getNearbyTemples(
  latitude: number = DEFAULT_LOCATION.latitude, 
  longitude: number = DEFAULT_LOCATION.longitude, 
  limit = 4
): Promise<Temple[]> {
  try {
    // 먼저 모든 사찰을 가져옴
    const { data, error } = await supabase
      .from('temples')
      .select('*');
    
    if (error) {
      console.error('Error fetching temples for nearby calculation:', error);
      return [];
    }
    
    // 위치 정보를 가진 사찰만 필터링
    const templesWithLocation = data.filter(temple => 
      temple.latitude && temple.longitude
    );
    
    // 각 사찰까지의 거리 계산
    const templesWithDistance = templesWithLocation.map(temple => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        temple.latitude!, 
        temple.longitude!
      );
      
      return {
        id: temple.id,
        name: temple.name,
        address: temple.address || temple.region || '',
        region: temple.region || '',
        contact: temple.contact || '',
        imageUrl: temple.image_url || "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple",
        image_url: temple.image_url,
        description: temple.description,
        distance: formatDistance(distance),
        likeCount: temple.follower_count,
        latitude: temple.latitude,
        longitude: temple.longitude
      };
    });
    
    // 거리 기준 정렬
    return templesWithDistance
      .sort((a, b) => {
        const distA = parseFloat(a.distance?.replace('km', '').replace('m', '') || '0');
        const distB = parseFloat(b.distance?.replace('km', '').replace('m', '') || '0');
        return distA - distB;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error in getNearbyTemples:', error);
    return [];
  }
}

// Get user followed temples
// 사용자가 좋아요한 사찰 목록 조회
export async function getUserFollowedTemples(userId: string): Promise<Temple[]> {
  try {
    // user_follow_temples 테이블에서 사용자가 팔로우한 사찰 ID 목록 가져오기
    const { data: followData, error: followError } = await supabase
      .from('user_follow_temples')
      .select('temple_id')
      .eq('user_id', userId);
    
    if (followError) throw followError;
    
    if (!followData || followData.length === 0) {
      return [];
    }
    
    // 팔로우한 사찰 ID 목록 추출
    const templeIds = followData.map(item => item.temple_id);
    
    // temples 테이블에서 해당 ID의 사찰 정보 가져오기
    const { data: templesData, error: templesError } = await supabase
      .from('temples')
      .select('*')
      .in('id', templeIds);
    
    if (templesError) throw templesError;
    
    // 사찰 데이터를 Temple 인터페이스에 맞게 변환
    return (templesData || []).map(item => ({
      id: item.id,
      name: item.name,
      address: item.address || item.region || '',
      region: item.region || '',
      contact: item.contact || '',
      description: item.description,
      imageUrl: item.image_url,
      image_url: item.image_url,
      likeCount: item.follower_count,
      latitude: item.latitude,
      longitude: item.longitude,
      // 선택적 필드들
      facilities: item.facilities ? JSON.parse(item.facilities) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
      websiteUrl: item.website_url,
      openingHours: item.opening_hours
    }));
  } catch (error) {
    console.error('Error fetching user followed temples:', error);
    return [];
  }
}

// Get top regions
export async function getTopRegions(limit = 8): Promise<{name: string, count: number}[]> {
  try {
    const { data: templeData, error: templeError } = await supabase
      .from('temples')
      .select('region, follower_count, search_count');
      
    if (templeError) {
      console.error('Error fetching temple regions:', templeError);
      return [];
    }
    
    // Group by region and sum follower_count and search_count
    const regionCounts = templeData.reduce((acc, temple) => {
      if (temple.region) {
        if (!acc[temple.region]) {
          acc[temple.region] = {
            followerCount: 0,
            searchCount: 0
          };
        }
        acc[temple.region].followerCount += temple.follower_count || 0;
        acc[temple.region].searchCount += temple.search_count || 0;
      }
      return acc;
    }, {} as Record<string, {followerCount: number, searchCount: number}>);
    
    // Transform to array and sort by combined count
    const result = Object.entries(regionCounts)
      .map(([name, counts]) => ({
        name,
        count: counts.followerCount + counts.searchCount
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return result;
  } catch (error) {
    console.error('Error in getTopRegions:', error);
    return [];
  }
}

// 사찰 찜 상태 확인
export async function isTempleFollowed(userId: string, templeId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_follow_temples')
      .select('*')
      .eq('user_id', userId)
      .eq('temple_id', templeId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116: 결과가 없음
      console.error('Error checking temple follow status:', error);
      return false;
    }
    
    return !!data; // data가 있으면 true, 없으면 false
  } catch (error) {
    console.error('Error in isTempleFollowed:', error);
    return false;
  }
}

// 사찰 찜하기/찜 해제 토글 함수
export async function toggleTempleFollow(userId: string, templeId: string): Promise<boolean> {
  try {
    // 현재 찜 상태 확인
    const isFollowed = await isTempleFollowed(userId, templeId);
    
    if (isFollowed) {
      // 이미 찜한 경우 -> 찜 해제
      const result = await unfollowTemple(userId, templeId);
      return !result; // unfollowTemple이 성공하면 false 반환 (찜 해제됨)
    } else {
      // 찜하지 않은 경우 -> 찜하기
      const result = await followTemple(userId, templeId);
      return result; // followTemple이 성공하면 true 반환 (찜 추가됨)
    }
  } catch (error) {
    console.error('Error in toggleTempleFollow:', error);
    return false;
  }
}

// 지역별 사찰 검색 기능
export async function searchTemplesByRegion(region: string): Promise<Temple[]> {
  try {
    const normalizedRegion = normalizeRegionToProvince(region);
    
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .ilike('region', `%${normalizedRegion}%`);
      
    if (error) {
      console.error('Error searching temples by region:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      address: item.address || item.region || '',
      region: item.region || '',
      contact: item.contact || '',
      imageUrl: item.image_url || DEFAULT_IMAGES.TEMPLE,
      image_url: item.image_url || DEFAULT_IMAGES.TEMPLE,
      description: item.description,
      likeCount: item.follower_count,
      latitude: item.latitude,
      longitude: item.longitude,
      facilities: item.facilities ? JSON.parse(item.facilities) : [],
      tags: item.tags ? JSON.parse(item.tags) : []
    }));
  } catch (error) {
    console.error('Error in searchTemplesByRegion:', error);
    return [];
  }
}
