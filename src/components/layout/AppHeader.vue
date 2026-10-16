<script setup lang="ts">
import AppLogo from './AppLogo.vue'
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <AppLogo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background-color: #212529;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 12px 24px;
  }
}
</style>
