<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore.js'
import WeatherIcon from './WeatherIcon.vue'
import { mapStatusToIconType } from '../../utils/weatherIcon.js'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

const displayTemp = computed(() => {
  const rawTemp = props.city.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})

const iconType = computed(() => mapStatusToIconType(props.city.status))
</script>

<template>
  <div class="weather-card" @click="$emit('select-card', city)">
    <div class="weather-card-head">
      <div>
        <div class="city-name">{{ city.name }}</div>
        <div class="temp">{{ displayTemp }}{{ configStore.unitSymbol }}</div>
        <div class="status">{{ city.status }}</div>
      </div>
      <WeatherIcon :type="iconType" :size="40" />
    </div>

    <span class="label hot" v-if="city.temp >= 25">🔥 더움 (25도 이상)</span>
    <span class="label cool" v-else>❄️ 선선함 (25도 미만)</span>

    <button class="detail-btn" @click.stop="$emit('click-detail', city)">
      상세보기
    </button>
  </div>
</template>

<style scoped>
.weather-card {
  background: #fafbfc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.weather-card:hover {
  transform: translateY(-2px);
  border-color: #2f6fed;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.weather-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.city-name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.temp {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.status {
  color: #666;
  margin-bottom: 10px;
}

.label {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 14px;
}

.label.hot {
  background: #ffe3e0;
  color: #d3402b;
}

.label.cool {
  background: #e0f0ff;
  color: #1c6fc9;
}

.detail-btn {
  display: block;
  width: 100%;
  padding: 8px 0;
  border: none;
  border-radius: 8px;
  background: #2f6fed;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.detail-btn:hover {
  background: #2159c9;
}
</style>
