// 두 좌표 사이의 거리(km)를 구하는 하버사인 공식.
export function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const earthRadiusKm = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

// 주어진 좌표에서 가장 가까운 도시를 cities 배열에서 찾는다.
export function findNearestCity(lat, lng, cities) {
  return cities.reduce((closest, city) => {
    const distance = haversineDistanceKm(lat, lng, city.lat, city.lng)
    if (!closest || distance < closest.distance) {
      return { city, distance }
    }
    return closest
  }, null)
}
