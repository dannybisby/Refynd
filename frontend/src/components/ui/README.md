# Refynd UI Components

A comprehensive set of reusable Vue 3 components built with Tailwind CSS and following Flowbite design patterns. These components provide consistent styling, accessibility features, and flexible customization options.

## Installation & Setup

### Import Individual Components

```javascript
import { RButton, RToast, RAlert } from '@/components/ui'
```

### Global Registration

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { registerUIComponents } from '@/components/ui'

const app = createApp(App)
registerUIComponents(app)
app.mount('#app')
```

## Components

### RButton

A flexible button component with multiple variants, sizes, and states.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | String | `'primary'` | Button style: `primary`, `secondary`, `success`, `warning`, `danger`, `light`, `dark` |
| `size` | String | `'base'` | Button size: `xs`, `sm`, `base`, `lg`, `xl` |
| `type` | String | `'button'` | HTML button type: `button`, `submit`, `reset` |
| `disabled` | Boolean | `false` | Whether the button is disabled |
| `loading` | Boolean | `false` | Whether the button shows loading state |
| `text` | String | `''` | Button text (alternative to default slot) |
| `fullWidth` | Boolean | `false` | Whether button takes full width |
| `rounded` | Boolean | `true` | Whether button has rounded corners |
| `ariaLabel` | String | `''` | ARIA label for accessibility |
| `ariaDescribedBy` | String | `''` | ARIA described by for accessibility |

#### Events

| Event | Description |
|-------|-------------|
| `@click` | Emitted when button is clicked (not emitted when disabled or loading) |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Button text content |
| `icon` | Leading icon (not shown when loading) |
| `trailing` | Trailing icon (not shown when loading) |

#### Examples

```vue
<!-- Basic button -->
<RButton @click="handleClick">Click me</RButton>

<!-- Button with variant and size -->
<RButton variant="success" size="lg">Save Changes</RButton>

<!-- Button with loading state -->
<RButton :loading="isSubmitting" variant="primary">
  Submit Form
</RButton>

<!-- Button with icon -->
<RButton variant="secondary">
  <template #icon>
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 12l-5-5 1.41-1.41L10 9.17l3.59-3.58L15 7l-5 5z"/>
    </svg>
  </template>
  Dropdown
</RButton>

<!-- Disabled button -->
<RButton disabled>Can't click me</RButton>

<!-- Full width button -->
<RButton full-width variant="primary">Full Width</RButton>
```

### RToast

A toast notification component with different types, positioning, and auto-dismiss functionality.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | String | `'info'` | Toast type: `success`, `error`, `warning`, `info` |
| `title` | String | `''` | Toast title |
| `message` | String | `''` | Toast message (alternative to default slot) |
| `visible` | Boolean | `true` | Whether the toast is visible |
| `duration` | Number | `5000` | Auto-dismiss duration in ms (0 = no auto-dismiss) |
| `closable` | Boolean | `true` | Whether toast can be manually closed |
| `position` | String | `'top-right'` | Toast position: `top-right`, `top-left`, `bottom-right`, `bottom-left`, `top-center`, `bottom-center` |
| `closeLabel` | String | `'Close notification'` | ARIA label for close button |

#### Events

| Event | Description |
|-------|-------------|
| `@close` | Emitted when toast is closed |
| `@update:visible` | Emitted to update visible state |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Toast message content |
| `icon` | Custom icon (replaces default type icon) |
| `action` | Action buttons or links |

#### Examples

```vue
<!-- Basic toast -->
<RToast type="success" title="Success!" message="Your changes were saved." />

<!-- Toast with custom content -->
<RToast type="error" title="Error occurred">
  Something went wrong. Please try again later.
</RToast>

<!-- Toast with actions -->
<RToast type="warning" title="Warning" :duration="0">
  <template #action>
    <button class="text-sm text-blue-600 hover:underline">
      View Details
    </button>
  </template>
  Please review your settings.
</RToast>

<!-- Controlled toast -->
<RToast 
  type="info" 
  :visible="showToast" 
  @close="showToast = false"
  position="bottom-center"
>
  Information updated successfully.
</RToast>
```

### RAlert

A flexible alert component supporting both inline and modal variants.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | String | `'info'` | Alert type: `success`, `error`, `warning`, `info` |
| `title` | String | `''` | Alert title |
| `message` | String | `''` | Alert message (alternative to default slot) |
| `visible` | Boolean | `true` | Whether the alert is visible |
| `modal` | Boolean | `false` | Whether to show as modal dialog |
| `closable` | Boolean | `true` | Whether alert can be manually closed |
| `showIcon` | Boolean | `true` | Whether to show the icon |
| `backdropClose` | Boolean | `true` | Whether clicking backdrop closes modal |
| `duration` | Number | `0` | Auto-dismiss duration for inline alerts (0 = no auto-dismiss) |
| `closeLabel` | String | `'Close alert'` | ARIA label for close button |

#### Events

| Event | Description |
|-------|-------------|
| `@close` | Emitted when alert is closed |
| `@update:visible` | Emitted to update visible state |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Alert message content |
| `icon` | Custom icon (replaces default type icon) |
| `actions` | Action buttons |

#### Examples

```vue
<!-- Basic inline alert -->
<RAlert type="success" title="Success!" message="Operation completed successfully." />

<!-- Alert with custom content -->
<RAlert type="warning" title="Important Notice">
  Please review the following items before proceeding:
  <ul class="mt-2 ml-4 list-disc">
    <li>Verify all information</li>
    <li>Check permissions</li>
    <li>Backup your data</li>
  </ul>
</RAlert>

<!-- Modal alert with actions -->
<RAlert 
  type="error" 
  modal 
  title="Confirm Deletion"
  :visible="showDeleteAlert"
  @close="showDeleteAlert = false"
>
  <template #actions>
    <RButton variant="danger" @click="confirmDelete">
      Delete
    </RButton>
    <RButton variant="secondary" @click="showDeleteAlert = false">
      Cancel
    </RButton>
  </template>
  Are you sure you want to delete this item? This action cannot be undone.
</RAlert>

<!-- Auto-dismissing inline alert -->
<RAlert 
  type="info" 
  :duration="3000"
  message="Changes saved automatically."
/>
```

## Accessibility Features

All components include comprehensive accessibility support:

- **Keyboard Navigation**: Full keyboard support for interactive elements
- **ARIA Labels**: Proper ARIA attributes for screen readers
- **Focus Management**: Logical focus flow and visible focus indicators
- **High Contrast**: Colors that meet WCAG contrast requirements
- **Screen Reader**: Descriptive text and proper role attributes

## Customization

Components use Tailwind CSS classes and can be customized through:

1. **Props**: Built-in customization options
2. **CSS Classes**: Override styles with utility classes
3. **Slots**: Custom content and icons
4. **Theme**: Modify Tailwind configuration for global changes

## Best Practices

1. **Consistent Usage**: Use the same variant names across components for consistency
2. **Accessibility**: Always provide meaningful ARIA labels when needed
3. **Performance**: Use v-show instead of v-if for frequently toggled components
4. **Feedback**: Provide clear user feedback with appropriate toast/alert types
5. **Actions**: Include clear call-to-action buttons in modals and alerts

## TypeScript Support

For TypeScript projects, you can create type definitions:

```typescript
// types/ui.ts
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'light' | 'dark'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  // ... other props
}
```