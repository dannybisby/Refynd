<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const activeTab = ref('orders')
const showPickModal = ref(false)
const selectedOrder = ref(null)
const pickStep = ref(1)

const orders = computed(() => store.getters['orders/filteredOrders'])
const pendingShipments = computed(() => store.getters['shipments/pendingShipments'])
const printedShipments = computed(() => store.getters['shipments/printedShipments'])
const failedShipments = computed(() => store.getters['shipments/failedShipments'])
const onlinePrinters = computed(() => store.getters['shipments/onlinePrinters'])

const filters = ref({
  status: '',
  platform: '',
  age: ''
})

const shippingSettings = ref({
  defaultCarrier: 'Royal Mail',
  defaultPrinter: 'zebra-1',
  autoprint: false,
  labelSize: '4x6'
})

onMounted(() => {
  store.dispatch('orders/fetchOrders')
})

const openPickModal = (order) => {
  selectedOrder.value = order
  showPickModal.value = true
  pickStep.value = 1
}

const closePickModal = () => {
  showPickModal.value = false
  selectedOrder.value = null
  pickStep.value = 1
}

const nextPickStep = () => {
  if (pickStep.value < 4) {
    pickStep.value++
  }
}

const prevPickStep = () => {
  if (pickStep.value > 1) {
    pickStep.value--
  }
}

const completePickStep = async () => {
  switch (pickStep.value) {
    case 1:
      // Verify item
      store.dispatch('toasts/showSuccess', 'Item verified')
      nextPickStep()
      break
    case 2:
      // Serial number (optional)
      nextPickStep()
      break
    case 3:
      // Print label
      const result = await store.dispatch('shipments/printLabel', {
        orderId: selectedOrder.value.id
      })
      if (result.success) {
        store.dispatch('toasts/showSuccess', 'Label printed successfully')
        nextPickStep()
      } else {
        store.dispatch('toasts/showError', 'Failed to print label')
      }
      break
    case 4:
      // Mark dispatched
      store.dispatch('orders/updateOrderStatus', {
        id: selectedOrder.value.id,
        status: 'dispatched'
      })
      store.dispatch('toasts/showSuccess', 'Order marked as dispatched')
      closePickModal()
      break
  }
}

const printLabelNow = (order) => {
  store.dispatch('shipments/printLabel', { orderId: order.id })
  store.dispatch('toasts/showInfo', `Printing label for order ${order.id}`)
}

