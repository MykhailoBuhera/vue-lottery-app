<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  type?: string
  placeholder?: string
  error?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="field">
    <label class="form-label">{{ label }}</label>
    <input
      :type="type ?? 'text'"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<style scoped lang="scss">
.field {
  margin-bottom: 20px;
}

.field label {
  font-weight: 500;
  margin-bottom: 6px;
}
</style>
