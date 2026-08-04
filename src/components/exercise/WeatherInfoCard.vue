<script setup>
import { computed } from 'vue'
import WeatherIcon from './WeatherIcon.vue'
import { mapStatusToIconType } from '../../utils/weatherIcon.js'

const props = defineProps({
  location: {
    type: String,
    required: true,
  },
  temp: {
    type: [Number, String],
    required: true,
  },
  unitSymbol: {
    type: String,
    default: '℃',
  },
  status: {
    type: String,
    required: true,
  },
})

const iconType = computed(() => mapStatusToIconType(props.status))
</script>

<template>
  <div class="weather-info-card">
    <WeatherIcon :type="iconType" :size="56" />
    <div class="weather-info-body">
      <p class="weather-info-location">{{ location }}</p>
      <p class="weather-info-temp">
        {{ temp }}<span class="unit">{{ unitSymbol }}</span>
      </p>
      <p class="weather-info-status">{{ status }}</p>
    </div>
  </div>
</template>

<style scoped>
.weather-info-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 16px;
  padding: 22px 24px;
}

.weather-info-body {
  flex: 1;
  min-width: 0;
}

.weather-info-location {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 600;
  color: #8a8a8a;
  letter-spacing: 0.02em;
}

.weather-info-temp {
  margin: 0;
  font-size: 40px;
  font-weight: 700;
  color: #111;
  line-height: 1;
}

.weather-info-temp .unit {
  font-size: 20px;
  font-weight: 600;
  color: #999;
  margin-left: 2px;
}

.weather-info-status {
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 500;
  color: #444;
}
</style>
