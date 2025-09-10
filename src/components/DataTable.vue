<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedItems: {
    type: Array,
    default: () => []
  },
  selectable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['select-items', 'row-click'])

const sortField = ref('')
const sortDirection = ref('asc')
const allSelected = ref(false)

const sortedItems = computed(() => {
  if (!sortField.value) return props.items

  return [...props.items].sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

    // Handle null/undefined values
    if (aVal == null) aVal = ''
    if (bVal == null) bVal = ''

    // Convert to numbers if they're numeric
    if (typeof aVal === 'string' && !isNaN(aVal) && aVal !== '') {
      aVal = Number(aVal)
    }
    if (typeof bVal === 'string' && !isNaN(bVal) && bVal !== '') {
      bVal = Number(bVal)
    }

    if (aVal < bVal) {
      return sortDirection.value === 'asc' ? -1 : 1
    }
    if (aVal > bVal) {
      return sortDirection.value === 'asc' ? 1 : -1
    }
    return 0
  })
})

const sort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const selectAll = () => {
  if (allSelected.value) {
    emit('select-items', [])
    allSelected.value = false
  } else {
    emit('select-items', [...props.items])
    allSelected.value = true
  }
}

const selectItem = (item) => {
  const isSelected = props.selectedItems.some(selected => selected.id === item.id)
  let newSelection
  
  if (isSelected) {
    newSelection = props.selectedItems.filter(selected => selected.id !== item.id)
  } else {
    newSelection = [...props.selectedItems, item]
  }
  
  emit('select-items', newSelection)
  allSelected.value = newSelection.length === props.items.length
}

const isSelected = (item) => {
  return props.selectedItems.some(selected => selected.id === item.id)
}

const onRowClick = (item) => {
  emit('row-click', item)
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="p-6">
      <div class="animate-pulse space-y-4">
        <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div class="space-y-2">
          <div v-for="i in 5" :key="i" class="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <!-- Select All Checkbox -->
            <th v-if="selectable" class="px-6 py-3 text-left">
              <input
                v-model="allSelected"
                @change="selectAll"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </th>
            
            <!-- Column Headers -->
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                column.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200' : ''
              ]"
              @click="column.sortable && sort(column.key)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <svg
                  v-if="column.sortable && sortField === column.key"
                  class="h-4 w-4"
                  :class="sortDirection === 'asc' ? 'transform rotate-180' : ''"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </th>
            
            <!-- Actions Column -->
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Empty State -->
          <tr v-if="items.length === 0">
            <td :colspan="columns.length + (selectable ? 2 : 1)" class="px-6 py-12 text-center">
              <div class="text-gray-500 dark:text-gray-400">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p class="mt-2 text-sm">No items found</p>
              </div>
            </td>
          </tr>
          
          <!-- Data Rows -->
          <tr
            v-for="item in sortedItems"
            :key="item.id"
            :class="[
              'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
              isSelected(item) ? 'bg-primary-50 dark:bg-primary-900' : ''
            ]"
            @click="onRowClick(item)"
          >
            <!-- Select Checkbox -->
            <td v-if="selectable" class="px-6 py-4 whitespace-nowrap">
              <input
                :checked="isSelected(item)"
                @click.stop
                @change="selectItem(item)"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </td>
            
            <!-- Data Cells -->
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
            >
              <!-- Custom cell content via slot -->
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="item[column.key]"
              >
                <!-- Default cell content -->
                <span v-if="column.type === 'currency'" class="text-sm text-gray-900 dark:text-white">
                  {{ item[column.key] ? `£${item[column.key]}` : '-' }}
                </span>
                <span v-else-if="column.type === 'array'" class="text-sm text-gray-900 dark:text-white">
                  {{ Array.isArray(item[column.key]) ? item[column.key].join(', ') : item[column.key] }}
                </span>
                <span v-else-if="column.type === 'badge'" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {{ item[column.key] }}
                </span>
                <span v-else class="text-sm text-gray-900 dark:text-white">
                  {{ item[column.key] || '-' }}
                </span>
              </slot>
            </td>
            
            <!-- Actions Cell -->
            <td class="px-6 py-4 whitespace-nowrap">
              <slot name="cell-actions" :item="item">
                <div class="flex space-x-1">
                  <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination (placeholder) -->
    <div class="bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing {{ Math.min(items.length, 25) }} of {{ items.length }} results
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Previous
          </button>
          <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>