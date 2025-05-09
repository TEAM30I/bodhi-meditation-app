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

// 사용자 현재 위치 가져오기
export const getCurrentLocation = (): Promise<{latitude: number, longitude: number}> => {
  return new Promise((resolve, reject) => {
    // 브라우저가 위치 정보를 지원하는지 확인
    if (!navigator.geolocation) {
      console.error('이 브라우저는 위치 정보를 지원하지 않습니다.');
      // 기본 위치(서울 시청) 반환
      resolve({ latitude: 37.5665, longitude: 126.9780 });
      return;
    }

    // 위치 정보 가져오기 옵션
    const options = {
      enableHighAccuracy: true,  // 높은 정확도 사용
      timeout: 10000,            // 10초 타임아웃
      maximumAge: 0              // 캐시된 위치 정보 사용 안함
    };

    // 위치 정보 가져오기 성공 시 콜백
    const success = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      console.log('위치 정보 수신 성공:', { latitude, longitude });
      resolve({ latitude, longitude });
    };

    // 위치 정보 가져오기 실패 시 콜백
    const error = (err: GeolocationPositionError) => {
      console.error('위치 정보 수신 실패:', err.message);
      
      // 오류 코드에 따른 처리
      switch(err.code) {
        case err.PERMISSION_DENIED:
          console.error('사용자가 위치 정보 접근을 거부했습니다.');
          break;
        case err.POSITION_UNAVAILABLE:
          console.error('위치 정보를 사용할 수 없습니다.');
          break;
        case err.TIMEOUT:
          console.error('위치 정보 요청 시간이 초과되었습니다.');
          break;
      }
      
      // 기본 위치(서울 시청) 반환
      resolve({ latitude: 37.5665, longitude: 126.9780 });
    };

    // 위치 정보 가져오기 요청
    navigator.geolocation.getCurrentPosition(success, error, options);
  });
};

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
