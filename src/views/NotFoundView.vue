<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found">
    <section class="not-found-card">
      <p class="code">404</p>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p class="desc">요청하신 주소가 존재하지 않거나 이동되었습니다.</p>
      <RouterLink to="/" class="back-link">홈으로 돌아가기</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 720px;
  margin: 0 auto;
}

.not-found-card {
  background: #fff;
  border-radius: 12px;
  padding: 48px 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.code {
  margin: 0;
  font-size: 48px;
  font-weight: 800;
  color: #d0d3da;
}

.not-found-card h1 {
  margin: 8px 0 8px;
  font-size: 20px;
}

.desc {
  color: #888;
  margin-bottom: 24px;
}

.back-link {
  display: inline-block;
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
