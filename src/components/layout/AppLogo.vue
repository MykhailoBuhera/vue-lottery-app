<template>
  <RouterLink :to="{ name: 'home' }" class="logo">
    <i class="bi bi-ticket-perforated-fill logo__icon"></i>
    <span class="logo__text">Vue<strong>Lottery</strong></span>
  </RouterLink>
</template>

<style scoped lang="scss">
.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
  font-size: 1.25rem;

  &__icon {
    font-size: 1.6rem;
    color: #ffc107;
  }

  &__text strong {
    font-weight: 700;
  }
}
</style>
