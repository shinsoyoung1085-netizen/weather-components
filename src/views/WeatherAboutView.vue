<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="weather-about">
    <section class="about-card">
      <h1>☁️ 날씨 Mockup 소개</h1>
      <p>
        날씨 Mockup은 도시별 실시간(가상) 기온과 날씨 상태를 검색하고,
        한눈에 비교할 수 있도록 만든 실습용 대시보드입니다.
      </p>
      <ul class="feature-list">
        <li>도시 이름으로 실시간 검색 및 필터링</li>
        <li>기온에 따른 더움 / 선선함 상태 자동 표시</li>
        <li>도시 카드를 눌러 상세 기상관측 페이지로 이동</li>
      </ul>
      <p class="tech-note">
        Vue 3 Composition API, 컴포넌트 분리(props/emits/slot), Vue Router 기반으로 구현했습니다.
      </p>

      <RouterLink to="/" class="back-link">메인 대시보드로 돌아가기</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.weather-about {
  max-width: 720px;
  margin: 0 auto;
}

.about-card {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.about-card h1 {
  margin: 0 0 16px;
  font-size: 22px;
}

.about-card p {
  color: #444;
  line-height: 1.6;
}

.feature-list {
  margin: 16px 0;
  padding-left: 20px;
  color: #444;
  line-height: 1.8;
}

.tech-note {
  color: #888;
  font-size: 13px;
}

.back-link {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 18px;
  border-radius: 8px;
  background: #2f6fed;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  background: #2159c9;
}
</style>
