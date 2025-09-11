<template>
  <div class="max-w-7xl mx-auto p-6 space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Refynd UI Components Demo
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        Reusable components built with Vue 3, Tailwind CSS, and Flowbite
      </p>
    </div>

    <!-- Buttons Section -->
    <section class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Buttons</h2>
      
      <!-- Button Variants -->
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Variants</h3>
          <div class="flex flex-wrap gap-3">
            <RButton variant="primary" @click="showToast('primary', 'Primary button clicked!')">Primary</RButton>
            <RButton variant="secondary" @click="showToast('info', 'Secondary button clicked!')">Secondary</RButton>
            <RButton variant="success" @click="showToast('success', 'Success button clicked!')">Success</RButton>
            <RButton variant="warning" @click="showToast('warning', 'Warning button clicked!')">Warning</RButton>
            <RButton variant="danger" @click="showToast('error', 'Danger button clicked!')">Danger</RButton>
            <RButton variant="light" @click="showToast('info', 'Light button clicked!')">Light</RButton>
            <RButton variant="dark" @click="showToast('info', 'Dark button clicked!')">Dark</RButton>
          </div>
        </div>

        <!-- Button Sizes -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Sizes</h3>
          <div class="flex flex-wrap items-center gap-3">
            <RButton size="xs" @click="showToast('info', 'Extra small button!')">Extra Small</RButton>
            <RButton size="sm" @click="showToast('info', 'Small button!')">Small</RButton>
            <RButton size="base" @click="showToast('info', 'Base button!')">Base</RButton>
            <RButton size="lg" @click="showToast('info', 'Large button!')">Large</RButton>
            <RButton size="xl" @click="showToast('info', 'Extra large button!')">Extra Large</RButton>
          </div>
        </div>

        <!-- Button States -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">States</h3>
          <div class="flex flex-wrap gap-3">
            <RButton @click="showToast('info', 'Normal button!')">Normal</RButton>
            <RButton disabled>Disabled</RButton>
            <RButton :loading="loadingDemo" @click="toggleLoading">
              {{ loadingDemo ? 'Loading...' : 'Click to Load' }}
            </RButton>
            <RButton full-width variant="primary" @click="showToast('info', 'Full width button!')">
              Full Width Button
            </RButton>
          </div>
        </div>

        <!-- Buttons with Icons -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">With Icons</h3>
          <div class="flex flex-wrap gap-3">
            <RButton variant="primary" @click="showToast('success', 'Item added!')">
              <template #icon>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
              </template>
              Add Item
            </RButton>
            <RButton variant="secondary" @click="showToast('info', 'Download started!')">
              Download
              <template #trailing>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </template>
            </RButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Toasts Section -->
    <section class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Toasts</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Types</h3>
          <div class="flex flex-wrap gap-3">
            <RButton variant="success" @click="showManualToast('success', 'Success!', 'This is a success message.')">
              Show Success Toast
            </RButton>
            <RButton variant="danger" @click="showManualToast('error', 'Error!', 'This is an error message.')">
              Show Error Toast
            </RButton>
            <RButton variant="warning" @click="showManualToast('warning', 'Warning!', 'This is a warning message.')">
              Show Warning Toast
            </RButton>
            <RButton variant="secondary" @click="showManualToast('info', 'Info', 'This is an info message.')">
              Show Info Toast
            </RButton>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Positions</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <RButton size="sm" @click="showPositionToast('top-left')">Top Left</RButton>
            <RButton size="sm" @click="showPositionToast('top-center')">Top Center</RButton>
            <RButton size="sm" @click="showPositionToast('top-right')">Top Right</RButton>
            <RButton size="sm" @click="showPositionToast('bottom-left')">Bottom Left</RButton>
            <RButton size="sm" @click="showPositionToast('bottom-center')">Bottom Center</RButton>
            <RButton size="sm" @click="showPositionToast('bottom-right')">Bottom Right</RButton>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">With Actions</h3>
          <RButton @click="showActionToast">Show Toast with Action</RButton>
        </div>
      </div>
    </section>

    <!-- Alerts Section -->
    <section class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Alerts</h2>
      
      <div class="space-y-6">
        <!-- Inline Alerts -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Inline Alerts</h3>
          <div class="space-y-4">
            <RAlert 
              type="success" 
              title="Success!" 
              message="Your operation completed successfully."
              :visible="alerts.success"
              @close="alerts.success = false"
            />
            
            <RAlert 
              type="error" 
              title="Error Occurred" 
              :visible="alerts.error"
              @close="alerts.error = false"
            >
              Something went wrong while processing your request. Please try again or contact support.
            </RAlert>
            
            <RAlert 
              type="warning" 
              title="Important Notice" 
              :visible="alerts.warning"
              @close="alerts.warning = false"
            >
              Please review your settings before continuing. Some features may not work as expected.
              <template #actions>
                <div class="flex gap-2 mt-2">
                  <RButton size="xs" variant="warning">Review Settings</RButton>
                  <RButton size="xs" variant="light">Skip</RButton>
                </div>
              </template>
            </RAlert>
            
            <RAlert 
              type="info" 
              title="Information" 
              message="Your changes will be automatically saved every 30 seconds."
              :visible="alerts.info"
              @close="alerts.info = false"
            />
          </div>
          
          <div class="mt-4">
            <h4 class="text-md font-medium text-gray-600 dark:text-gray-400 mb-2">Control Alerts</h4>
            <div class="flex flex-wrap gap-2">
              <RButton size="sm" variant="success" @click="alerts.success = true" :disabled="alerts.success">
                Show Success
              </RButton>
              <RButton size="sm" variant="danger" @click="alerts.error = true" :disabled="alerts.error">
                Show Error
              </RButton>
              <RButton size="sm" variant="warning" @click="alerts.warning = true" :disabled="alerts.warning">
                Show Warning
              </RButton>
              <RButton size="sm" variant="secondary" @click="alerts.info = true" :disabled="alerts.info">
                Show Info
              </RButton>
            </div>
          </div>
        </div>

        <!-- Modal Alerts -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Modal Alerts</h3>
          <div class="flex flex-wrap gap-3">
            <RButton variant="danger" @click="showDeleteModal = true">
              Show Delete Confirmation
            </RButton>
            <RButton variant="warning" @click="showWarningModal = true">
              Show Warning Modal
            </RButton>
            <RButton variant="secondary" @click="showInfoModal = true">
              Show Info Modal
            </RButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Dynamic Toasts -->
    <RToast 
      v-for="toast in toasts" 
      :key="toast.id"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :position="toast.position"
      :visible="toast.visible"
      @close="removeToast(toast.id)"
    >
      <template v-if="toast.action" #action>
        <button class="text-sm text-blue-600 hover:underline" @click="handleToastAction(toast)">
          {{ toast.action }}
        </button>
      </template>
    </RToast>

    <!-- Modal Alerts -->
    <RAlert 
      type="error"
      modal
      title="Confirm Deletion"
      :visible="showDeleteModal"
      @close="showDeleteModal = false"
    >
      <template #actions>
        <RButton variant="danger" @click="confirmDelete">
          Delete Item
        </RButton>
        <RButton variant="secondary" @click="showDeleteModal = false">
          Cancel
        </RButton>
      </template>
      Are you sure you want to delete this item? This action cannot be undone and will permanently remove all associated data.
    </RAlert>

    <RAlert 
      type="warning"
      modal
      title="Unsaved Changes"
      :visible="showWarningModal"
      @close="showWarningModal = false"
    >
      <template #actions>
        <RButton variant="primary" @click="saveAndClose">
          Save Changes
        </RButton>
        <RButton variant="danger" @click="discardAndClose">
          Discard Changes
        </RButton>
        <RButton variant="secondary" @click="showWarningModal = false">
          Continue Editing
        </RButton>
      </template>
      You have unsaved changes. What would you like to do?
    </RAlert>

    <RAlert 
      type="info"
      modal
      title="Feature Information"
      :visible="showInfoModal"
      @close="showInfoModal = false"
    >
      <template #actions>
        <RButton variant="primary" @click="showInfoModal = false">
          Got it
        </RButton>
      </template>
      This feature helps you manage your inventory more efficiently. You can track items, monitor stock levels, and receive alerts when items are running low.
    </RAlert>
  </div>
