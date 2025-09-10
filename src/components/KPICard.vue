<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  delta: {
    type: String,
    default: ''
  },
  positive: {
    type: Boolean,
    default: true
  },
  period: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
      </div>
    </div>
    
    <div v-if="delta || period" class="mt-4 flex items-center justify-between">
      <div v-if="delta" class="flex items-center">
        <svg 
          class="h-4 w-4 mr-1"
          :class="positive ? 'text-green-500' : 'text-red-500'"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            :d="positive ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'" 
          />
        </svg>
        <span 
          class="text-sm font-medium"
          :class="positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
        >
          {{ delta }}
        </span>
      </div>
      <span v-if="period" class="text-xs text-gray-500 dark:text-gray-400">
        {{ period }}
      </span>
    </div>
  </div>
</template>