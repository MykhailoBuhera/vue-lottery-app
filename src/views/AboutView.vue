<script setup lang="ts">
import { AUTHOR } from '@/constants/project'

// TODO: відредагуйте список під себе
const skillGroups = [
  { title: 'Мови', skills: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3 / SCSS'] },
  { title: 'Фреймворки та бібліотеки', skills: ['Vue 3', 'Vue Router', 'Pinia', 'Bootstrap 5'] },
  { title: 'Інструменти', skills: ['Git / GitHub', 'Vite', 'ESLint', 'Prettier', 'npm'] },
  { title: 'Підходи', skills: ['REST API', 'JWT', 'Repository pattern', 'SPA'] },
]
</script>

<template>
  <section class="about">
    <h1 class="page-title">Про автора</h1>

    <div class="card about__card">
      <div class="card-body about__profile">
        <div class="about__avatar">
          <i class="bi bi-person-fill"></i>
        </div>
        <div>
          <h2 class="about__name">{{ AUTHOR.fullName }}</h2>
          <p class="about__meta">
            Студент кафедри комп'ютерних наук ЧНУ імені Юрія Федьковича · {{ AUTHOR.group }}
          </p>
          <a :href="AUTHOR.githubUrl" target="_blank" rel="noopener" class="btn btn-dark btn-sm">
            <i class="bi bi-github"></i> GitHub
          </a>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <h2 class="about__section-title">Technical skills</h2>
        <div class="about__skills">
          <div v-for="group in skillGroups" :key="group.title">
            <h3 class="about__group-title">{{ group.title }}</h3>
            <div class="about__badges">
              <span v-for="skill in group.skills" :key="skill" class="badge text-bg-primary">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about {
  &__card {
    margin-bottom: 24px;
  }

  &__profile {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 24px;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background-color: #e9ecef;
    color: #6c757d;
    font-size: 3rem;
  }

  &__name {
    margin-bottom: 4px;
    font-size: 1.5rem;
  }

  &__meta {
    margin-bottom: 12px;
    color: #6c757d;
  }

  &__section-title {
    margin-bottom: 20px;
    font-size: 1.35rem;
  }

  &__skills {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }

  &__group-title {
    margin-bottom: 8px;
    font-size: 1rem;
    color: #495057;
  }

  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .badge {
      padding: 6px 10px;
      font-weight: 500;
    }
  }
}
</style>
