<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const toasts = computed(() => store.state.toasts.toasts)

const removeToast = (id) => {
  store.dispatch('toasts/removeToast', id)
}

const getToastColor = (type) => {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
  }
  return colors[type] || colors.info
}

const getToastIcon = (type) => {
  const icons = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[type] || icons.info
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'flex items-start p-4 border rounded-lg shadow-lg min-w-80 max-w-96',
        getToastColor(toast.type)
      ]"
    >
      <svg class="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getToastIcon(toast.type)" />
      </svg>
      
      <div class="flex-1">
        <p class="text-sm font-medium">{{ toast.title }}</p>
        <p class="text-sm opacity-90">{{ toast.message }}</p>
      </div>
      
      <button
        @click="removeToast(toast.id)"
        class="ml-4 inline-flex flex-shrink-0 justify-center items-center h-5 w-5 rounded-md hover:bg-black hover:bg-opacity-10 focus:outline-none"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>