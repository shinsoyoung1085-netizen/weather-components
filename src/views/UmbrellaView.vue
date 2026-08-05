<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import { weatherList } from '../data/weatherMock.js'
import { findNearestCity, haversineDistanceKm } from '../utils/geo.js'
import { reverseGeocode } from '../utils/kakaoGeocoder.js'
import { useConfigStore } from '../stores/configStore.js'

const configStore = useConfigStore()

// 홈/상세 화면과 동일한 weatherMock.js 데이터를 그대로 사용한다.
// 각 도시의 rain 필드가 카운트다운/게이지/타임라인을 그대로 채운다 — 별도의
// 가짜 시나리오를 만들지 않고, 앱 전체가 하나의 데이터 소스를 공유한다.
const selectedCityId = ref(weatherList[0].id)
const selectedCity = computed(
  () => weatherList.find((c) => c.id === selectedCityId.value) ?? weatherList[0],
)
const current = computed(() => selectedCity.value.rain)
const timeline = computed(() => selectedCity.value.rain.timeline)

// configStore(온도 단위 토글)도 홈/상세 화면과 동일하게 반영된다.
const displayTemp = computed(() => {
  const rawTemp = selectedCity.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

// 위치 권한을 허용하면 GPS 좌표를 카카오 API로 실제 주소로 바꾸고,
// 강수 예보는 그 좌표와 가장 가까운 mock 도시(weatherList) 데이터를 그대로 쓴다.
const locating = ref(false)
const locationStatus = ref('')
const realAddress = ref('')

function useMyLocation() {
  if (!navigator.geolocation) {
    locationStatus.value = '이 브라우저는 위치 정보를 지원하지 않습니다.'
    return
  }

  locating.value = true
  locationStatus.value = ''
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      const nearest = findNearestCity(latitude, longitude, weatherList)
      if (nearest) {
        selectedCityId.value = nearest.city.id
        locationStatus.value = `강수 예보 기준 관측 지점: ${nearest.city.name} (약 ${nearest.distance.toFixed(1)}km)`
      }

      try {
        realAddress.value = await reverseGeocode(latitude, longitude)
      } catch (err) {
        console.error('[kakao geocode error]', err)
        realAddress.value = ''
      } finally {
        locating.value = false
      }
    },
    (error) => {
      locating.value = false
      console.error('[geolocation error]', error.code, error.message)
      if (error.code === error.PERMISSION_DENIED) {
        locationStatus.value =
          '위치 권한이 차단되어 있습니다. 주소창 왼쪽 아이콘에서 이 사이트의 위치 권한을 "허용"으로 바꿔주세요.'
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        locationStatus.value =
          '위치를 확인할 수 없습니다. macOS 시스템 설정 > 개인정보 보호 및 보안 > 위치 서비스가 켜져 있는지, 사용 중인 브라우저에 권한이 있는지 확인해주세요.'
      } else if (error.code === error.TIMEOUT) {
        locationStatus.value = '위치 확인이 시간 초과되었습니다. 다시 시도해주세요.'
      } else {
        locationStatus.value = '위치 정보를 가져올 수 없습니다. 브라우저 위치 권한을 확인해주세요.'
      }
    },
    { timeout: 10000 },
  )
}

const levelColor = { clear: '#3f9c6d', caution: '#c8842a', alert: '#d3402b' }
const levelSoft = { clear: '#dcf0e6', caution: '#f7e8d2', alert: '#ffe3e0' }
const barColor = ['#e5e7eb', '#3f9c6d', '#c8842a', '#d3402b']
const barHeight = [4, 30, 62, 96]

// el-progress color: 30% 이하 파랑 / 70% 이하 주황 / 70% 초과 빨강
function gaugeProgressColor(percentage) {
  if (percentage <= 30) return '#409eff'
  if (percentage <= 70) return '#e6a23c'
  return '#f56c6c'
}

const notificationPrefs = ref({
  countdown: true,
  commute: true,
  rainStop: true,
  umbrellaLost: true,
})

const notificationPrefList = [
  { key: 'countdown', label: '초단기 카운트다운 알림' },
  { key: 'commute', label: '출퇴근 스마트 알림' },
  { key: 'rainStop', label: '비 그침 예측 알림' },
  { key: 'umbrellaLost', label: '우산 분실 방지 팝업' },
]

// el-time-picker와 바인딩되는 출퇴근 시간 (value-format="HH:mm" 문자열로 유지)
const departureTime = ref('07:30')
const returnTime = ref('18:30')

// 실내(집/회사 등)에서 밖으로 나가는 순간을 감지해, 우산을 챙겼는지 되묻는 알림.
// 실제 앱은 Wi-Fi 연결 해제로 감지하지만, 웹에서는 Wi-Fi 상태에 접근할 수 없으므로
// "등록해둔 집 좌표 반경을 벗어나는 순간"을 GPS로 감지해 대신한다.
function triggerLeaveToast() {
  ElNotification({
    title: '☂️ 우산 알림',
    message: '외출이 감지되었습니다! 우산을 챙겼는지 확인하세요.',
    type: 'warning',
  })
}

