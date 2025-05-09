// src/lib/repository/templeRepository.ts
import { supabase } from '@/lib/supabase';
import { calculateDistance, formatDistance, sortByDistance } from '@/utils/locationUtils';
import { Temple, TempleSort, RegionTag } from '@/types';
import { DEFAULT_LOCATION } from '@/constants';
import { DEFAULT_IMAGES } from '@/constants';

// 지역명을 광역시/도 단위로 정규화하는 함수
function normalizeRegionToProvince(region: string): string {
  // 도/시 약칭 매핑
  const regionMappings: Record<string, string> = {
    '강원특별자치도': '강원',
    '경기도': '경기',
    '경상남도': '경남',
    '경상북도': '경북',
    '전라남도': '전남',
    '전라북도': '전북',
    '충청남도': '충남',
    '충청북도': '충북',
    '제주특별자치도': '제주',
    '서울특별시': '서울',
    '부산광역시': '부산',
    '대구광역시': '대구',
    '인천광역시': '인천',
    '광주광역시': '광주',
    '대전광역시': '대전',
    '울산광역시': '울산',
    '세종특별자치시': '세종'
  };

  // 시/군/구 단위 제거를 위한 정규식
  const cityRegex = /(시|군|구)$/;
  
  // 전체 지역명에서 도/시 부분 추출
  for (const [fullName, shortName] of Object.entries(regionMappings)) {
    if (region.includes(fullName)) {
      return shortName;
    }
  }

  // 특별시/광역시 처리
  if (region.endsWith('특별시') || region.endsWith('광역시')) {
    return region.replace(/(특별시|광역시)$/, '');
  }

  // 시/군/구가 포함된 경우 도/시 단위로 변환
  const provinceMatch = region.match(/^(.*?)(시|도|특별자치도)/);
  if (provinceMatch) {
    const province = provinceMatch[1];
    // 도/시 약칭 매핑에서 찾기
    for (const [fullName, shortName] of Object.entries(regionMappings)) {
      if (fullName.includes(province)) {
        return shortName;
      }
    }
  }

  // 기본값 반환
  return region;
}

// 사찰 지역 목록 가져오기 (광역시/도 단위로 그룹화)
export async function getTempleRegions(): Promise<string[]> {
  // 기본 지역 목록 정의
  const defaultRegions = [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
  ];

  try {
    const { data, error } = await supabase
      .from('temples')
      .select('region')
      .not('region', 'is', null);
    
    if (error) {
      console.error('Error fetching temple regions:', error);
      return defaultRegions;
    }
    
    // 모든 지역을 광역시/도 단위로 정규화
    const normalizedRegions = data
      .map(item => normalizeRegionToProvince(item.region || ''))
      .filter(Boolean); // 빈 문자열 제거
    
    // 중복 제거 및 정렬
    const uniqueRegions = [...new Set(normalizedRegions)].sort();
    
    return uniqueRegions.length > 0 ? uniqueRegions : defaultRegions;
  } catch (error) {
    console.error('Error in getTempleRegions:', error);
    return defaultRegions;
  }
}

