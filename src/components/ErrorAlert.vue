<script setup lang="ts">
defineProps<{
  message: string
  retryable?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="alert alert-danger error-alert" role="alert">
    <span>
      <i class="bi bi-exclamation-triangle-fill"></i>
      {{ message }}
    </span>
    <button
      v-if="retryable"
      type="button"
      class="btn btn-sm btn-outline-danger"
      @click="$emit('retry')"
    >
      Спробувати ще раз
    </button>
  </div>
</template>

<style scoped lang="scss">
.error-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  i {
    margin-right: 6px;
  }
}
</style>
