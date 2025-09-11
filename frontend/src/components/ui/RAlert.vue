<template>
  <!-- Inline Alert -->
  <div
    v-if="!modal && visible"
    :class="alertClasses"
    role="alert"
    :aria-labelledby="title ? id + '-title' : undefined"
    :aria-describedby="id + '-message'"
  >
    <!-- Icon -->
    <div v-if="showIcon" class="flex-shrink-0">
      <!-- Success Icon -->
      <svg v-if="type === 'success'" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
      </svg>
      
      <!-- Error Icon -->
      <svg v-else-if="type === 'error'" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
      </svg>
      
      <!-- Warning Icon -->
      <svg v-else-if="type === 'warning'" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
      </svg>
      
      <!-- Info Icon -->
      <svg v-else-if="type === 'info'" class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>

      <!-- Custom Icon Slot -->
      <slot name="icon" v-else></slot>
    </div>

    <!-- Content -->
    <div class="flex-1" :class="showIcon ? 'ml-3' : ''">
      <!-- Title -->
      <h3 v-if="title" :id="id + '-title'" :class="titleClasses">
        {{ title }}
      </h3>
      
      <!-- Message -->
      <div :id="id + '-message'" :class="messageClasses">
        <slot>{{ message }}</slot>
      </div>

      <!-- Actions -->
      <div v-if="$slots.actions" class="mt-4">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Close button for inline alerts -->
    <button
      v-if="closable && !modal"
      type="button"
      :class="closeButtonClasses"
      :aria-label="closeLabel"
      @click="close"
    >
      <span class="sr-only">{{ closeLabel }}</span>
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
    </button>
  </div>

  <!-- Modal Alert -->
  <Teleport to="body" v-if="modal">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <!-- Backdrop -->
      <div
        v-if="visible"
        class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
        @click="backdropClose && close()"
      >
        <!-- Modal -->
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 transform scale-95"
            enter-to-class="opacity-100 transform scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 transform scale-100"
            leave-to-class="opacity-0 transform scale-95"
          >
            <div
              v-if="visible"
              :class="modalClasses"
              role="alertdialog"
              :aria-labelledby="title ? id + '-title' : undefined"
              :aria-describedby="id + '-message'"
              @click.stop
            >
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <div class="flex items-center">
                  <!-- Modal Icon -->
                  <div v-if="showIcon" :class="modalIconClasses" class="flex items-center justify-center w-10 h-10 rounded-full mr-4">
                    <!-- Success Icon -->
                    <svg v-if="type === 'success'" class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    
                    <!-- Error Icon -->
                    <svg v-else-if="type === 'error'" class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                    </svg>
                    
                    <!-- Warning Icon -->
                    <svg v-else-if="type === 'warning'" class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
                    </svg>
                    
                    <!-- Info Icon -->
                    <svg v-else-if="type === 'info'" class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>

                    <!-- Custom Icon Slot -->
                    <slot name="icon" v-else></slot>
                  </div>

                  <!-- Modal Title -->
                  <h3 v-if="title" :id="id + '-title'" class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ title }}
                  </h3>
                </div>

                <!-- Close button for modal -->
                <button
                  v-if="closable"
                  type="button"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  :aria-label="closeLabel"
                  @click="close"
                >
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span class="sr-only">{{ closeLabel }}</span>
                </button>
              </div>

              <!-- Modal Body -->
              <div class="p-4 md:p-5 space-y-4">
                <div :id="id + '-message'" class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  <slot>{{ message }}</slot>
                </div>
              </div>

              <!-- Modal Actions -->
              <div v-if="$slots.actions" class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <slot name="actions"></slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
let alertId = 0;

/**
 * RAlert - Reusable Alert Component
 * 
 * A flexible alert component following Flowbite design patterns with support for:
 * - Multiple types (success, error, warning, info)
 * - Inline and modal variants
 * - Custom icons and actions via slots
 * - Auto-dismiss functionality for inline alerts
 * - Full accessibility support
 * 
 * @example
 * <RAlert type="success" title="Success!" message="Your changes were saved." />
 * 
 * @example
 * <RAlert type="error" modal :visible="showAlert" @close="showAlert = false">
 *   <template #actions>
 *     <RButton variant="danger" @click="handleDelete">Delete</RButton>
 *     <RButton variant="secondary" @click="showAlert = false">Cancel</RButton>
 *   </template>
 *   Are you sure you want to delete this item?
 * </RAlert>
 */
export default {
  name: 'RAlert',
  props: {
    /**
     * Alert type/variant
     * @type {'success' | 'error' | 'warning' | 'info'}
     */
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    /**
     * Alert title
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * Alert message (alternative to default slot)
     */
    message: {
      type: String,
      default: ''
    },
    /**
     * Whether the alert is visible
     */
    visible: {
      type: Boolean,
      default: true
    },
    /**
     * Whether to show as modal dialog
     */
    modal: {
      type: Boolean,
      default: false
    },
    /**
     * Whether the alert can be closed manually
     */
    closable: {
      type: Boolean,
      default: true
    },
    /**
     * Whether to show the icon
     */
    showIcon: {
      type: Boolean,
      default: true
    },
    /**
     * Whether clicking backdrop closes modal (modal only)
     */
    backdropClose: {
      type: Boolean,
      default: true
    },
    /**
     * Auto-dismiss duration in milliseconds for inline alerts (0 = no auto-dismiss)
     */
    duration: {
      type: Number,
      default: 0
    },
    /**
     * ARIA label for close button
     */
    closeLabel: {
      type: String,
      default: 'Close alert'
    }
  },
  emits: ['close', 'update:visible'],
  data() {
    return {
      id: `alert-${++alertId}`,
      timer: null
    }
  },
  computed: {
    alertClasses() {
      const typeMap = {
        success: 'text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800',
        error: 'text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800',
        warning: 'text-yellow-800 border-yellow-300 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800',
        info: 'text-blue-800 border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800'
      }
      return [
        'flex items-center p-4 mb-4 text-sm border rounded-lg',
        typeMap[this.type]
      ]
    },
    titleClasses() {
      return 'text-lg font-medium mb-1'
    },
    messageClasses() {
      return this.title ? '' : 'font-medium'
    },
    closeButtonClasses() {
      const closeMap = {
        success: 'ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700',
        error: 'ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700',
        warning: 'ml-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700',
        info: 'ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700'
      }
      return closeMap[this.type]
    },
    modalClasses() {
      return [
        'relative bg-white rounded-lg shadow dark:bg-gray-700',
        'w-full max-w-md max-h-full'
      ]
    },
    modalIconClasses() {
      const iconMap = {
        success: 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-200',
        error: 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-200',
        warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-200',
        info: 'text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-200'
      }
      return iconMap[this.type]
    }
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal && !this.modal && this.duration > 0) {
          this.startTimer()
        } else {
          this.clearTimer()
        }
      },
      immediate: true
    }
  },
  beforeUnmount() {
    this.clearTimer()
  },
  methods: {
    close() {
      this.clearTimer()
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    startTimer() {
      this.clearTimer()
      this.timer = setTimeout(() => {
        this.close()
      }, this.duration)
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  }
}
</script>