const getStatusColor = (status) => {
  const colors = {
    'pending_pick': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'label_pending': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'label_ready': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'dispatched': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return colors[status] || colors['pending_pick']
}

const getShipmentStatusColor = (status) => {
  const colors = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'printing': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'printed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[status] || colors['pending']
}

const createManifest = () => {
  const selectedOrders = orders.value.filter(order => order.status === 'label_ready')
  store.dispatch('toasts/showInfo', `Creating manifest for ${selectedOrders.length} orders`)
  // Mock opening a new window with manifest
  const manifestWindow = window.open('', '_blank')
  manifestWindow.document.write(`
    <html>
      <head><title>Drop-off Manifest</title></head>
      <body>
        <h1>Drop-off Manifest</h1>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Total Packages: ${selectedOrders.length}</p>
        <div>QR Code: [QR_CODE_PLACEHOLDER]</div>
      </body>
    </html>
  `)
}

const updateSettings = () => {
  store.dispatch('shipments/updateSettings', shippingSettings.value)
  store.dispatch('toasts/showSuccess', 'Settings updated')
}

const getAgeDisplay = (createdAt) => {
  const created = new Date(createdAt)
  const now = new Date()
  const diffHours = Math.floor((now - created) / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Shipping</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage orders, labels, and dispatches</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="createManifest"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
        >
          Create Manifest
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'orders'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'orders'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          Orders
        </button>
        <button
          @click="activeTab = 'labels'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'labels'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          Label Queue
        </button>
        <button
          @click="activeTab = 'manifest'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'manifest'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          Manifest
        </button>
        <button
          @click="activeTab = 'settings'"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'settings'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          Settings
        </button>
      </nav>
    </div>

    <!-- Orders Tab -->
    <div v-if="activeTab === 'orders'" class="space-y-6">
      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select v-model="filters.status" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option value="">All Statuses</option>
              <option value="pending_pick">Pending Pick</option>
              <option value="label_ready">Label Ready</option>
              <option value="dispatched">Dispatched</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
            <select v-model="filters.platform" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option value="">All Platforms</option>
              <option value="vinted">Vinted</option>
              <option value="ebay">eBay</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
            <select v-model="filters.age" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              <option value="">Any Age</option>
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Orders Queue</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ orders.length }} orders</p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Buyer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Age</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">#{{ order.id }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ order.platform }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ order.buyer }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">Item {{ order.itemId }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">£{{ order.salePrice }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ getAgeDisplay(order.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getStatusColor(order.status)
                  ]">
                    {{ order.status.replace('_', ' ') }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    v-if="order.status === 'pending_pick'"
                    @click="openPickModal(order)"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium"
                  >
                    Pick
                  </button>
                  <button
                    @click="printLabelNow(order)"
                    class="text-green-600 dark:text-green-400 hover:text-green-500 font-medium"
                  >
                    Print Label
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Label Queue Tab -->
    <div v-if="activeTab === 'labels'" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Pending Labels -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Pending</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ pendingShipments.length }} labels</p>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
            <div v-for="shipment in pendingShipments" :key="shipment.id" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Order #{{ shipment.orderId }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ shipment.carrier }}</p>
                </div>
                <button class="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium">
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Printed Labels -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Printed</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ printedShipments.length }} labels</p>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
            <div v-for="shipment in printedShipments" :key="shipment.id" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Order #{{ shipment.orderId }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ shipment.tracking }}</p>
                </div>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Failed Labels -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Failed</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ failedShipments.length }} labels</p>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
            <div v-for="shipment in failedShipments" :key="shipment.id" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Order #{{ shipment.orderId }}</p>
                  <p class="text-xs text-red-500 dark:text-red-400">Print failed</p>
                </div>
                <button class="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium">
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Tab -->
    <div v-if="activeTab === 'settings'" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Shipping Settings</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Carrier</label>
            <select v-model="shippingSettings.defaultCarrier" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="Royal Mail">Royal Mail</option>
              <option value="DPD">DPD</option>
              <option value="Hermes">Hermes</option>
              <option value="UPS">UPS</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Printer</label>
            <select v-model="shippingSettings.defaultPrinter" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option v-for="printer in onlinePrinters" :key="printer.id" :value="printer.id">
                {{ printer.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Label Size</label>
            <select v-model="shippingSettings.labelSize" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="4x6">4" x 6"</option>
              <option value="4x4">4" x 4"</option>
              <option value="A4">A4</option>
            </select>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="shippingSettings.autoprint"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
            />
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-print labels</label>
          </div>
        </div>
        
        <div class="mt-6">
          <button
            @click="updateSettings"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>

    <!-- Pick/Pack Modal -->
    <div v-if="showPickModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="closePickModal"></div>
        
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
          <div class="p-8">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Pick & Pack</h3>
                <p class="text-gray-600 dark:text-gray-400">Order #{{ selectedOrder?.id }}</p>
              </div>
              <button @click="closePickModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Progress Steps -->
            <div class="mb-8">
              <div class="flex items-center justify-between">
                <div v-for="step in 4" :key="step" :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium',
                  pickStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                ]">
                  {{ step }}
                </div>
              </div>
              <div class="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Verify Item</span>
                <span>Serial</span>
                <span>Print Label</span>
                <span>Dispatch</span>
              </div>
            </div>

            <!-- Step Content -->
            <div class="mb-8 min-h-40">
              <!-- Step 1: Verify Item -->
              <div v-if="pickStep === 1" class="text-center">
                <div class="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-lg mx-auto mb-4"></div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Verify Item</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Scan the SKU or confirm the correct item</p>
                <input
                  type="text"
                  placeholder="Scan or enter SKU"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg text-center"
                />
              </div>

              <!-- Step 2: Serial -->
              <div v-if="pickStep === 2" class="text-center">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Serial Number</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Enter serial number if applicable (optional)</p>
                <input
                  type="text"
                  placeholder="Serial number"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg text-center"
                />
              </div>

              <!-- Step 3: Print Label -->
              <div v-if="pickStep === 3" class="text-center">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Print Label</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Ready to print shipping label</p>
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Label Preview</p>
                </div>
              </div>

              <!-- Step 4: Dispatch -->
              <div v-if="pickStep === 4" class="text-center">
                <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Ready to Dispatch</h4>
                <p class="text-gray-600 dark:text-gray-400">Mark order as dispatched and complete the process</p>
              </div>
            </div>

            <!-- Navigation -->
            <div class="flex justify-between">
              <button
                v-if="pickStep > 1"
                @click="prevPickStep"
                class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                ← Previous
              </button>
              <div v-else></div>
              
              <button
                @click="completePickStep"
                class="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium"
              >
                {{ pickStep === 4 ? 'Complete' : 'Continue' }} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>