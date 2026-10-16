<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__brand">
      <AppLogo />
    </div>
    <main class="auth-layout__content">
      <slot />
    </main>
    <RouterLink :to="{ name: 'home' }" class="auth-layout__back">
      <i class="bi bi-arrow-left"></i>
      На головну
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);

  &__brand {
    font-size: 1.25rem;
  }

  &__content {
    width: 100%;
    max-width: 420px;
  }

  &__back {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;

    &:hover {
      color: #fff;
    }
  }
}
</style>
