<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="dashboard-card">
    <h2 v-if="title" class="dashboard-card-title">{{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  background: var(--wx-glass-bg);
  border: 1px solid var(--wx-glass-border);
  border-radius: var(--wx-radius-lg);
  padding: 22px;
  margin-bottom: 20px;
  box-shadow: var(--wx-glass-shadow);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
}

.dashboard-card-title {
  margin: 0 0 16px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--wx-ink-faint);
}
</style>