const LEAVE_RADIUS_KM = 0.15 // 150m
const homeLocation = ref(null) // { lat, lng }
const registeringHome = ref(false)
const homeStatus = ref('')
let wasInsideRadius = true
let watchId = null

function registerHomeLocation() {
  if (!navigator.geolocation) {
    homeStatus.value = '이 브라우저는 위치 정보를 지원하지 않습니다.'
    return
  }

  registeringHome.value = true
  homeStatus.value = ''
  navigator.geolocation.getCurrentPosition(
    (position) => {
      registeringHome.value = false
      homeLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      wasInsideRadius = true
      startWatchingLeave()
      ElMessage.success('현재 위치가 집으로 등록되었습니다.')
    },
    () => {
      registeringHome.value = false
      homeStatus.value = '집 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.'
    },
    { timeout: 10000 },
  )
}

function startWatchingLeave() {
  if (!navigator.geolocation || !homeLocation.value) return
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const dist = haversineDistanceKm(
        homeLocation.value.lat,
        homeLocation.value.lng,
        position.coords.latitude,
        position.coords.longitude,
      )
      const inside = dist <= LEAVE_RADIUS_KM
      if (!inside && wasInsideRadius) {
        triggerLeaveToast() // 반경을 벗어난 순간 = 외출로 간주
      }
      wasInsideRadius = inside
    },
    (error) => {
      console.error('[watchPosition error]', error.code, error.message)
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
  )
}

function clearHomeLocation() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
  }
  homeLocation.value = null
  homeStatus.value = ''
}

onUnmounted(() => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
  }
})
</script>

<template>
  <div class="umbrella-view">
    <h1>☂️ 우산 챙겨</h1>
    <p class="page-desc">
      GPS 기반 초단기 강수 카운트다운으로 출퇴근길 비 소식을 미리 알려주는 신규 기능입니다.
    </p>

    <BaseDashboardCard title="위치 설정">
      <div class="location-row">
        <span class="location-label">
          📍 {{ realAddress || selectedCity.name }}
        </span>
        <button class="locate-btn-small" :disabled="locating" @click="useMyLocation">
          {{ locating ? '위치 확인 중…' : '내 위치 사용' }}
        </button>
      </div>
      <p class="location-weather">
        {{ selectedCity.name }} 기준 · {{ displayTemp }}{{ configStore.unitSymbol }} ·
        {{ selectedCity.status }}
      </p>
      <p v-if="locationStatus" class="location-status">{{ locationStatus }}</p>

      <div class="city-grid">
        <button
          v-for="city in weatherList"
          :key="city.id"
          class="city-btn"
          :class="{ active: selectedCityId === city.id }"
          @click="selectedCityId = city.id"
        >
          {{ city.name }}
        </button>
      </div>
    </BaseDashboardCard>

    <p class="live-note">
      홈 화면과 같은 도시 목업 데이터(weatherMock.js)에서 비 예보를 가져옵니다. 실제
      서비스에서는 기상청 초단기예보 API와 GPS로 대체됩니다.
    </p>

    <BaseDashboardCard title="강수 카운트다운">
      <div class="countdown">
        <div class="countdown-status">{{ current.status }}</div>
        <div class="countdown-number">
          {{ current.number }}<span class="countdown-unit">{{ current.unit }}</span>
        </div>
        <div class="countdown-detail">{{ current.detail }}</div>
        <span
          class="chip"
          :style="{ color: levelColor[current.level], background: levelSoft[current.level] }"
        >
          {{ current.intensity }}
        </span>
      </div>
    </BaseDashboardCard>

    <BaseDashboardCard title="우산 필요 지수">
      <div class="gauge-dashboard">
        <el-progress
          type="dashboard"
          :percentage="current.gauge"
          :color="gaugeProgressColor"
          :stroke-width="10"
        >
          <template #default="{ percentage }">
            <div class="gauge-center">
              <span class="gauge-center-percent">{{ percentage }}%</span>
              <span class="gauge-center-label">우산 필요 지수</span>
            </div>
          </template>
        </el-progress>
      </div>
      <p class="gauge-desc">{{ current.gaugeDesc }}</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="60분 강수 추이">
      <div class="timeline-bars">
        <div v-for="(level, i) in timeline" :key="i" class="bar-col">
          <div
            class="bar"
            :style="{ height: barHeight[level] + '%', background: barColor[level] }"
          ></div>
        </div>
      </div>
      <div class="timeline-scale">
        <span>지금</span>
        <span>+20분</span>
        <span>+40분</span>
        <span>+60분</span>
      </div>
    </BaseDashboardCard>

    <BaseDashboardCard title="알림 설정">
      <el-form label-position="top" class="notif-form">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="출근 준비 시간">
              <el-time-picker
                v-model="departureTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="시간 선택"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="퇴근 시간">
              <el-time-picker
                v-model="returnTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="시간 선택"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          v-for="pref in notificationPrefList"
          :key="pref.key"
          class="switch-form-item"
        >
          <div class="switch-row">
            <span class="switch-row-label">{{ pref.label }}</span>
            <el-switch v-model="notificationPrefs[pref.key]" />
          </div>
        </el-form-item>
      </el-form>
    </BaseDashboardCard>

    <BaseDashboardCard title="외출 감지">
      <p class="indoor-note">
        실내(집·회사 등)에서 밖으로 나가는 순간을 감지해 우산을 챙겼는지 되묻는 기능입니다.
        실제 앱은 Wi-Fi 연결 해제로 감지하지만, 웹에서는 Wi-Fi 상태에 접근할 수 없어 집
        좌표를 등록해두고 GPS로 반경 150m 이탈을 감지합니다.
      </p>

      <div v-if="homeLocation" class="home-status">
        <span>🏠 집 위치 등록됨 · 반경 150m 이탈 실시간 감시 중</span>
        <el-button link type="danger" @click="clearHomeLocation">초기화</el-button>
      </div>
      <el-button
        v-else
        type="primary"
        class="indoor-full-btn"
        :loading="registeringHome"
        @click="registerHomeLocation"
      >
        📍 현재 위치를 집으로 등록
      </el-button>
      <p v-if="homeStatus" class="location-status">{{ homeStatus }}</p>

      <el-button type="warning" class="indoor-full-btn secondary" @click="triggerLeaveToast">
        🚪 외출 감지 수동 시뮬레이션
      </el-button>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.umbrella-view {
  max-width: 720px;
  margin: 0 auto;
  padding-bottom: 40px;
}

