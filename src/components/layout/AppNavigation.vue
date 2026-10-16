<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface NavItem {
  label: string
  path: string
  icon: string
  /** Підсвічувати також на вкладених сторінках (/users/5, /users/5/edit) */
  matchNested?: boolean
}

const items: NavItem[] = [
  { label: 'Home', path: '/', icon: 'bi-house' },
  { label: 'Про автора', path: '/about', icon: 'bi-person' },
  { label: 'Лотерея', path: '/lottery', icon: 'bi-trophy' },
  { label: 'Users', path: '/users', icon: 'bi-people', matchNested: true },
]

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

function isActive(item: NavItem): boolean {
  return item.matchNested ? route.path.startsWith(item.path) : route.path === item.path
}

async function logout(): Promise<void> {
  auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <nav class="nav-menu">
    <RouterLink
      v-for="item in items"
      :key="item.path"
      :to="item.path"
      class="nav-menu__link"
      :class="{ 'nav-menu__link--active': isActive(item) }"
    >
      <i class="bi" :class="item.icon"></i>
      {{ item.label }}
    </RouterLink>

    <template v-if="auth.isAuthenticated">
      <span class="nav-menu__user" :title="auth.user?.email">
        <i class="bi bi-person-circle"></i>
        {{ auth.user?.username }}
      </span>
      <button type="button" class="nav-menu__link nav-menu__button" @click="logout">
        <i class="bi bi-box-arrow-right"></i>
        Logout
      </button>
    </template>
    <RouterLink
      v-else
      :to="{ name: 'login' }"
      class="nav-menu__link"
      :class="{ 'nav-menu__link--active': route.name === 'login' }"
    >
      <i class="bi bi-box-arrow-in-right"></i>
      Login
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.nav-menu {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    background: none;
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.95rem;
    text-decoration: none;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;

    &:hover {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.1);
    }

    &--active {
      color: #212529;
      background-color: #ffc107;
      font-weight: 600;

      &:hover {
        color: #212529;
        background-color: #ffcd39;
      }
    }
  }

  &__user {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }
}
</style>
