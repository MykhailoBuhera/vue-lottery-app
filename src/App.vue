<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute } from 'vue-router'
import type { LayoutName } from './router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const layouts: Record<LayoutName, Component> = {
  default: DefaultLayout,
  auth: AuthLayout,
}

const route = useRoute()
const layout = computed(() => layouts[route.meta.layout ?? 'default'])
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
