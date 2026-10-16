<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const modalRef = ref<HTMLElement | null>(null)

function close(): void {
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      modalRef.value?.focus()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-wrapper">
        <div class="modal-backdrop-custom" @click="close"></div>
        <div ref="modalRef" class="modal d-block" tabindex="-1" @keyup.esc="close">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <slot name="header" />
                <button type="button" class="btn-close" @click="close"></button>
              </div>
              <div class="modal-body">
                <slot />
              </div>
              <div class="modal-footer">
                <slot name="footer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal.d-block {
  display: block;
  z-index: 1050;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
