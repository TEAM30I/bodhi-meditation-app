// 지도 초기화 함수를 정적 이미지로 대체
const renderStaticMap = (lat: number, lng: number) => {
  if (!mapRef.current) return;
  
  // 반경 설정 (16km)
  const radius = 16;
  
  // 지도 컨테이너에 정적 이미지 삽입
  mapRef.current.innerHTML = `
    <div class="relative w-full h-full">
      <div class="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <!-- 정적 지도 이미지 -->
        <div class="w-full h-full bg-gray-100 relative overflow-hidden">
          <!-- 지도 이미지 (카카오맵 정적 이미지 API 사용) -->
          <img 
            src="https://map.kakao.com/link/map/${lat},${lng}/8" 
            alt="지도 이미지" 
            class="w-full h-full object-cover"
          />
          
          <!-- 중앙 마커 -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div style="padding:5px; background:#fff; border-radius:50%; border:2px solid #FF3B30; display:flex; justify-content:center; align-items:center; width:24px; height:24px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
              <div style="background:#FF3B30; width:12px; height:12px; border-radius:50%;"></div>
            </div>
          </div>
          
          <!-- 반경 원 표시 -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[#DE7834] bg-[#DE7834] bg-opacity-10"></div>
          
          <!-- 사찰 마커들 (nearbyTemples 데이터 기반) -->
          ${nearbyTemples.map(temple => {
            if (!temple.latitude || !temple.longitude) return '';
            
            // 현재 위치와 사찰 위치 간의 상대적 위치 계산
            const relativeX = (temple.longitude - lng) / (radius / 100) * 50;
            const relativeY = (lat - temple.latitude) / (radius / 100) * 50;
            
            return `
              <div class="absolute" style="top: calc(50% + ${relativeY}%); left: calc(50% + ${relativeX}%);">
                <div style="width: 10px; height: 10px; background-color: #DE7834; border-radius: 50%; transform: translate(-50%, -50%);"></div>
              </div>
            `;
          }).join('')}
          
          <!-- 템플스테이 마커들 (nearbyTempleStays 데이터 기반) -->
          ${nearbyTempleStays.map(templeStay => {
            if (!templeStay.latitude || !templeStay.longitude) return '';
            
            // 현재 위치와 템플스테이 위치 간의 상대적 위치 계산
            const relativeX = (templeStay.longitude - lng) / (radius / 100) * 50;
            const relativeY = (lat - templeStay.latitude) / (radius / 100) * 50;
            
            return `
              <div class="absolute" style="top: calc(50% + ${relativeY}%); left: calc(50% + ${relativeX}%);">
                <div style="width: 10px; height: 10px; background-color: #4A90E2; border-radius: 50%; transform: translate(-50%, -50%);"></div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- 클릭 오버레이 -->
      <div class="absolute inset-0 cursor-pointer" id="map-overlay"></div>
      
      <!-- 지도 확대 버튼 -->
      <div class="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md">
        <button id="view-map-btn" class="flex items-center justify-center text-sm text-gray-700">
          <span class="material-icons text-lg mr-1">fullscreen</span>
          지도 확대
        </button>
      </div>
    </div>
  `;
  
  // 클릭 이벤트 추가
  const overlay = document.getElementById('map-overlay');
  const viewMapBtn = document.getElementById('view-map-btn');
  
  if (overlay) {
    overlay.addEventListener('click', () => navigate('/search/temple/map'));
  }
  
  if (viewMapBtn) {
    viewMapBtn.addEventListener('click', () => navigate('/search/temple/map'));
  }
};

// 위치 정보 가져오기 성공 시 주변 사찰/템플스테이 검색 및 지도 렌더링
const handleLocationSuccess = async (position: GeolocationPosition) => {
  try {
    const { latitude, longitude } = position.coords;
    setUserLocation({ latitude, longitude });
    
    // 주변 사찰 검색 (16km 반경)
    const temples = await searchNearbyTemples(latitude, longitude, 16);
    
    // 주변 템플스테이 검색 (16km 반경)
    const templeStays = await searchNearbyTempleStays(latitude, longitude, 16);
    
    // 거리 계산 및 정렬
    const templesWithDistance = temples.map(temple => {
      const distance = calculateDistance(
        latitude, longitude, 
        temple.latitude || 0, 
        temple.longitude || 0
      );
      return {
        ...temple,
        distance: formatDistance(distance)
      };
    }).sort((a, b) => {
      const distA = parseFloat(a.distance?.replace('km', '').trim() || '0');
      const distB = parseFloat(b.distance?.replace('km', '').trim() || '0');
      return distA - distB;
    });
    
    const templeStaysWithDistance = templeStays.map(templeStay => {
      const distance = calculateDistance(
        latitude, longitude, 
        templeStay.latitude || 0, 
        templeStay.longitude || 0
      );
      return {
        ...templeStay,
        distance: formatDistance(distance)
      };
    }).sort((a, b) => {
      const distA = parseFloat(a.distance?.replace('km', '').trim() || '0');
      const distB = parseFloat(b.distance?.replace('km', '').trim() || '0');
      return distA - distB;
    });
    
    setNearbyTemples(templesWithDistance);
    setNearbyTempleStays(templeStaysWithDistance);
    
    // 정적 지도 렌더링
    renderStaticMap(latitude, longitude);
    
    // 좋아요 상태 확인
    if (user) {
      checkLikedStatus(templesWithDistance, templeStaysWithDistance);
    }
    
    setLoading(false);
  } catch (error) {
    console.error('주변 검색 오류:', error);
    toast.error('주변 검색에 실패했습니다.');
    setLoading(false);
  }
};

// 좋아요 상태 확인 함수
const checkLikedStatus = async (temples: Temple[], templeStays: TempleStay[]) => {
  try {
    const templeStatus: Record<string, boolean> = {};
    const templeStayStatus: Record<string, boolean> = {};
    
    for (const temple of temples) {
      try {
        templeStatus[temple.id] = await isTempleFollowed(user.id, temple.id);
      } catch (error) {
        console.error(`사찰 좋아요 상태 확인 오류 (${temple.id}):`, error);
      }
    }
    
    for (const templeStay of templeStays) {
      try {
        templeStayStatus[templeStay.id] = await isTempleStayFollowed(user.id, templeStay.id);
      } catch (error) {
        console.error(`템플스테이 좋아요 상태 확인 오류 (${templeStay.id}):`, error);
      }
    }
    
    setLikedTemples(templeStatus);
    setLikedTempleStays(templeStayStatus);
  } catch (error) {
    console.error('좋아요 상태 확인 오류:', error);
  }
}; 