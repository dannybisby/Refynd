<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-x-full"
      enter-to-class="opacity-100 transform translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 transform translate-x-0"
      leave-to-class="opacity-0 transform translate-x-full"
    >
      <div
        v-if="visible"
        :class="toastClasses"
        role="alert"
        :aria-live="type === 'error' ? 'assertive' : 'polite'"
        :aria-describedby="id + '-message'"
      >
        <!-- Icon -->
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg" :class="iconClasses">
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

        <!-- Content -->
        <div class="ml-3 text-sm font-normal" :id="id + '-message'">
          <!-- Title -->
          <div v-if="title" class="text-sm font-semibold" :class="titleClasses">
            {{ title }}
          </div>
          
          <!-- Message -->
          <div :class="messageClasses">
            <slot>{{ message }}</slot>
          </div>

          <!-- Action slot -->
          <div v-if="$slots.action" class="mt-2">
            <slot name="action"></slot>
          </div>
        </div>

        <!-- Close button -->
        <button
          v-if="closable"
          type="button"
          class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
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
    </Transition>
  </Teleport>
</template>

<script>
let toastId = 0;

/**
 * RToast - Reusable Toast Notification Component
 * 
 * A toast notification component following Flowbite design patterns with support for:
 * - Multiple types (success, error, warning, info)
 * - Different positions
 * - Auto-dismiss functionality
 * - Custom icons and actions via slots
 * - Full accessibility support
 * 
 * @example
 * <RToast type="success" title="Success!" message="Your item was saved." />
 * 
 * @example
 * <RToast type="error" :duration="0" closable>
 *   <template #action>
 *     <button class="text-sm text-blue-600">Retry</button>
 *   </template>
 *   Something went wrong. Please try again.
 * </RToast>
 */
export default {
  name: 'RToast',
  props: {
    /**
     * Toast type/variant
     * @type {'success' | 'error' | 'warning' | 'info'}
     */
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    /**
     * Toast title
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * Toast message (alternative to default slot)
     */
    message: {
      type: String,
      default: ''
    },
    /**
     * Whether the toast is visible
     */
    visible: {
      type: Boolean,
      default: true
    },
    /**
     * Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
     */
    duration: {
      type: Number,
      default: 5000
    },
    /**
     * Whether the toast can be closed manually
     */
    closable: {
      type: Boolean,
      default: true
    },
    /**
     * Toast position on screen
     * @type {'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'}
     */
    position: {
      type: String,
      default: 'top-right',
      validator: (value) => ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'].includes(value)
    },
    /**
     * ARIA label for close button
     */
    closeLabel: {
      type: String,
      default: 'Close notification'
    }
  },
  emits: ['close', 'update:visible'],
  data() {
    return {
      id: `toast-${++toastId}`,
      timer: null
    }
  },
  computed: {
    toastClasses() {
      return [
        'fixed z-50 flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800',
        this.positionClasses
      ]
    },
    positionClasses() {
      const positionMap = {
        'top-right': 'top-5 right-5',
        'top-left': 'top-5 left-5',
        'bottom-right': 'bottom-5 right-5',
        'bottom-left': 'bottom-5 left-5',
        'top-center': 'top-5 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'bottom-5 left-1/2 transform -translate-x-1/2'
      }
      return positionMap[this.position]
    },
    iconClasses() {
      const iconMap = {
        success: 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200',
        error: 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200',
        warning: 'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200',
        info: 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200'
      }
      return iconMap[this.type]
    },
    titleClasses() {
      const titleMap = {
        success: 'text-green-700 dark:text-green-200',
        error: 'text-red-700 dark:text-red-200',
        warning: 'text-orange-700 dark:text-orange-200',
        info: 'text-blue-700 dark:text-blue-200'
      }
      return titleMap[this.type]
    },
    messageClasses() {
      return this.title ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'
    },
    closeButtonClasses() {
      const closeMap = {
        success: 'text-green-500 hover:text-green-600 focus:ring-green-300 dark:text-green-400 dark:hover:text-green-300',
        error: 'text-red-500 hover:text-red-600 focus:ring-red-300 dark:text-red-400 dark:hover:text-red-300',
        warning: 'text-orange-500 hover:text-orange-600 focus:ring-orange-300 dark:text-orange-400 dark:hover:text-orange-300',
        info: 'text-blue-500 hover:text-blue-600 focus:ring-blue-300 dark:text-blue-400 dark:hover:text-blue-300'
      }
      return closeMap[this.type]
    }
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal && this.duration > 0) {
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