// Supabase 데이터베이스에서 사찰 목록 가져오기
export async function searchTemples(query: string = '', sortBy: TempleSort = 'popular'): Promise<Temple[]> {
  try {
    // 모든 사찰 데이터 가져오기
    const { data, error } = await supabase
      .from('temples')
      .select('*');
      
    if (error) {
      console.error('Error searching temples:', error);
      return [];
    }
    
    // 검색어가 없으면 모든 데이터 반환
    let filteredData = data;
    
    // 검색어가 있는 경우에만 필터링 수행
    if (query) {
      // 지역명 검색을 위한 정규화된 쿼리 생성
      const normalizedQuery = query.trim().toLowerCase();
      
      // 지역명 약어 매핑 (예: 경상북도 -> 경북)
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
      
      // 검색어 확장 (예: '경북'으로 검색 시 '경상북도'도 포함)
      let expandedQueries = [normalizedQuery];
      
      // 지역명 매핑에서 검색어와 일치하는 항목 찾기
      for (const [fullName, shortNames] of Object.entries(regionMappings)) {
        // 전체 이름이 검색어를 포함하는 경우 (예: '경상북도'에 '경북' 포함)
        if (fullName.toLowerCase().includes(normalizedQuery)) {
          expandedQueries.push(fullName.toLowerCase());
          expandedQueries.push(...shortNames.map(name => name.toLowerCase()));
        }
        
        // 약어가 검색어를 포함하는 경우 (예: '경북'에 '경' 포함)
        if (shortNames.some(name => name.toLowerCase().includes(normalizedQuery))) {
          expandedQueries.push(fullName.toLowerCase());
          expandedQueries.push(...shortNames.map(name => name.toLowerCase()));
        }
      }
      
      // 중복 제거
      expandedQueries = [...new Set(expandedQueries)];
      
      // 클라이언트 측에서 필터링
      filteredData = data.filter(item => {
        // 사찰 이름으로 검색
        if (item.name && item.name.toLowerCase().includes(normalizedQuery)) {
          return true;
        }
        
        // 지역명으로 검색 (확장된 쿼리 사용)
        if (item.region) {
          const normalizedRegion = item.region.toLowerCase();
          if (expandedQueries.some(q => normalizedRegion.includes(q))) {
            return true;
          }
        }
        
        // 주소로 검색
        if (item.address && item.address.toLowerCase().includes(normalizedQuery)) {
          return true;
        }
        
        return false;
      });
    }
    
    // 정렬 적용
    let sortedData = [...filteredData];
    
    if (sortBy === 'popular') {
      sortedData.sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0));
    } 
    else if (sortBy === 'distance') {
      // 위치 기반 정렬 로직 개선
      const templesWithLocation = sortedData.filter(temple => temple.latitude && temple.longitude);
      
      if (templesWithLocation.length > 0) {
        // 새로운 sortByDistance 함수 사용
        const sortedTemples = await sortByDistance(templesWithLocation);
        
        // 위치 정보가 없는 사찰은 뒤에 추가
        const templesWithoutLocation = sortedData.filter(temple => !temple.latitude || !temple.longitude);
        sortedData = [...sortedTemples, ...templesWithoutLocation];
      }
    }
    
    return sortedData.map(item => ({
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

/**
 * 사용자가 특정 사찰을 찜했는지 확인하는 함수
 * @param userId 사용자 ID
 * @param templeId 사찰 ID
 * @returns 찜 여부 (true/false)
 */
export const isTempleFollowed = async (userId: string, templeId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_follow_temples')
      .select('*')
      .eq('user_id', userId)
      .eq('temple_id', templeId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking temple follow status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking temple follow status:', error);
    return false;
  }
};

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

// 인기 사찰 목록 가져오기 (팔로워 수 기준)
export async function getTopLikedTemples(limit: number = 10): Promise<Temple[]> {
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
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      address: item.address || '',
      region: item.region || '',
      contact: item.contact || '',
      description: item.description,
      imageUrl: item.image_url,
      image_url: item.image_url,
      likeCount: item.follower_count || 0,
      follower_count: item.follower_count || 0,
      latitude: item.latitude,
      longitude: item.longitude,
      // 선택적 필드들
      facilities: item.facilities ? JSON.parse(item.facilities) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
      websiteUrl: item.website_url
    }));
  } catch (error) {
    console.error('Error in getTopLikedTemples:', error);
    return [];
  }
}

// 특정 좌표 주변의 사찰 검색
export async function searchNearbyTemples(
  latitude: number, 
  longitude: number, 
  radius: number = 50, // 기본 반경 50km
  limit: number = 10
): Promise<Temple[]> {
  try {
    // 모든 사찰 데이터 가져오기
    const { data, error } = await supabase
      .from('temples')
      .select('*');
      
    if (error) {
      console.error('Error fetching temples:', error);
      return [];
    }
    
    // 각 사찰의 거리 계산
    const templesWithDistance = data.map(temple => {
      if (temple.latitude && temple.longitude) {
        const distance = calculateDistance(
          latitude,
          longitude,
          temple.latitude,
          temple.longitude
        );
        
        return {
          ...temple,
          distance: formatDistance(distance),
          distanceValue: distance
        };
      }
      return { ...temple, distanceValue: Infinity };
    });
    
    // 거리 기준으로 정렬하고 반경 내의 사찰만 필터링
    return templesWithDistance
      .filter(temple => temple.distanceValue <= radius)
      .sort((a, b) => a.distanceValue - b.distanceValue)
      .slice(0, limit)
      .map(temple => ({
        id: temple.id,
        name: temple.name,
        address: temple.address || '',
        region: temple.region || '',
        contact: temple.contact || '',
        description: temple.description,
        imageUrl: temple.image_url,
        image_url: temple.image_url,
        likeCount: temple.follower_count || 0,
        follower_count: temple.follower_count || 0,
        latitude: temple.latitude,
        longitude: temple.longitude,
        distance: temple.distance,
        // 선택적 필드들
        facilities: temple.facilities ? JSON.parse(temple.facilities) : [],
        tags: temple.tags ? JSON.parse(temple.tags) : [],
        websiteUrl: temple.website_url
      }));
  } catch (error) {
    console.error('Error in searchNearbyTemples:', error);
    return [];
  }
}
