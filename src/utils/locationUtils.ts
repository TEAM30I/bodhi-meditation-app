// Utility functions for location-based features
import { DEFAULT_LOCATION } from '@/constants';

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

// Get current location of the user
export async function getCurrentLocation(): Promise<{latitude: number, longitude: number}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log('Geolocation이 지원되지 않는 브라우저입니다');
      resolve(DEFAULT_LOCATION); // 기본 위치 반환
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('위치 정보를 가져오는데 실패했습니다:', error);
        resolve(DEFAULT_LOCATION); // 오류 시 기본 위치 반환
      }
    );
  });
}

// 사용자 위치 기반으로 아이템 정렬하는 함수
export async function sortByDistance<T extends { latitude?: number, longitude?: number }>(
  items: T[],
  userLocation?: { latitude: number, longitude: number }
): Promise<(T & { distance: string, distanceValue: number })[]> {
  try {
    // 사용자 위치가 제공되지 않은 경우 현재 위치 가져오기
    const location = userLocation || await getCurrentLocation();
    
    // 위도와 경도가 있는 아이템만 필터링
    const validItems = items.filter(item => item.latitude && item.longitude);
    
    // 각 아이템에 거리 정보 추가
    const itemsWithDistance = validItems.map(item => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        item.latitude!,
        item.longitude!
      );
      
      return {
        ...item,
        distance: formatDistance(distance),
        distanceValue: distance // 정렬용 숫자 값
      };
    });
    
    // 거리순으로 정렬
    return itemsWithDistance.sort((a, b) => a.distanceValue - b.distanceValue);
  } catch (error) {
    console.error('위치 기반 정렬 중 오류 발생:', error);
    return items.map(item => ({
      ...item,
      distance: '알 수 없음',
      distanceValue: Infinity
    }));
  }
}
