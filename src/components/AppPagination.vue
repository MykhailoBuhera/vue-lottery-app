<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const VISIBLE_RANGE = 2

// 1 … 4 5 [6] 7 8 … 20
const pages = computed<(number | '...')[]>(() => {
  const result: (number | '...')[] = []
  const from = Math.max(2, props.page - VISIBLE_RANGE)
  const to = Math.min(props.totalPages - 1, props.page + VISIBLE_RANGE)

  result.push(1)
  if (from > 2) result.push('...')
  for (let p = from; p <= to; p++) result.push(p)
  if (to < props.totalPages - 1) result.push('...')
  if (props.totalPages > 1) result.push(props.totalPages)

  return result
})

function goTo(page: number): void {
  if (page >= 1 && page <= props.totalPages && page !== props.page) {
    emit('update:page', page)
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Пагінація">
    <ul class="pagination app-pagination">
      <li class="page-item" :class="{ disabled: page <= 1 }">
        <button type="button" class="page-link" @click="goTo(page - 1)">
          <i class="bi bi-chevron-left"></i>
        </button>
      </li>
      <li
        v-for="(item, index) in pages"
        :key="`${item}-${index}`"
        class="page-item"
        :class="{ active: item === page, disabled: item === '...' }"
      >
        <span v-if="item === '...'" class="page-link">…</span>
        <button v-else type="button" class="page-link" @click="goTo(item)">{{ item }}</button>
      </li>
      <li class="page-item" :class="{ disabled: page >= totalPages }">
        <button type="button" class="page-link" @click="goTo(page + 1)">
          <i class="bi bi-chevron-right"></i>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.app-pagination {
  justify-content: center;
  margin-bottom: 0;
}
</style>
