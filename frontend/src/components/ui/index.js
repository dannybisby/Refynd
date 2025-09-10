/**
 * Refynd UI Components
 * 
 * A collection of reusable Vue 3 components following Tailwind UI and Flowbite design patterns.
 * All components are fully customizable, accessible, and designed for consistency across the app.
 */

// Import components
import RButton from './RButton.vue'
import RToast from './RToast.vue'
import RAlert from './RAlert.vue'

// Export all components
export {
  RButton,
  RToast,
  RAlert
}

// Default export for convenience
export default {
  RButton,
  RToast,
  RAlert
}

/**
 * Global component registration helper
 * 
 * Usage in main.js:
 * import { createApp } from 'vue'
 * import App from './App.vue'
 * import { registerUIComponents } from './components/ui'
 * 
 * const app = createApp(App)
 * registerUIComponents(app)
 * app.mount('#app')
 */
export function registerUIComponents(app) {
  app.component('RButton', RButton)
  app.component('RToast', RToast)
  app.component('RAlert', RAlert)
}