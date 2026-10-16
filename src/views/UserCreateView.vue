<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getErrorMessage } from '@/api/http-client'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'
import UserForm from '@/components/users/UserForm.vue'

const router = useRouter()
const usersStore = useUsersStore()

const isSaving = ref(false)
const error = ref('')

async function create(data: CreateUserDto): Promise<void> {
  isSaving.value = true
  error.value = ''
  try {
    const user = await usersStore.create(data)
    await router.push({ name: 'user-details', params: { id: user.id } })
  } catch (e) {
    error.value = getErrorMessage(e)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section>
    <RouterLink :to="{ name: 'users' }" class="back-link">
      <i class="bi bi-arrow-left"></i> До списку користувачів
    </RouterLink>

    <h1 class="page-title">Новий користувач</h1>

    <div class="card">
      <div class="card-body">
        <UserForm
          submit-label="Створити"
          :submitting="isSaving"
          :error="error"
          @submit="create"
          @cancel="router.push({ name: 'users' })"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  text-decoration: none;
}
</style>
