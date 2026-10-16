<template>
  <section class="not-found">
    <p class="not-found__code">404</p>
    <h1 class="not-found__title">Сторінку не знайдено</h1>
    <p class="not-found__text">Можливо, її видалили або ви перейшли за неправильним посиланням.</p>
    <RouterLink :to="{ name: 'home' }" class="btn btn-primary">
      <i class="bi bi-house"></i> На головну
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  padding: 60px 0;
  text-align: center;

  &__code {
    margin: 0;
    font-size: 6rem;
    font-weight: 800;
    line-height: 1;
    color: #ffc107;
  }

  &__title {
    margin: 12px 0;
  }

  &__text {
    margin-bottom: 24px;
    color: #6c757d;
  }
}
</style>
