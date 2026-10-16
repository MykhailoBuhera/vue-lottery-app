<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getErrorMessage } from '@/api/http-client'
import { useUsersStore } from '@/stores/users'
import AppLoader from '@/components/AppLoader.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const userId = computed(() => Number(props.id))
// беремо зі стору, щоб після редагування в дочірньому маршруті дані оновилися автоматично
const user = computed(() => usersStore.usersById[userId.value] ?? null)
const isEditing = computed(() => route.name === 'user-edit')

const isLoading = ref(false)
const error = ref('')

async function loadUser(): Promise<void> {
  isLoading.value = true
  error.value = ''
  try {
    await usersStore.fetchById(userId.value)
  } catch (e) {
    error.value = getErrorMessage(e)
  } finally {
    isLoading.value = false
  }
}

watch(userId, loadUser, { immediate: true })

const details = computed(() => {
  if (!user.value) return []
  return [
    { label: 'Email', value: user.value.email, icon: 'bi-envelope' },
    { label: 'Username', value: user.value.username, icon: 'bi-at' },
    { label: 'Вік', value: user.value.age, icon: 'bi-calendar' },
    {
      label: 'Стать',
      value: user.value.gender === 'female' ? 'Жіноча' : 'Чоловіча',
      icon: 'bi-gender-ambiguous',
    },
    { label: 'Телефон', value: user.value.phone, icon: 'bi-telephone' },
  ]
})

const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref('')

async function confirmDelete(): Promise<void> {
  isDeleting.value = true
  deleteError.value = ''
  try {
    await usersStore.remove(userId.value)
    isDeleteModalOpen.value = false
    await router.push({ name: 'users' })
  } catch (e) {
    deleteError.value = getErrorMessage(e)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <section>
    <RouterLink :to="{ name: 'users' }" class="back-link">
      <i class="bi bi-arrow-left"></i> До списку користувачів
    </RouterLink>

    <AppLoader v-if="isLoading" />
    <ErrorAlert v-else-if="error" :message="error" retryable @retry="loadUser" />

    <template v-else-if="user">
      <div class="card user-card">
        <div class="card-body user-card__body">
          <img v-if="user.image" :src="user.image" alt="" class="user-card__avatar" />
          <i v-else class="bi bi-person-circle user-card__avatar"></i>

          <div class="user-card__info">
            <h1 class="user-card__name">{{ user.firstName }} {{ user.lastName }}</h1>
            <ul class="user-card__details">
              <li v-for="item in details" :key="item.label">
                <i class="bi" :class="item.icon"></i>
                <span class="user-card__label">{{ item.label }}:</span>
                {{ item.value }}
              </li>
            </ul>
          </div>

          <div v-if="!isEditing" class="user-card__actions">
            <RouterLink :to="{ name: 'user-edit', params: { id } }" class="btn btn-primary">
              <i class="bi bi-pencil"></i> Редагувати
            </RouterLink>
            <BaseButton variant="danger" @click="isDeleteModalOpen = true">
              <i class="bi bi-trash"></i> Видалити
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- вкладений маршрут /users/:id/edit -->
      <RouterView />
    </template>

    <BaseModal v-model="isDeleteModalOpen">
      <template #header>
        <h5 class="modal-title">Видалення користувача</h5>
      </template>

      <ErrorAlert v-if="deleteError" :message="deleteError" />
      <p v-if="user" class="modal-text">
        Видалити користувача «{{ user.firstName }} {{ user.lastName }}»?
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
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  text-decoration: none;
}

.user-card {
  margin-bottom: 24px;

  &__body {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 32px;
  }

  &__avatar {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    background-color: #e9ecef;
    font-size: 128px;
    line-height: 1;
    color: #adb5bd;
  }

  &__info {
    flex: 1;
    min-width: 240px;
  }

  &__name {
    margin-bottom: 16px;
    font-size: 1.75rem;
  }

  &__details {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      margin-bottom: 8px;
    }

    i {
      margin-right: 8px;
      color: #6c757d;
    }
  }

  &__label {
    color: #6c757d;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

.modal-text {
  margin: 0;
}
</style>
