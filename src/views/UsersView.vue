<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getErrorMessage } from '@/api/http-client'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/types/user'
import SearchBar from '@/components/SearchBar.vue'
import AppPagination from '@/components/AppPagination.vue'
import AppLoader from '@/components/AppLoader.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'

const PAGE_SIZE = 10

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

// Стан пагінації та пошуку живе в URL: /users?page=2&q=john
const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const searchQuery = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))

const users = ref<User[]>([])
const total = ref(0)
const isLoading = ref(false)
const error = ref('')

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

let requestId = 0

async function loadUsers(): Promise<void> {
  const currentRequest = ++requestId
  isLoading.value = true
  error.value = ''
  try {
    const result = await usersStore.fetchPage({
      q: searchQuery.value,
      skip: (page.value - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    })
    // відповідь на застарілий запит ігноруємо
    if (currentRequest !== requestId) return
    users.value = result.items
    total.value = result.total

    if (page.value > totalPages.value) {
      changePage(totalPages.value)
    }
  } catch (e) {
    if (currentRequest !== requestId) return
    error.value = getErrorMessage(e)
  } finally {
    if (currentRequest === requestId) isLoading.value = false
  }
}

watch([page, searchQuery], loadUsers, { immediate: true })

function changePage(newPage: number): void {
  void router.push({
    query: { ...route.query, page: newPage > 1 ? String(newPage) : undefined },
  })
}

function search(value: string): void {
  if (value === searchQuery.value) return
  void router.replace({ query: { ...route.query, q: value || undefined, page: undefined } })
}

const userToDelete = ref<User | null>(null)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref('')

function askDelete(user: User): void {
  userToDelete.value = user
  deleteError.value = ''
  isDeleteModalOpen.value = true
}

async function confirmDelete(): Promise<void> {
  if (!userToDelete.value) return
  isDeleting.value = true
  deleteError.value = ''
  try {
    await usersStore.remove(userToDelete.value.id)
    isDeleteModalOpen.value = false
    await loadUsers()
  } catch (e) {
    deleteError.value = getErrorMessage(e)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <section>
    <div class="users-header">
      <h1 class="page-title">Користувачі</h1>
      <RouterLink :to="{ name: 'user-create' }" class="btn btn-primary">
        <i class="bi bi-person-plus"></i> Додати
      </RouterLink>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="users-toolbar">
          <SearchBar
            :value="searchQuery"
            placeholder="Пошук за ім'ям, email, username..."
            @filter-by-name="search"
          />
          <span class="users-toolbar__total">Знайдено: {{ total }}</span>
        </div>

        <ErrorAlert v-if="error" :message="error" retryable @retry="loadUsers" />
        <AppLoader v-else-if="isLoading" />

        <template v-else>
          <div class="table-wrapper">
            <table class="table users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Користувач</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Вік</th>
                  <th>Телефон</th>
                  <th class="actions-cell">Дії</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td class="id-cell">{{ user.id }}</td>
                  <td>
                    <RouterLink
                      :to="{ name: 'user-details', params: { id: user.id } }"
                      class="user-cell"
                    >
                      <img v-if="user.image" :src="user.image" alt="" class="user-cell__avatar" />
                      <i v-else class="bi bi-person-circle user-cell__avatar"></i>
                      {{ user.firstName }} {{ user.lastName }}
                    </RouterLink>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.age }}</td>
                  <td>{{ user.phone }}</td>
                  <td class="actions-cell">
                    <RouterLink
                      :to="{ name: 'user-edit', params: { id: user.id } }"
                      class="btn btn-sm btn-outline-primary"
                      title="Редагувати"
                    >
                      <i class="bi bi-pencil"></i>
                    </RouterLink>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      title="Видалити"
                      @click="askDelete(user)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p v-if="users.length === 0" class="empty-message">Користувачів не знайдено</p>

          <AppPagination :page="page" :total-pages="totalPages" @update:page="changePage" />
        </template>
      </div>
    </div>

    <BaseModal v-model="isDeleteModalOpen">
      <template #header>
        <h5 class="modal-title">Видалення користувача</h5>
      </template>

      <ErrorAlert v-if="deleteError" :message="deleteError" />
      <p v-if="userToDelete" class="modal-text">
        Видалити користувача «{{ userToDelete.firstName }} {{ userToDelete.lastName }}»?
      </p>

      <template #footer>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false">Ні</BaseButton>
        <BaseButton variant="danger" :disabled="isDeleting" @click="confirmDelete">
          <span v-if="isDeleting" class="spinner-border spinner-border-sm"></span>
          Так, видалити
        </BaseButton>
      </template>
    </BaseModal>
  </section>
</template>

<style scoped lang="scss">
.users-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.users-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;

  &__total {
    color: #6c757d;
  }
}

.table-wrapper {
  margin-bottom: 20px;
  overflow-x: auto;
}

.users-table {
  th,
  td {
    padding: 10px;
    vertical-align: middle;
    white-space: nowrap;
  }
}

.user-cell {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #0d6efd;
  }

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #e9ecef;
    font-size: 32px;
    line-height: 1;
    color: #adb5bd;
  }
}

.actions-cell {
  text-align: right;

  .btn + .btn {
    margin-left: 6px;
  }
}

.id-cell {
  color: #6c757d;
}

.modal-text {
  margin: 0;
}

.empty-message {
  padding: 24px 0;
  color: #6c757d;
  text-align: center;
}
</style>
