<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

defineEmits(['update-query'])
</script>

<template>
  <div class="search-box">
    <input
      type="text"
      placeholder="도시 이름을 검색하세요 (예: 서울)"
      :value="searchQuery"
      @input="$emit('update-query', $event.target.value)"
    />
  </div>
  <div class="search-result" v-if="searchQuery">
    입력한 도시명: <strong>{{ searchQuery }}</strong>
  </div>
</template>

<style scoped>
.search-box {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.search-box input {
  width: 100%;
  max-width: 320px;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
}

.search-result {
  text-align: center;
  color: #555;
  min-height: 20px;
}
</style>
