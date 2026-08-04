// weatherMock.js의 status 문자열을 WeatherIcon 컴포넌트의 아이콘 타입으로 매핑한다.
const STATUS_TO_ICON = {
  맑음: 'clear',
  갬: 'clear',
  구름: 'partly-cloudy',
  흐림: 'cloudy',
  비: 'rain',
  눈: 'snow',
  번개: 'thunder',
}

export function mapStatusToIconType(status) {
  return STATUS_TO_ICON[status] ?? 'clear'
}
