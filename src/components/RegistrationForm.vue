<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Participant } from '../types/Participant'
import { hasErrors, validateParticipantForm } from '../utils/participantValidation'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  register: [participant: Participant]
}>()

const name = ref('')
const dob = ref('')
const email = ref('')
const phone = ref('')

const errors = reactive({
  name: '',
  dob: '',
  email: '',
  phone: '',
})

function resetForm(): void {
  name.value = ''
  dob.value = ''
  email.value = ''
  phone.value = ''
  errors.name = ''
  errors.dob = ''
  errors.email = ''
  errors.phone = ''
}

function handleSave(): void {
  const existingEmails = props.participants.map((p) => p.email.toLowerCase())
  const validationErrors = validateParticipantForm(
    { name: name.value, dob: dob.value, email: email.value, phone: phone.value },
    existingEmails,
  )

  Object.assign(errors, validationErrors)

  if (hasErrors(validationErrors)) {
    return
  }

  emit('register', {
    id: Date.now(),
    name: name.value.trim(),
    dob: dob.value,
    email: email.value.trim(),
    phone: phone.value.trim(),
  })

  resetForm()
}
</script>

<template>
  <div class="card form-card">
    <div class="card-body" @keyup.enter="handleSave">
      <h5 class="card-title">REGISTER FORM</h5>
      <p class="hint">Please fill in all the fields.</p>

      <BaseInput v-model="name" label="Name" placeholder="Enter user name" :error="errors.name" />
      <BaseInput v-model="dob" type="date" label="Date of Birth" :error="errors.dob" />
      <BaseInput v-model="email" label="Email" placeholder="Enter email" :error="errors.email" />
      <BaseInput
        v-model="phone"
        label="Phone number"
        placeholder="Enter Phone number"
        :error="errors.phone"
      />

      <div class="form-actions">
        <BaseButton @click="handleSave">Save</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-card {
  margin-bottom: 32px;
}

.card-title {
  font-size: 1.5rem;
}

.hint {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 24px;
}

.form-actions {
  text-align: right;
}
</style>
