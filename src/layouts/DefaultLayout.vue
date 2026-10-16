<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="default-layout">
    <AppHeader />
    <main class="default-layout__content">
      <slot />
    </main>
    <footer class="default-layout__footer">Vue Lottery App · {{ new Date().getFullYear() }}</footer>
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__content {
    flex: 1;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 24px;
  }

  &__footer {
    padding: 16px;
    color: #6c757d;
    font-size: 0.875rem;
    text-align: center;
  }
}
</style>
