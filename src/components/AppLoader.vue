<script setup lang="ts">
withDefaults(defineProps<{ text?: string }>(), { text: 'Завантаження...' })
</script>

<template>
  <div class="app-loader" role="status">
    <span class="spinner-border text-primary"></span>
    <span class="app-loader__text">{{ text }}</span>
  </div>
</template>

<style scoped lang="scss">
.app-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 0;
  color: #6c757d;
}
</style>
