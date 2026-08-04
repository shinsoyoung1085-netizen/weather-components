<script setup>
// 흑백 라인 아트 스타일의 날씨 아이콘. 채우기 없이 얇고 균일한 선(stroke)만으로 표현한다.
// 구름 모양(CLOUD_PATH)을 공통으로 재사용해 흐림/구름조금/비/눈/번개 아이콘을 구성한다.
const CLOUD_PATH =
  'M4.5 14.5A3 3 0 0 1 7 9.3A4.8 4.8 0 0 1 15.8 8.6A3.6 3.6 0 0 1 19.6 12.4A3 3 0 0 1 19 14.5Z'

defineProps({
  type: {
    type: String,
    default: 'clear', // clear | partly-cloudy | cloudy | rain | snow | thunder
  },
  size: {
    type: Number,
    default: 48,
  },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="weather-icon"
  >
    <!-- 맑음 -->
    <g v-if="type === 'clear'">
      <circle cx="12" cy="12" r="4.2" />
      <line x1="12" y1="2.5" x2="12" y2="4.7" />
      <line x1="12" y1="19.3" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="4.7" y2="12" />
      <line x1="19.3" y1="12" x2="21.5" y2="12" />
      <line x1="5.2" y1="5.2" x2="6.7" y2="6.7" />
      <line x1="17.3" y1="17.3" x2="18.8" y2="18.8" />
      <line x1="5.2" y1="18.8" x2="6.7" y2="17.3" />
      <line x1="17.3" y1="6.7" x2="18.8" y2="5.2" />
    </g>

    <!-- 구름 조금 -->
    <g v-else-if="type === 'partly-cloudy'">
      <circle cx="7" cy="6.6" r="2.6" />
      <line x1="7" y1="1.8" x2="7" y2="3.2" />
      <line x1="2.2" y1="6.6" x2="3.6" y2="6.6" />
      <line x1="3.5" y1="3.1" x2="4.5" y2="4.1" />
      <g transform="translate(2,4) scale(0.82)">
        <path :d="CLOUD_PATH" transform="translate(0,3)" />
      </g>
    </g>

    <!-- 흐림 -->
    <g v-else-if="type === 'cloudy'">
      <path :d="CLOUD_PATH" transform="translate(0,3)" />
    </g>

    <!-- 비 -->
    <g v-else-if="type === 'rain'">
      <path :d="CLOUD_PATH" />
      <line x1="8" y1="17.3" x2="7" y2="21" />
      <line x1="12.5" y1="17.3" x2="11.5" y2="21" />
      <line x1="17" y1="17.3" x2="16" y2="21" />
    </g>

    <!-- 눈 -->
    <g v-else-if="type === 'snow'">
      <path :d="CLOUD_PATH" />
      <g v-for="cx in [8, 12.5, 17]" :key="cx" stroke-width="1.3">
        <line :x1="cx - 1.2" y1="19.5" :x2="cx + 1.2" y2="19.5" />
        <line :x1="cx" y1="18.3" :x2="cx" y2="20.7" />
        <line :x1="cx - 0.9" y1="18.6" :x2="cx + 0.9" y2="20.4" />
        <line :x1="cx + 0.9" y1="18.6" :x2="cx - 0.9" y2="20.4" />
      </g>
    </g>

    <!-- 번개 -->
    <g v-else-if="type === 'thunder'">
      <path :d="CLOUD_PATH" />
      <polyline points="13.5,17.3 10.5,21 12.8,21 9.8,23.7" />
    </g>
  </svg>
</template>

<style scoped>
.weather-icon {
  display: block;
  color: #111;
  flex: none;
}
</style>
