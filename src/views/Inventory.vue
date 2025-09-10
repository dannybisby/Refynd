<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import DataTable from '../components/DataTable.vue'

const store = useStore()

const items = computed(() => store.getters['items/filteredItems'])
const selectedItems = computed(() => store.state.items.selectedItems)
const loading = computed(() => store.state.items.loading)

const showDrawer = ref(false)
const selectedItem = ref(null)
const showImportModal = ref(false)

const filters = ref({
  category: '',
  condition: '',
  source: '',
  status: '',
  location: ''
})

const columns = [
  { key: 'sku', label: 'SKU', sortable: true },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'source', label: 'Source', sortable: true },
  { key: 'buyPrice', label: 'Buy Price', sortable: true, type: 'currency' },
  { key: 'askPrice', label: 'Ask Price', sortable: true, type: 'currency' },
  { key: 'estResale', label: 'Est. Resale', sortable: true, type: 'currency' },
  { key: 'marginPct', label: 'Margin %', sortable: true, computed: true },
  { key: 'channels', label: 'Channels', type: 'array' },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'status', label: 'Status', sortable: true, type: 'badge' },
  { key: 'daysListed', label: 'Days Listed', sortable: true, computed: true }
]

const batchActions = [
  { id: 'assign-location', name: 'Assign Location', icon: 'location' },
  { id: 'print-labels', name: 'Print Labels', icon: 'printer' },
  { id: 'bulk-reprice', name: 'Bulk Reprice', icon: 'percent' },
  { id: 'export-csv', name: 'Export CSV', icon: 'download' }
]

onMounted(() => {
  store.dispatch('items/fetchItems')
})

const openItemDetails = (item) => {
  selectedItem.value = item
  showDrawer.value = true
}

const closeDrawer = () => {
  showDrawer.value = false
  selectedItem.value = null
}

const executeBatchAction = (actionId) => {
  if (selectedItems.value.length === 0) {
    store.dispatch('toasts/showWarning', 'No items selected')
    return
  }
  
  switch (actionId) {
    case 'assign-location':
      store.dispatch('toasts/showInfo', `Assigning location to ${selectedItems.value.length} items`)
      break
    case 'print-labels':
      store.dispatch('toasts/showInfo', `Printing labels for ${selectedItems.value.length} items`)
      break
    case 'bulk-reprice':
      store.dispatch('toasts/showInfo', `Repricing ${selectedItems.value.length} items`)
      break
    case 'export-csv':
      store.dispatch('toasts/showInfo', `Exporting ${selectedItems.value.length} items`)
      break
  }
}

