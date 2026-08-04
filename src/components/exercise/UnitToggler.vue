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
  padding: 6px 14px;
  border: 1px solid #2f6fed;
  border-radius: 999px;
  background: #fff;
  color: #2f6fed;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.unit-toggler:hover {
  background: #eef3ff;
}
</style>
