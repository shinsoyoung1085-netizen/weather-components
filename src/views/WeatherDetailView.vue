<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import WeatherInfoCard from '../components/exercise/WeatherInfoCard.vue'
import { weatherList } from '../data/weatherMock.js'
import { useConfigStore } from '../stores/configStore.js'

const route = useRoute()
const configStore = useConfigStore()

// Mount 시점에 라우트 동적 세그먼트(cityId)를 기반으로 Mock Data에서 도시를 찾는다.
const city = ref(null)
const notFound = ref(false)

onMounted(() => {
  const matched = weatherList.find((c) => c.id === route.params.cityId)
  if (matched) {
    city.value = matched
  } else {
    notFound.value = true
  }
})

const displayTemp = computed(() => {
  if (!city.value) return null
  const rawTemp = city.value.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})
</script>

<template>
  <div class="weather-detail">
    <BaseDashboardCard v-if="city" :title="`🗺️ ${city.name} 상세 기상관측`">
      <WeatherInfoCard
        :location="city.name"
        :temp="displayTemp"
        :unit-symbol="configStore.unitSymbol"
        :status="city.status"
      />

      <div class="detail-main">
        <span class="label" :class="city.temp >= 25 ? 'hot' : 'cool'">
          {{ city.temp >= 25 ? '🔥 더움 (25도 이상)' : '❄️ 선선함 (25도 미만)' }}
        </span>
      </div>

      <dl class="observation-list">
        <div class="observation-row">
          <dt>도시 코드</dt>
          <dd>{{ city.id }}</dd>
        </div>
        <div class="observation-row">
          <dt>현재 날씨</dt>
          <dd>{{ city.status }}</dd>
        </div>
        <div class="observation-row">
          <dt>현재 기온</dt>
          <dd>{{ displayTemp }}{{ configStore.unitSymbol }}</dd>
        </div>
      </dl>

      <RouterLink to="/" class="back-link">← 홈으로 돌아가기</RouterLink>
    </BaseDashboardCard>

    <BaseDashboardCard v-else-if="notFound" title="도시를 찾을 수 없습니다">
      <p class="not-found-text">
        요청하신 도시 코드(<strong>{{ route.params.cityId }}</strong>)에 해당하는 날씨 정보가 없습니다.
      </p>
      <RouterLink to="/" class="back-link">← 홈으로 돌아가기</RouterLink>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.weather-detail {
  max-width: 720px;
  margin: 0 auto;
}

.detail-main {
  margin: 16px 0 20px;
}

.label {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.label.hot {
  background: #ffe3e0;
  color: #d3402b;
}

.label.cool {
  background: #e0f0ff;
  color: #1c6fc9;
}

.observation-list {
  margin: 0 0 20px;
}

.observation-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.observation-row dt {
  color: #888;
}

.observation-row dd {
  margin: 0;
  font-weight: 600;
}

.not-found-text {
  color: #666;
  margin-bottom: 20px;
}

.back-link {
  display: inline-block;
  color: #2f6fed;
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