h1 {
  text-align: center;
  margin-bottom: 8px;
}

.page-desc {
  text-align: center;
  color: #666;
  margin: 0 0 24px;
  font-size: 14px;
}

.location-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.location-label {
  font-size: 14.5px;
  font-weight: 700;
}

.locate-btn-small {
  flex: none;
  padding: 8px 14px;
  border: 1px solid #2f6fed;
  border-radius: 8px;
  background: #fff;
  color: #2f6fed;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.locate-btn-small:hover:not(:disabled) {
  background: #eef3ff;
}

.locate-btn-small:disabled {
  opacity: 0.6;
  cursor: default;
}

.location-weather {
  margin: 8px 0 0;
  font-size: 13px;
  color: #666;
}

.location-status {
  margin: 6px 0 0;
  font-size: 12.5px;
  color: #999;
}

.city-grid {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.city-btn {
  flex: 1;
  padding: 8px 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafbfc;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.city-btn:hover {
  border-color: #2f6fed;
}

.city-btn.active {
  border-color: #2f6fed;
  background: #eef3ff;
  color: #2f6fed;
}

.live-note {
  margin: 0 0 16px;
  font-size: 13px;
  color: #999;
  line-height: 1.5;
  text-align: center;
}

.indoor-note {
  margin: 0 0 14px;
  font-size: 13px;
  color: #999;
  line-height: 1.5;
}

.indoor-full-btn {
  width: 100%;
}

.indoor-full-btn.secondary {
  margin-top: 10px;
}

.home-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #eef3ff;
  color: #2f6fed;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
}

.countdown {
  text-align: center;
  padding: 10px 0 4px;
}

.countdown-status {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.countdown-number {
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.countdown-unit {
  font-size: 15px;
  font-weight: 600;
  color: #999;
  margin-left: 4px;
}

.countdown-detail {
  margin-top: 10px;
  font-size: 13px;
  color: #666;
}

.chip {
  display: inline-block;
  margin-top: 14px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.gauge-dashboard {
  display: flex;
  justify-content: center;
  padding: 6px 0 4px;
}

.gauge-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.gauge-center-percent {
  font-size: 26px;
  font-weight: 700;
  color: #111;
}

.gauge-center-label {
  font-size: 12px;
  font-weight: 600;
  color: #999;
}

.gauge-desc {
  margin: 12px 0 0;
  font-size: 13px;
  color: #666;
}

.timeline-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 56px;
}

.bar-col {
  flex: 1;
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.bar {
  width: 100%;
  border-radius: 3px;
  transition: height 0.4s ease, background 0.3s ease;
}

.timeline-scale {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 11px;
  color: #999;
}

.notif-form {
  margin-top: 4px;
}

.notif-form :deep(.el-form-item) {
  margin-bottom: 14px;
}

.switch-form-item :deep(.el-form-item__content) {
  width: 100%;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}

.switch-row-label {
  font-size: 13px;
  font-weight: 600;
  color: #222;
}
</style>