const getStatusColor = (status) => {
  const colors = {
    'in_stock': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'listed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'allocated': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'sold': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'archived': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[status] || colors['in_stock']
}

const calculateMargin = (item) => {
  if (!item.askPrice || !item.buyPrice) return 0
  return Math.round(((item.askPrice - item.buyPrice) / item.buyPrice) * 100)
}

const calculateDaysListed = (item) => {
  if (!item.listedAt) return 0
  const listed = new Date(item.listedAt)
  const now = new Date()
  return Math.floor((now - listed) / (1000 * 60 * 60 * 24))
}

const transformedItems = computed(() => {
  return items.value.map(item => ({
    ...item,
    marginPct: calculateMargin(item),
    daysListed: calculateDaysListed(item)
  }))
})

const printSKULabel = (item) => {
  store.dispatch('toasts/showInfo', `Printing SKU label for ${item.sku}`)
}

const moveLocation = (item) => {
  store.dispatch('toasts/showInfo', `Moving ${item.sku} to new location`)
}

const editItem = (item) => {
  store.dispatch('toasts/showInfo', `Editing ${item.sku}`)
}

const duplicateItem = (item) => {
  store.dispatch('toasts/showInfo', `Duplicating ${item.sku}`)
}

const archiveItem = (item) => {
  store.dispatch('items/updateItem', { id: item.id, updates: { status: 'archived' } })
  store.dispatch('toasts/showSuccess', `${item.sku} archived`)
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your inventory items</p>
      </div>
      <div class="flex items-center space-x-4">
        <button
          @click="showImportModal = true"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium"
        >
          Import CSV
        </button>
        <button class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium">
          Add Item
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select v-model="filters.category" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="accessories">Accessories</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition</label>
          <select v-model="filters.condition" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
          <select v-model="filters.source" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Sources</option>
            <option value="vinted">Vinted</option>
            <option value="facebook">Facebook</option>
            <option value="carboot">Car Boot</option>
            <option value="charity">Charity Shop</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select v-model="filters.status" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="listed">Listed</option>
            <option value="allocated">Allocated</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
          <input
            v-model="filters.location"
            type="text"
            placeholder="e.g., A1-B2"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Batch Actions -->
    <div v-if="selectedItems.length > 0" class="bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-primary-900 dark:text-primary-200">
          {{ selectedItems.length }} items selected
        </span>
        <div class="flex space-x-2">
          <button
            v-for="action in batchActions"
            :key="action.id"
            @click="executeBatchAction(action.id)"
            class="px-3 py-1 bg-primary-600 text-white rounded text-sm font-medium hover:bg-primary-700"
          >
            {{ action.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <DataTable
      :items="transformedItems"
      :columns="columns"
      :loading="loading"
      :selected-items="selectedItems"
      @select-items="store.dispatch('items/selectItems', $event)"
      @row-click="openItemDetails"
    >
      <!-- Custom cell renderers -->
      <template #cell-title="{ item }">
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.brand }} {{ item.model }}</div>
        </div>
      </template>

      <template #cell-source="{ item }">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 capitalize">
          {{ item.source }}
        </span>
      </template>

      <template #cell-buyPrice="{ item }">
        <span class="text-sm text-gray-900 dark:text-white">
          {{ item.buyPrice ? `£${item.buyPrice}` : '-' }}
        </span>
      </template>

      <template #cell-askPrice="{ item }">
        <span class="text-sm text-gray-900 dark:text-white">
          {{ item.askPrice ? `£${item.askPrice}` : '-' }}
        </span>
      </template>

      <template #cell-estResale="{ item }">
        <span class="text-sm text-gray-900 dark:text-white">
          {{ item.estResale ? `£${item.estResale}` : '-' }}
        </span>
      </template>

      <template #cell-marginPct="{ item }">
        <span
          :class="[
            'text-sm font-medium',
            item.marginPct > 30 ? 'text-green-600 dark:text-green-400' :
            item.marginPct > 15 ? 'text-yellow-600 dark:text-yellow-400' :
            'text-red-600 dark:text-red-400'
          ]"
        >
          {{ item.marginPct }}%
        </span>
      </template>

      <template #cell-channels="{ item }">
        <div class="flex space-x-1">
          <span
            v-for="channel in item.channels"
            :key="channel"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize"
          >
            {{ channel }}
          </span>
        </div>
      </template>

      <template #cell-status="{ item }">
        <span
          :class="[
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize',
            getStatusColor(item.status)
          ]"
        >
          {{ item.status.replace('_', ' ') }}
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex space-x-1">
          <button
            @click.stop="printSKULabel(item)"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Print SKU Label"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
          <button
            @click.stop="editItem(item)"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Edit"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Item Details Drawer -->
    <div v-if="showDrawer" class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gray-500 bg-opacity-75" @click="closeDrawer"></div>
        <section class="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div class="w-screen max-w-md">
            <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl">
              <div class="px-6 py-4 bg-primary-600">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-medium text-white">Item Details</h2>
                  <button @click="closeDrawer" class="text-primary-200 hover:text-white">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="selectedItem" class="flex-1 overflow-y-auto p-6 space-y-6">
                <!-- Photos -->
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Photos</h3>
                  <div class="grid grid-cols-2 gap-2">
                    <div v-for="i in 4" :key="i" class="aspect-square bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                  </div>
                </div>

                <!-- Basic Info -->
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Basic Information</h3>
                  <dl class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">SKU:</dt>
                      <dd class="font-medium">{{ selectedItem.sku }}</dd>
                    </div>
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Brand:</dt>
                      <dd>{{ selectedItem.brand }}</dd>
                    </div>
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Model:</dt>
                      <dd>{{ selectedItem.model }}</dd>
                    </div>
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Condition:</dt>
                      <dd class="capitalize">{{ selectedItem.condition }}</dd>
                    </div>
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Location:</dt>
                      <dd>{{ selectedItem.location || 'Not assigned' }}</dd>
                    </div>
                  </dl>
                </div>

                <!-- Pricing -->
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Pricing</h3>
                  <dl class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Buy Price:</dt>
                      <dd>£{{ selectedItem.buyPrice }}</dd>
                    </div>
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Ask Price:</dt>
                      <dd>{{ selectedItem.askPrice ? `£${selectedItem.askPrice}` : 'Not set' }}</dd>
                    </div>
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Est. Resale:</dt>
                      <dd>{{ selectedItem.estResale ? `£${selectedItem.estResale}` : 'Not set' }}</dd>
                    </div>
                  </dl>
                </div>

                <!-- Actions -->
                <div class="space-y-2">
                  <button
                    @click="printSKULabel(selectedItem)"
                    class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium"
                  >
                    Print SKU Label
                  </button>
                  <button
                    @click="moveLocation(selectedItem)"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Move Location
                  </button>
                  <button
                    @click="duplicateItem(selectedItem)"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Duplicate
                  </button>
                  <button
                    @click="archiveItem(selectedItem)"
                    class="w-full px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Archive
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Import CSV Modal -->
    <div v-if="showImportModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-25" @click="showImportModal = false"></div>
        
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Import CSV</h3>
            
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="mt-4">
                <label class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Drop CSV file here or click to upload
                  </span>
                  <input type="file" class="sr-only" accept=".csv" />
                </label>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                @click="showImportModal = false"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>