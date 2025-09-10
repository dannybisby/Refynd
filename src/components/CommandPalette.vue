<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isOpen = computed(() => store.state.settings.commandPaletteOpen)

const commands = [
  { id: 'add-item', name: 'Add Item', description: 'Create a new inventory item', action: 'inventory/add' },
  { id: 'add-listing', name: 'Add Listing', description: 'Create a new listing', action: 'sell/new' },
  { id: 'print-labels', name: 'Print Labels', description: 'Print shipping labels', action: 'shipping/print' },
  { id: 'deal-feed', name: 'Open Deal Feed', description: 'View available deals', action: 'buy/deals' },
  { id: 'analytics', name: 'View Analytics', description: 'Open analytics dashboard', action: 'analytics' }
]

const closeCommandPalette = () => {
  store.dispatch('settings/closeCommandPalette')
}

const executeCommand = (command) => {
  // Mock command execution
  store.dispatch('toasts/showInfo', `Executed: ${command.name}`)
  closeCommandPalette()
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-25" @click="closeCommandPalette"></div>
      
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        <div class="p-4">
          <input
            type="text"
            placeholder="Type a command..."
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            autofocus
          />
        </div>
        
        <div class="border-t border-gray-200 dark:border-gray-700">
          <div class="max-h-64 overflow-y-auto">
            <button
              v-for="command in commands"
              :key="command.id"
              @click="executeCommand(command)"
              class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
            >
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ command.name }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ command.description }}
                </div>
              </div>
              <span class="text-xs text-gray-400">↵</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>