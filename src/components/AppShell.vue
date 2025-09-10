<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const sidebarCollapsed = computed(() => store.state.settings.sidebarCollapsed)
const darkMode = computed(() => store.state.settings.darkMode)

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: 'chart-bar', hotkey: 'g d' },
  { name: 'Buy', path: '/buy', icon: 'shopping-cart', hotkey: 'g b' },
  { name: 'Sell', path: '/sell', icon: 'tag', hotkey: 'g s' },
  { name: 'Inventory', path: '/inventory', icon: 'cube', hotkey: 'g i' },
  { name: 'Shipping', path: '/shipping', icon: 'truck', hotkey: 'g h' },
  { name: 'Analytics', path: '/analytics', icon: 'chart-line', hotkey: 'g a' }
]

const handleKeydown = (event) => {
  // Global keyboard shortcuts
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    store.dispatch('settings/openCommandPalette')
    return
  }

  // Navigation shortcuts (g + letter)
  if (event.key === 'g' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    // Wait for next key
    const handleNext = (nextEvent) => {
      switch (nextEvent.key) {
        case 'd':
          router.push('/')
          break
        case 'b':
          router.push('/buy')
          break
        case 's':
          router.push('/sell')
          break
        case 'i':
          router.push('/inventory')
          break
        case 'h':
          router.push('/shipping')
          break
        case 'a':
          router.push('/analytics')
          break
      }
      document.removeEventListener('keydown', handleNext)
    }
    document.addEventListener('keydown', handleNext)
    setTimeout(() => {
      document.removeEventListener('keydown', handleNext)
    }, 1000)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const toggleSidebar = () => {
  store.dispatch('settings/toggleSidebar')
}

const toggleDarkMode = () => {
  store.dispatch('settings/toggleDarkMode')
}

const openCommandPalette = () => {
  store.dispatch('settings/openCommandPalette')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    <!-- Sidebar -->
    <div :class="[
      'bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 transition-all duration-200',
      sidebarCollapsed ? 'w-16' : 'w-64'
    ]">
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">R</span>
          </div>
          <span v-if="!sidebarCollapsed" class="text-xl font-semibold text-gray-900 dark:text-white">
            Refynd
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="mt-8 px-3">
        <div class="space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150"
            :class="$route.path === item.path 
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
              : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
            "
          >
            <component :is="getIcon(item.icon)" class="mr-3 h-5 w-5 flex-shrink-0" />
            <span v-if="!sidebarCollapsed">{{ item.name }}</span>
            <span v-if="!sidebarCollapsed" class="ml-auto text-xs text-gray-400">
              {{ item.hotkey }}
            </span>
          </router-link>
        </div>
      </nav>

      <!-- Sidebar toggle -->
      <div class="absolute bottom-4 left-3">
        <button
          @click="toggleSidebar"
          class="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  :d="sidebarCollapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16">
        <div class="flex items-center justify-between h-full px-6">
          <!-- Search -->
          <div class="flex-1 max-w-2xl">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search... (Press / to focus)"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <!-- Command Palette Button -->
            <button
              @click="openCommandPalette"
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="hidden sm:inline">⌘K</span>
            </button>

            <!-- Dark mode toggle -->
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg v-if="!darkMode" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>

            <!-- Profile -->
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <span class="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                User
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
// Icon components would normally be imported from a library like Heroicons
// For simplicity, we'll create simple SVG components
const getIcon = (iconName) => {
  const icons = {
    'chart-bar': 'svg',
    'shopping-cart': 'svg', 
    'tag': 'svg',
    'cube': 'svg',
    'truck': 'svg',
    'chart-line': 'svg'
  }
  return icons[iconName] || 'svg'
}

export default {
  methods: {
    getIcon
  }
}
</script>