</template>

<script>
import { RButton, RToast, RAlert } from '@/components/ui'

export default {
  name: 'UIComponentsDemo',
  components: {
    RButton,
    RToast,
    RAlert
  },
  data() {
    return {
      loadingDemo: false,
      toasts: [],
      toastId: 0,
      alerts: {
        success: true,
        error: true,
        warning: true,
        info: true
      },
      showDeleteModal: false,
      showWarningModal: false,
      showInfoModal: false
    }
  },
  methods: {
    toggleLoading() {
      this.loadingDemo = true
      setTimeout(() => {
        this.loadingDemo = false
        this.showToast('success', 'Loading completed!')
      }, 2000)
    },
    
    showToast(type, message) {
      this.addToast({
        type,
        message,
        position: 'top-right'
      })
    },
    
    showManualToast(type, title, message) {
      this.addToast({
        type,
        title,
        message,
        position: 'top-right'
      })
    },
    
    showPositionToast(position) {
      this.addToast({
        type: 'info',
        title: 'Position Test',
        message: `Toast shown at ${position}`,
        position
      })
    },
    
    showActionToast() {
      this.addToast({
        type: 'warning',
        title: 'Action Required',
        message: 'Please review your recent changes.',
        position: 'top-right',
        action: 'Review Now'
      })
    },
    
    addToast(toast) {
      const id = ++this.toastId
      this.toasts.push({
        id,
        visible: true,
        ...toast
      })
    },
    
    removeToast(id) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts[index].visible = false
        setTimeout(() => {
          this.toasts.splice(index, 1)
        }, 300)
      }
    },
    
    handleToastAction(toast) {
      this.showToast('info', `You clicked: ${toast.action}`)
      this.removeToast(toast.id)
    },
    
    confirmDelete() {
      this.showDeleteModal = false
      this.showToast('success', 'Item deleted successfully!')
    },
    
    saveAndClose() {
      this.showWarningModal = false
      this.showToast('success', 'Changes saved successfully!')
    },
    
    discardAndClose() {
      this.showWarningModal = false
      this.showToast('info', 'Changes discarded.')
    }
  }
}
</script>