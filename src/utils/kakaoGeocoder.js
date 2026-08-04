// 카카오 지도 JS SDK를 동적으로 로드하고, GPS 좌표를 실제 주소로 변환한다.
// SDK는 <script> 태그로 로드하는 방식이라 브라우저에서 CORS 문제 없이 바로 쓸 수 있다.
let loadPromise = null

function loadKakaoSdk() {
  if (window.kakao && window.kakao.maps) {
    return Promise.resolve(window.kakao)
  }
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const appKey = import.meta.env.VITE_KAKAO_APP_KEY
    if (!appKey) {
      reject(new Error('VITE_KAKAO_APP_KEY가 설정되지 않았습니다. .env.local을 확인해주세요.'))
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao))
    }
    script.onerror = () => {
      loadPromise = null
      reject(new Error('카카오 지도 SDK 로드에 실패했습니다.'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}

// lat/lng(위도/경도) → 실제 도로명 주소 문자열로 변환한다.
export async function reverseGeocode(lat, lng) {
  const kakao = await loadKakaoSdk()
  const geocoder = new kakao.maps.services.Geocoder()

  return new Promise((resolve, reject) => {
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const item = result[0]
        const address = item?.road_address?.address_name || item?.address?.address_name
        if (address) {
          resolve(address)
        } else {
          reject(new Error('주소 정보를 찾을 수 없습니다.'))
        }
      } else {
        reject(new Error('좌표를 주소로 변환하지 못했습니다.'))
      }
    })
  })
}
