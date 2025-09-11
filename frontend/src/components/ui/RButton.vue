<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedBy"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-3 h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Icon slot -->
    <slot name="icon" v-if="!loading"></slot>

    <!-- Button text -->
    <span v-if="$slots.default || text">
      <slot>{{ text }}</slot>
    </span>

    <!-- Trailing icon slot -->
    <slot name="trailing" v-if="!loading"></slot>
  </button>
</template>

<script>
/**
 * RButton - Reusable Button Component
 * 
 * A flexible button component following Flowbite design patterns with support for:
 * - Multiple variants (primary, secondary, success, warning, danger)
 * - Different sizes (xs, sm, base, lg, xl)
 * - States (disabled, loading)
 * - Icons and custom content via slots
 * - Full accessibility support
 * 
 * @example
 * <RButton variant="primary" size="lg" @click="handleClick">
 *   Click me
 * </RButton>
 * 
 * @example
 * <RButton variant="secondary" :loading="isLoading">
 *   <template #icon>
 *     <Icon name="plus" />
 *   </template>
 *   Add Item
 * </RButton>
 */
export default {
  name: 'RButton',
  props: {
    /**
     * Button variant/style
     * @type {'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'light' | 'dark'}
     */
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'light', 'dark'].includes(value)
    },
    /**
     * Button size
     * @type {'xs' | 'sm' | 'base' | 'lg' | 'xl'}
     */
    size: {
      type: String,
      default: 'base',
      validator: (value) => ['xs', 'sm', 'base', 'lg', 'xl'].includes(value)
    },
    /**
     * Button type attribute
     * @type {'button' | 'submit' | 'reset'}
     */
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value)
    },
    /**
     * Whether the button is disabled
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Whether the button is in loading state
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * Button text (alternative to default slot)
     */
    text: {
      type: String,
      default: ''
    },
    /**
     * Whether the button should take full width
     */
    fullWidth: {
      type: Boolean,
      default: false
    },
    /**
     * Whether the button should have rounded corners
     */
    rounded: {
      type: Boolean,
      default: true
    },
    /**
     * ARIA label for accessibility
     */
    ariaLabel: {
      type: String,
      default: ''
    },
    /**
     * ARIA described by for accessibility
     */
    ariaDescribedBy: {
      type: String,
      default: ''
    }
  },
  emits: ['click'],
  computed: {
    buttonClasses() {
      return [
        // Base styles
        'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-4 transition-all duration-200',
        
        // Size classes
        this.sizeClasses,
        
        // Variant classes
        this.variantClasses,
        
        // State classes
        {
          'cursor-not-allowed opacity-50': this.disabled || this.loading,
          'w-full': this.fullWidth,
          'rounded-lg': this.rounded,
          'rounded-none': !this.rounded
        }
      ]
    },
    sizeClasses() {
      const sizeMap = {
        xs: 'px-3 py-2 text-xs',
        sm: 'px-3 py-2 text-sm',
        base: 'px-5 py-2.5 text-sm',
        lg: 'px-5 py-3 text-base',
        xl: 'px-6 py-3.5 text-base'
      }
      return sizeMap[this.size]
    },
    variantClasses() {
      const variantMap = {
        primary: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
        secondary: 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700',
        success: 'text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
        warning: 'text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-300 dark:focus:ring-yellow-900',
        danger: 'text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900',
        light: 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
        dark: 'text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
      }
      return variantMap[this.variant]
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event)
      }
    }
  }
}
</script>