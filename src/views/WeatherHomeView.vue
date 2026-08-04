<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { weatherList } from '../data/weatherMock.js'
import { findNearestCity } from '../utils/geo.js'

const router = useRouter()

// 반응형 상태 (기존 WeatherParent와 동일)
const searchQuery = ref('')
const statusMessage = ref('')
const locating = ref(false)

const filteredList = computed(() => {
  if (!searchQuery.value) return weatherList
  return weatherList.filter((city) => city.name.includes(searchQuery.value))
})

const handleUpdateQuery = (query) => {
  searchQuery.value = query
}

const selectCity = (city) => {
  statusMessage.value = `${city.name}이 선택되었습니다.`
}

// 기존에는 window.alert로 상세 정보를 띄웠지만,
// 이제는 상세 페이지(/weather/:cityId)로 Programmatic Navigation 한다.
const showDetail = (city) => {
  router.push(`/weather/${city.id}`)
}

// 검색은 그대로 두고, 별도 버튼으로 위치 기반 날씨 보기를 제공한다.
// 좌표를 받아 Mock 데이터 중 가장 가까운 도시를 찾아 상세 페이지로 이동한다.
const findNearMe = () => {
  if (!navigator.geolocation) {
    statusMessage.value = '이 브라우저는 위치 정보를 지원하지 않습니다.'
    return
  }

  locating.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      locating.value = false
      const { latitude, longitude } = position.coords
      const nearest = findNearestCity(latitude, longitude, weatherList)
      if (nearest) {
        router.push(`/weather/${nearest.city.id}`)
      }
    },
    () => {
      locating.value = false
      statusMessage.value = '위치 정보를 가져올 수 없습니다. 브라우저 위치 권한을 확인해주세요.'
    },
    { timeout: 10000 },
  )
}
</script>

<template>
  <div class="weather-home">
    <h1>🌤️ 날씨 Mockup</h1>

    <BaseDashboardCard title="도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
      <button class="locate-btn" :disabled="locating" @click="findNearMe">
        {{ locating ? '위치 확인 중…' : '📍 내 위치로 날씨 보기' }}
      </button>
    </BaseDashboardCard>

    <BaseDashboardCard title="지역별 날씨 현황">
      <div class="card-list" v-if="filteredList.length > 0">
        <WeatherCard
          v-for="city in filteredList"
          :key="city.id"
          :city="city"
          @select-card="selectCity"
          @click-detail="showDetail"
        />
      </div>
      <p class="empty" v-else>검색 결과가 없습니다.</p>
    </BaseDashboardCard>

    <div class="status-bar">{{ statusMessage }}</div>
  </div>
</template>

<style scoped>
.weather-home {
  max-width: 720px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 24px;
}

.locate-btn {
  display: block;
  width: 100%;
  max-width: 320px;
  margin: 12px auto 0;
  padding: 9px 0;
  border: 1px solid #2f6fed;
  border-radius: 8px;
  background: #fff;
  color: #2f6fed;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.locate-btn:hover:not(:disabled) {
  background: #eef3ff;
}

.locate-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
  margin: 0;
}

.status-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #222;
  color: #fff;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  min-height: 20px;
}
</style>
