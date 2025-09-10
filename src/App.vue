<script setup>
import { RouterView } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppShell from './components/AppShell.vue'
import CommandPalette from './components/CommandPalette.vue'
import ToastContainer from './components/ToastContainer.vue'
import HelpOverlay from './components/HelpOverlay.vue'

const store = useStore()

onMounted(() => {
  store.dispatch('settings/initializeSettings')
})

const darkMode = computed(() => store.state.settings.darkMode)
</script>

<template>
  <div id="app" :class="{ 'dark': darkMode }">
    <AppShell>
      <RouterView />
    </AppShell>
    <CommandPalette />
    <ToastContainer />
    <HelpOverlay />
  </div>
</template>

<style>
/* Global styles are in main.css */
</style>
