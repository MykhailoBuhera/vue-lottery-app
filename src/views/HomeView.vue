<script setup lang="ts">
import { PROJECT_REPO_URL } from '@/constants/project'

const technologies = [
  { name: 'Vue 3', description: 'Composition API, script setup', icon: 'bi-filetype-js' },
  {
    name: 'TypeScript',
    description: 'строга типізація моделей і сервісів',
    icon: 'bi-filetype-tsx',
  },
  {
    name: 'Vue Router',
    description: 'lazy loading, вкладені маршрути, guards',
    icon: 'bi-signpost-split',
  },
  { name: 'Pinia', description: 'стан авторизації та користувачів', icon: 'bi-database' },
  { name: 'VeeValidate + Yup', description: 'валідація форм', icon: 'bi-ui-checks' },
  { name: 'Bootstrap 5 + SCSS', description: 'стилі та іконки', icon: 'bi-bootstrap' },
  { name: 'DummyJSON API', description: 'REST API та JWT-авторизація', icon: 'bi-cloud' },
  { name: 'Vite', description: 'збірка та dev-сервер', icon: 'bi-lightning-charge' },
]

const features = [
  'Лотерея: реєстрація учасників і вибір переможців',
  'Список користувачів з пагінацією та пошуком (стан зберігається в URL)',
  'Перегляд, створення, редагування та видалення користувачів',
  'JWT-авторизація з автоматичним оновленням токена',
  'Захищені маршрути та окремі layouts',
]
</script>

<template>
  <section class="home">
    <div class="home__hero card">
      <div class="card-body">
        <h1 class="home__title">Vue Lottery App</h1>
        <p class="home__lead">
          Односторінковий застосунок на Vue 3: лотерея для учасників та адмін-панель користувачів,
          що працює з REST API DummyJSON через шар репозиторіїв.
        </p>
        <div class="home__actions">
          <RouterLink :to="{ name: 'lottery' }" class="btn btn-primary">
            <i class="bi bi-trophy"></i> До лотереї
          </RouterLink>
          <RouterLink :to="{ name: 'users' }" class="btn btn-outline-secondary">
            <i class="bi bi-people"></i> Користувачі
          </RouterLink>
          <a :href="PROJECT_REPO_URL" target="_blank" rel="noopener" class="btn btn-dark">
            <i class="bi bi-github"></i> Проєкт на GitHub
          </a>
        </div>
      </div>
    </div>

    <h2 class="home__section-title">Можливості</h2>
    <ul class="home__features">
      <li v-for="feature in features" :key="feature">
        <i class="bi bi-check-circle-fill"></i>
        {{ feature }}
      </li>
    </ul>

    <h2 class="home__section-title">Технології</h2>
    <div class="home__tech">
      <div v-for="tech in technologies" :key="tech.name" class="card tech-card">
        <div class="card-body">
          <i class="bi tech-card__icon" :class="tech.icon"></i>
          <h3 class="tech-card__name">{{ tech.name }}</h3>
          <p class="tech-card__description">{{ tech.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home {
  &__hero {
    margin-bottom: 40px;
    border: none;
    background: linear-gradient(135deg, #212529 0%, #495057 100%);
    color: #fff;
  }

  &__title {
    font-weight: 700;
  }

  &__lead {
    max-width: 680px;
    margin-bottom: 24px;
    font-size: 1.15rem;
    color: rgba(255, 255, 255, 0.85);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .btn-outline-secondary {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.5);
    }
  }

  &__section-title {
    margin-bottom: 16px;
    font-size: 1.5rem;
  }

  &__features {
    margin-bottom: 40px;
    padding: 0;
    list-style: none;

    li {
      margin-bottom: 8px;
    }

    i {
      margin-right: 8px;
      color: #198754;
    }
  }

  &__tech {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }
}

.tech-card {
  .card-body {
    padding: 20px;
  }

  &__icon {
    font-size: 1.75rem;
    color: #0d6efd;
  }

  &__name {
    margin: 8px 0 4px;
    font-size: 1.1rem;
  }

  &__description {
    margin: 0;
    color: #6c757d;
    font-size: 0.9rem;
  }
}
</style>
