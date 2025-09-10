<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const viewMode = ref('cards')
const selectedDeal = computed(() => store.state.deals.selectedDeal)
const deals = computed(() => store.getters['deals/filteredDeals'])
const savedSearches = computed(() => store.state.deals.savedSearches)
const loading = computed(() => store.state.deals.loading)

const filters = ref({
  source: '',
  minMargin: 0,
  maxPrice: 0,
  minScore: ''
})

onMounted(() => {
  store.dispatch('deals/fetchDeals')
})

const selectDeal = (deal) => {
  store.dispatch('deals/selectDeal', deal)
}

const openInVinted = (deal) => {
  // Mock deep-link to Vinted
  store.dispatch('toasts/showInfo', `Opening ${deal.title} in Vinted`)
  window.open(deal.url, '_blank')
}

const applyFilters = () => {
  store.dispatch('deals/updateFilters', filters.value)
}

const getScoreColor = (score) => {
  const colors = {
    'A': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'B': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'C': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'D': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return colors[score] || colors['D']
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Buy Deals</h1>
        <p class="text-gray-600 dark:text-gray-400">Discover profitable resale opportunities</p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- View Toggle -->
        <div class="flex rounded-md shadow-sm">
          <button
            @click="viewMode = 'cards'"
            :class="[
              'px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-l-md',
              viewMode === 'cards' 
                ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900 dark:text-primary-300' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            Cards
          </button>
          <button
            @click="viewMode = 'table'"
            :class="[
              'px-4 py-2 text-sm font-medium border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md',
              viewMode === 'table' 
                ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900 dark:text-primary-300' 
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            Table
          </button>
        </div>
        
        <!-- Saved Searches -->
        <select class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
          <option value="">Saved Searches</option>
          <option v-for="search in savedSearches" :key="search.id" :value="search.id">
            {{ search.name }}
          </option>
        </select>
        
        <button class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium">
          Manage Rules
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
          <select v-model="filters.source" @change="applyFilters" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Sources</option>
            <option value="vinted">Vinted</option>
            <option value="ebay">eBay</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Margin %</label>
          <input v-model.number="filters.minMargin" @input="applyFilters" type="number" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Price £</label>
          <input v-model.number="filters.maxPrice" @input="applyFilters" type="number" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Score</label>
          <select v-model="filters.minScore" @change="applyFilters" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">Any Score</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Deal Feed -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Deal Feed</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ deals.length }} deals found</p>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="p-6 space-y-4">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="bg-gray-300 dark:bg-gray-600 h-24 rounded-lg"></div>
            </div>
          </div>
          
          <!-- Cards View -->
          <div v-else-if="viewMode === 'cards'" class="p-6 space-y-4">
            <div
              v-for="deal in deals"
              :key="deal.id"
              @click="selectDeal(deal)"
              :class="[
                'border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer transition-colors',
                selectedDeal?.id === deal.id 
                  ? 'ring-2 ring-primary-500 border-primary-500' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              <div class="flex items-start space-x-4">
                <div class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ deal.title }}</h4>
                      <div class="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>£{{ deal.price }}</span>
                        <span>Est. £{{ deal.estResale }}</span>
                        <span class="text-green-600 dark:text-green-400">{{ deal.marginPct }}% margin</span>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span :class="[
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        getScoreColor(deal.score)
                      ]">
                        {{ deal.score }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ deal.ageMinutes }}m</span>
                    </div>
                  </div>
                  <div class="mt-2 flex items-center justify-between">
                    <div class="flex items-center space-x-1">
                      <div class="flex text-yellow-400">
                        <svg v-for="i in 5" :key="i" class="h-3 w-3" :class="i <= Math.floor(deal.sellerRating) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span class="text-xs text-gray-600 dark:text-gray-400">{{ deal.sellerRating }}</span>
                    </div>
                    <button
                      @click.stop="openInVinted(deal)"
                      class="px-3 py-1 bg-primary-600 text-white rounded text-xs font-medium hover:bg-primary-700"
                    >
                      Open in Vinted →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Table View -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Est. Resale</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Margin</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="deal in deals"
                  :key="deal.id"
                  @click="selectDeal(deal)"
                  :class="[
                    'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700',
                    selectedDeal?.id === deal.id ? 'bg-primary-50 dark:bg-primary-900' : ''
                  ]"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">{{ deal.title }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">£{{ deal.price }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">£{{ deal.estResale }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{{ deal.marginPct }}%</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      getScoreColor(deal.score)
                    ]">
                      {{ deal.score }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      @click.stop="openInVinted(deal)"
                      class="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium"
                    >
                      Open →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Scoring Panel -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Deal Details</h3>
          </div>
          
          <div v-if="!selectedDeal" class="p-6 text-center text-gray-500 dark:text-gray-400">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="mt-2 text-sm">Select a deal to view details</p>
          </div>
          
          <div v-else class="p-6 space-y-4">
            <!-- Photos -->
            <div class="grid grid-cols-2 gap-2">
              <div v-for="(photo, index) in selectedDeal.photos" :key="index" class="aspect-square bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
            </div>
            
            <!-- Title and Price -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">{{ selectedDeal.title }}</h4>
              <p class="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">£{{ selectedDeal.price }}</p>
            </div>
            
            <!-- Seller Info -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Seller Information</h5>
              <div class="flex items-center space-x-2">
                <div class="flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" class="h-4 w-4" :class="i <= Math.floor(selectedDeal.sellerRating) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ selectedDeal.sellerRating }} rating</span>
              </div>
            </div>
            
            <!-- Profit Analysis -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Profit Analysis</h5>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Purchase Price:</span>
                  <span class="font-medium">£{{ selectedDeal.price }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Est. Resale:</span>
                  <span class="font-medium">£{{ selectedDeal.estResale }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Fees (10%):</span>
                  <span class="font-medium">£{{ (selectedDeal.estResale * 0.1).toFixed(2) }}</span>
                </div>
                <div class="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-semibold">
                  <span>Est. Profit:</span>
                  <span class="text-green-600 dark:text-green-400">£{{ (selectedDeal.estResale - selectedDeal.price - (selectedDeal.estResale * 0.1)).toFixed(2) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <button
                @click="openInVinted(selectedDeal)"
                class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium"
              >
                Open in Vinted →
              </button>
              <button class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                Copy Title
              </button>
              <button class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                Snooze 10m
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>