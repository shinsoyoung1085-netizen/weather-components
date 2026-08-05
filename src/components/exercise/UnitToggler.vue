<script setup>
import { useConfigStore } from '../../stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
  <button class="unit-toggler" @click="configStore.toggleUnit">
    {{ configStore.unitSymbol }}
  </button>
</template>

<style scoped>
.unit-toggler {
  margin-left: 6px;
  width: 38px;
  height: 38px;
  flex: none;
  border: 1px solid var(--wx-glass-border);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  color: var(--wx-accent-deep);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.unit-toggler:hover {
  background: var(--wx-accent-soft);
  box-shadow: 0 4px 12px rgba(51, 88, 214, 0.18);
}

.unit-toggler:active {
  transform: scale(0.92);
}
</style>
