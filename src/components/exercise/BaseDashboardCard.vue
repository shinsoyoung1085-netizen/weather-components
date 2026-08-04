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
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.dashboard-card-title {
  margin: 0 0 14px;
  font-size: 16px;
  font-weight: 700;
}
</style>
