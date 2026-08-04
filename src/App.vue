<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <nav class="nav-bar">
    <RouterLink to="/" class="nav-link">🏠 홈</RouterLink>
    <RouterLink to="/about" class="nav-link">ℹ️ 소개</RouterLink>
    <RouterLink to="/umbrella" class="nav-link">☂️ 우산 챙겨</RouterLink>
    <UnitToggler />
  </nav>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
.nav-bar {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 16px;
  margin-bottom: 24px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.nav-link {
  color: #555;
  font-weight: 600;
  text-decoration: none;
  padding: 6px 4px;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #2f6fed;
}

.nav-link.router-link-active {
  color: #2f6fed;
  border-bottom-color: #2f6fed;
}

.main-content {
  padding: 0 16px;
}
</style>
