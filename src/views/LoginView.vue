<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginSchema } from '@/validation/schemas'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: loginSchema,
  initialValues: { username: '', password: '' },
})

const [username] = defineField('username')
const [password] = defineField('password')

function getRedirectPath(): string {
  const redirect = route.query.redirect
  // дозволяємо лише внутрішні шляхи, щоб не було open redirect
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/users'
}

const onSubmit = handleSubmit(async (values) => {
  const success = await auth.login({
    username: values.username.trim(),
    password: values.password,
  })
  if (success) {
    await router.replace(getRedirectPath())
  }
})
</script>

<template>
  <div class="card login-card">
    <div class="card-body">
      <h1 class="login-card__title">Вхід</h1>
      <p class="login-card__hint">
        Тестовий акаунт DummyJSON: <code>emilys</code> / <code>emilyspass</code>
      </p>

      <form novalidate @submit.prevent="onSubmit">
        <ErrorAlert v-if="auth.error" :message="auth.error" />

        <BaseInput v-model="username" label="Username" :error="errors.username" />
        <BaseInput v-model="password" type="password" label="Пароль" :error="errors.password" />

        <BaseButton type="submit" class="w-100" :disabled="auth.isLoading">
          <span v-if="auth.isLoading" class="spinner-border spinner-border-sm"></span>
          Увійти
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-card {
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  &__title {
    margin-bottom: 4px;
    font-size: 1.75rem;
  }

  &__hint {
    margin-bottom: 24px;
    color: #6c757d;
    font-size: 0.9rem;
  }

  .w-100 {
    width: 100%;
  }
}
</style>
