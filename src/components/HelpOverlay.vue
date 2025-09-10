<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showHelp = ref(false)

const shortcuts = [
  { category: 'Navigation', items: [
    { key: 'g d', action: 'Dashboard' },
    { key: 'g b', action: 'Buy' },
    { key: 'g s', action: 'Sell' },
    { key: 'g i', action: 'Inventory' },
    { key: 'g h', action: 'Shipping' },
    { key: 'g a', action: 'Analytics' }
  ]},
  { category: 'Global', items: [
    { key: '⌘K / Ctrl+K', action: 'Command palette' },
    { key: '/', action: 'Focus search' },
    { key: '?', action: 'Show help' },
    { key: 'Esc', action: 'Close modal/drawer' }
  ]},
  { category: 'Common Actions', items: [
    { key: 'a', action: 'Add new item' },
    { key: 'e', action: 'Edit selected' },
    { key: '⌘↩', action: 'Confirm action' },
    { key: 'Space', action: 'Select/toggle' }
  ]}
]

const handleKeydown = (event) => {
  if (event.key === '?' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault()
    showHelp.value = !showHelp.value
  } else if (event.key === 'Escape') {
    showHelp.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const closeHelp = () => {
  showHelp.value = false
}
</script>

<template>
  <div v-if="showHelp" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeHelp"></div>
      
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
            <button @click="closeHelp" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="category in shortcuts" :key="category.category" class="space-y-3">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">
                {{ category.category }}
              </h4>
              <div class="space-y-2">
                <div
                  v-for="shortcut in category.items"
                  :key="shortcut.key"
                  class="flex items-center justify-between"
                >
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ shortcut.action }}</span>
                  <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                    {{ shortcut.key }}
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
              Press <kbd class="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">?</kbd> 
              anytime to toggle this help overlay
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>