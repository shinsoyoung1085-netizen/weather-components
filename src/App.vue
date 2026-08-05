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
  position: sticky;
  top: 12px;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  max-width: 640px;
  margin: 0 auto 28px;
  padding: 8px;
  border-radius: var(--wx-radius-full);
  background: var(--wx-glass-bg-strong);
  border: 1px solid var(--wx-glass-border);
  box-shadow: var(--wx-glass-shadow);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
}

.nav-link {
  color: var(--wx-ink-soft);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  padding: 9px 16px;
  border-radius: var(--wx-radius-full);
  background: transparent;
  transition: background 0.25s ease, color 0.25s ease, transform 0.15s ease;
}

.nav-link:hover {
  color: var(--wx-accent-deep);
  background: var(--wx-accent-soft);
}

.nav-link:active {
  transform: scale(0.96);
}

.nav-link.router-link-active {
  color: #fff;
  background: linear-gradient(135deg, var(--wx-accent), var(--wx-accent-deep));
  box-shadow: 0 4px 14px rgba(51, 88, 214, 0.35);
}

.main-content {
  padding: 0 16px;
}
</style>
