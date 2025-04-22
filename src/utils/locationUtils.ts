
// 서울특별시 관악구 신림로 72 기준 좌표
export const DEFAULT_LOCATION = {
  latitude: 37.4839864,
  longitude: 126.9295952
};

// 사용자 위치 가져오기
export async function getCurrentLocation(): Promise<{ latitude: number, longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      resolve(DEFAULT_LOCATION);
    } else {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          console.error("Error getting location:", error);
          resolve(DEFAULT_LOCATION);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    }
  });
}

// 두 좌표 사이의 거리를 계산하는 함수 (Haversine 공식)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구 반경 (km)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // 킬로미터 단위
  
  return distance;
}

// 각도를 라디안으로 변환
function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// 거리 포맷팅 (1km 미만은 m로 표시)
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
}
