<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Participant } from '../types/Participant'
import { hasErrors, validateParticipantForm } from '../utils/participantValidation'
import SearchBar from './SearchBar.vue'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  update: [participant: Participant]
  delete: [id: number]
}>()

const searchQuery = ref('')
const sortKey = ref<'name' | 'dob' | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

function handleFilterByName(value: string): void {
  searchQuery.value = value
}

function toggleSort(key: 'name' | 'dob'): void {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const nameSortIcon = computed(() => {
  if (sortKey.value !== 'name') return 'bi bi-sort-alpha-down'
  return sortDirection.value === 'asc' ? 'bi bi-sort-alpha-down' : 'bi bi-sort-alpha-down-alt'
})

const dobSortIcon = computed(() => {
  if (sortKey.value !== 'dob') return 'bi bi-sort-down'
  return sortDirection.value === 'asc' ? 'bi bi-sort-down' : 'bi bi-sort-down-alt'
})

const filteredParticipants = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return props.participants
  }
  return props.participants.filter((p) => p.name.toLowerCase().includes(query))
})

const displayedParticipants = computed(() => {
  const list = [...filteredParticipants.value]

  if (sortKey.value === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortKey.value === 'dob') {
    list.sort((a, b) => new Date(a.dob).getTime() - new Date(b.dob).getTime())
  }

  if (sortDirection.value === 'desc') {
    list.reverse()
  }

  return list
})

const isEditModalOpen = ref(false)
const editingParticipant = ref<Participant | null>(null)

const editForm = reactive({
  name: '',
  dob: '',
  email: '',
  phone: '',
})

const editErrors = reactive({
  name: '',
  dob: '',
  email: '',
  phone: '',
})

function openEditModal(participant: Participant): void {
  editingParticipant.value = participant
  editForm.name = participant.name
  editForm.dob = participant.dob
  editForm.email = participant.email
  editForm.phone = participant.phone
  editErrors.name = ''
  editErrors.dob = ''
  editErrors.email = ''
  editErrors.phone = ''
  isEditModalOpen.value = true
}

function submitEdit(): void {
  if (!editingParticipant.value) {
    return
  }

  const existingEmails = props.participants
    .filter((p) => p.id !== editingParticipant.value?.id)
    .map((p) => p.email.toLowerCase())

  const errors = validateParticipantForm(editForm, existingEmails)
  Object.assign(editErrors, errors)

  if (hasErrors(errors)) {
    return
  }

  emit('update', {
    id: editingParticipant.value.id,
    name: editForm.name.trim(),
    dob: editForm.dob,
    email: editForm.email.trim(),
    phone: editForm.phone.trim(),
  })

  isEditModalOpen.value = false
}

const isDeleteModalOpen = ref(false)
const deletingParticipant = ref<Participant | null>(null)

function openDeleteModal(participant: Participant): void {
  deletingParticipant.value = participant
  isDeleteModalOpen.value = true
}

function confirmDelete(): void {
  if (!deletingParticipant.value) {
    return
  }

  emit('delete', deletingParticipant.value.id)
  isDeleteModalOpen.value = false
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="table-toolbar">
        <div class="sort-controls">
          <button
            type="button"
            class="table-btn"
            :class="{ 'table-btn--active': sortKey === 'name' }"
            @click="toggleSort('name')"
          >
            <i :class="nameSortIcon"></i>
            Ім'я
          </button>
          <button
            type="button"
            class="table-btn"
            :class="{ 'table-btn--active': sortKey === 'dob' }"
            @click="toggleSort('dob')"
          >
            <i :class="dobSortIcon"></i>
            Дата народження
          </button>
        </div>
        <SearchBar @filter-by-name="handleFilterByName" />
      </div>

      <div class="table-wrapper">
        <table class="table participants-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Phone number</th>
              <th class="actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(participant, index) in displayedParticipants" :key="participant.id">
              <td class="index-cell">{{ index + 1 }}</td>
              <td class="text-cell" :title="participant.name">{{ participant.name }}</td>
              <td>{{ participant.dob }}</td>
              <td class="text-cell" :title="participant.email">{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td class="actions-cell">
                <div class="actions">
                  <button
                    type="button"
                    class="table-btn table-btn--edit"
                    @click="openEditModal(participant)"
                  >
                    <i class="bi bi-pencil"></i>
                    Редагувати дані
                  </button>
                  <button
                    type="button"
                    class="table-btn table-btn--delete"
                    @click="openDeleteModal(participant)"
                  >
                    <i class="bi bi-trash"></i>
                    Видалити учасника
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="displayedParticipants.length === 0" class="empty-message">Список учасників пустий</p>
    </div>
  </div>

  <BaseModal v-model="isEditModalOpen">
    <template #header>
      <h5 class="modal-title">Редагування учасника</h5>
    </template>

    <BaseInput v-model="editForm.name" label="Name" :error="editErrors.name" />
    <BaseInput v-model="editForm.dob" type="date" label="Date of Birth" :error="editErrors.dob" />
    <BaseInput v-model="editForm.email" label="Email" :error="editErrors.email" />
    <BaseInput v-model="editForm.phone" label="Phone number" :error="editErrors.phone" />

    <template #footer>
      <BaseButton @click="submitEdit">Оновити дані</BaseButton>
    </template>
  </BaseModal>

  <BaseModal v-model="isDeleteModalOpen">
    <template #header>
      <h5 class="modal-title">Видалення учасника</h5>
    </template>

    <p v-if="deletingParticipant" class="delete-text">
      Ви дійсно бажаєте видалити учасника "{{ deletingParticipant.name }}", "{{
        deletingParticipant.email
      }}"?
    </p>

    <template #footer>
      <BaseButton variant="secondary" @click="isDeleteModalOpen = false">Ні</BaseButton>
      <BaseButton @click="confirmDelete">Так</BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.sort-controls {
  display: flex;
  gap: 8px;
}

.table-wrapper {
  overflow-x: auto;
}

.participants-table {
  width: 100%;
  margin-bottom: 0;
}

.participants-table th,
.participants-table td {
  padding: 12px 10px;
  vertical-align: middle;
  white-space: nowrap;
}

.text-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.participants-table th {
  font-weight: 600;
}

.index-cell {
  color: #6c757d;
}

.actions-cell {
  text-align: right;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.table-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: #fff;
  color: #495057;
  font-size: 0.8125rem;
  line-height: 1.5;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.table-btn:hover {
  background-color: #f1f3f5;
}

.sort-controls .table-btn {
  min-height: 38px;
  padding: 6px 14px;
  font-size: 0.875rem;
}

.table-btn--active {
  border-color: #0d6efd;
  background-color: #e7f1ff;
  color: #0d6efd;
}

.table-btn--active:hover {
  background-color: #d8e8ff;
}

.table-btn--edit:hover {
  border-color: #0d6efd;
  background-color: #e7f1ff;
  color: #0d6efd;
}

.table-btn--delete {
  color: #dc3545;
}

.table-btn--delete:hover {
  border-color: #dc3545;
  background-color: #fdecee;
}

.delete-text {
  margin: 0;
}

.empty-message {
  color: #6c757d;
  text-align: center;
  margin: 0;
  padding: 24px 0 8px;
}
</style>
