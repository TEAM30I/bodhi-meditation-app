// 주소를 좌표로 변환하는 유틸리티 함수 (Kakao Maps API 사용)
export async function addressToCoords(address: string): Promise<{latitude: number, longitude: number} | null> {
  // Kakao Maps API가 로드되었는지 확인
  if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
    console.error('Kakao Maps API가 로드되지 않았습니다.');
    return null;
  }

  return new Promise((resolve) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    
    geocoder.addressSearch(address, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        resolve({
          latitude: parseFloat(result[0].y),
          longitude: parseFloat(result[0].x)
        });
      } else {
        console.error('주소 변환 실패:', address);
        resolve(null);
      }
    });
  });
} 