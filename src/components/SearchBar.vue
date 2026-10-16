<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Зовнішнє значення (наприклад, з query-параметра) */
    value?: string
    placeholder?: string
  }>(),
  {
    value: '',
    placeholder: 'Пошук за іменем...',
  },
)

const emit = defineEmits<{
  'filter-by-name': [value: string]
}>()

const query = ref(props.value)
let debounceTimer: ReturnType<typeof setTimeout> | undefined

// синхронізація при навігації назад/вперед
watch(
  () => props.value,
  (value) => {
    if (value !== query.value.trim()) {
      query.value = value
    }
  },
)

watch(query, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('filter-by-name', value.trim())
  }, 300)
})
</script>

<template>
  <input v-model="query" type="search" class="form-control search-bar" :placeholder="placeholder" />
</template>

<style scoped lang="scss">
.search-bar {
  max-width: 280px;
}
</style>
