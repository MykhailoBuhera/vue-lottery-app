<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getErrorMessage } from '@/api/http-client'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'
import UserForm from '@/components/users/UserForm.vue'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const usersStore = useUsersStore()

// батьківський UserDetailsView вже завантажив користувача у стор
const user = computed(() => usersStore.usersById[Number(props.id)] ?? null)

const isSaving = ref(false)
const error = ref('')

function backToDetails(): void {
  void router.push({ name: 'user-details', params: { id: props.id } })
}

async function save(data: CreateUserDto): Promise<void> {
  isSaving.value = true
  error.value = ''
  try {
    await usersStore.update(Number(props.id), data)
    backToDetails()
  } catch (e) {
    error.value = getErrorMessage(e)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div v-if="user" class="card">
    <div class="card-body">
      <h2 class="edit-title">Редагування</h2>
      <!-- key: при переході до іншого користувача форма ініціалізується заново -->
      <UserForm
        :key="user.id"
        :user="user"
        submit-label="Зберегти зміни"
        :submitting="isSaving"
        :error="error"
        @submit="save"
        @cancel="backToDetails"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.edit-title {
  margin-bottom: 20px;
  font-size: 1.35rem;
}
</style>
