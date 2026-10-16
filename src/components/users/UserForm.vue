<script setup lang="ts">
import { useForm } from 'vee-validate'
import { userSchema } from '@/validation/schemas'
import type { CreateUserDto, Gender, User } from '@/types/user'
import BaseInput from '../BaseInput.vue'
import BaseButton from '../BaseButton.vue'
import ErrorAlert from '../ErrorAlert.vue'

const props = withDefaults(
  defineProps<{
    user?: User | null
    submitLabel?: string
    submitting?: boolean
    error?: string
  }>(),
  {
    user: null,
    submitLabel: 'Зберегти',
    submitting: false,
    error: '',
  },
)

const emit = defineEmits<{
  submit: [data: CreateUserDto]
  cancel: []
}>()

// Значення полів — рядки: так з ними працює BaseInput, а yup сам приводить age до числа
interface UserFormValues {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  age: string
  gender: Gender | ''
  phone: string
}

const { defineField, errors, handleSubmit } = useForm<UserFormValues>({
  validationSchema: userSchema,
  initialValues: {
    firstName: props.user?.firstName ?? '',
    lastName: props.user?.lastName ?? '',
    email: props.user?.email ?? '',
    username: props.user?.username ?? '',
    password: props.user?.password ?? '',
    age: props.user ? String(props.user.age) : '',
    gender: props.user?.gender ?? '',
    phone: props.user?.phone ?? '',
  },
})

const [firstName] = defineField('firstName')
const [lastName] = defineField('lastName')
const [email] = defineField('email')
const [username] = defineField('username')
const [password] = defineField('password')
const [age] = defineField('age')
const [gender, genderAttrs] = defineField('gender')
const [phone] = defineField('phone')

const onSubmit = handleSubmit((values) => {
  emit('submit', {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    username: values.username.trim(),
    password: values.password.trim(),
    age: Number(values.age),
    gender: values.gender as Gender,
    phone: values.phone.trim(),
  })
})
</script>

<template>
  <form class="user-form" novalidate @submit.prevent="onSubmit">
    <ErrorAlert v-if="error" :message="error" />

    <div class="user-form__grid">
      <BaseInput v-model="firstName" label="Ім'я" :error="errors.firstName" />
      <BaseInput v-model="lastName" label="Прізвище" :error="errors.lastName" />
      <BaseInput v-model="email" type="email" label="Email" :error="errors.email" />
      <BaseInput v-model="username" label="Username" :error="errors.username" />
      <BaseInput v-model="password" type="password" label="Пароль" :error="errors.password" />
      <BaseInput v-model="age" type="number" label="Вік" :error="errors.age" />

      <div class="field">
        <label class="form-label" for="user-gender">Стать</label>
        <select
          id="user-gender"
          v-model="gender"
          v-bind="genderAttrs"
          class="form-select"
          :class="{ 'is-invalid': errors.gender }"
        >
          <option value="" disabled>Оберіть стать</option>
          <option value="male">Чоловіча</option>
          <option value="female">Жіноча</option>
        </select>
        <div v-if="errors.gender" class="invalid-feedback">{{ errors.gender }}</div>
      </div>

      <BaseInput
        v-model="phone"
        type="tel"
        label="Телефон"
        placeholder="+380 67 123 4567"
        :error="errors.phone"
      />
    </div>

    <div class="user-form__actions">
      <BaseButton variant="outline-secondary" @click="emit('cancel')">Скасувати</BaseButton>
      <BaseButton type="submit" :disabled="submitting">
        <span v-if="submitting" class="spinner-border spinner-border-sm"></span>
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.user-form {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    column-gap: 24px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

.field {
  margin-bottom: 20px;

  label {
    font-weight: 500;
    margin-bottom: 6px;
  }
}
</style>
