<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const dateRange = ref('30d')
const selectedChannel = ref('')
const selectedCategory = ref('')

// Mock analytics data
const revenueData = ref([
  { period: 'Week 1', revenue: 1200, profit: 420 },
  { period: 'Week 2', revenue: 1580, profit: 550 },
  { period: 'Week 3', revenue: 1350, profit: 470 },
  { period: 'Week 4', revenue: 1820, profit: 640 }
])

const sellThroughData = ref([
  { category: 'Electronics', percentage: 75 },
  { category: 'Accessories', percentage: 68 },
  { category: 'Clothing', percentage: 82 },
  { category: 'Books', percentage: 45 }
])

const stockAgeData = ref([
  { range: '0-30 days', count: 45 },
  { range: '31-60 days', count: 32 },
  { range: '61-90 days', count: 18 },
  { range: '90+ days', count: 12 }
])

const topMarginItems = ref([
  { item: 'iPhone 13 Pro 256GB', margin: 180, percentage: 28 },
  { item: 'MacBook Air M2', margin: 250, percentage: 22 },
  { item: 'AirPods Pro', margin: 45, percentage: 25 },
  { item: 'iPad Pro 11"', margin: 120, percentage: 18 },
  { item: 'Apple Watch Series 8', margin: 80, percentage: 20 }
])

const slowMovers = ref([
  { item: 'Samsung Galaxy S21', daysListed: 87, askPrice: 380 },
  { item: 'OnePlus 9 Pro', daysListed: 92, askPrice: 420 },
  { item: 'Google Pixel 6', daysListed: 105, askPrice: 290 },
  { item: 'Surface Laptop 4', daysListed: 78, askPrice: 680 },
  { item: 'Kindle Paperwhite', daysListed: 156, askPrice: 85 }
])

const kpis = computed(() => ({
  totalRevenue: 18650,
  totalProfit: 4220,
  avgDaysToSell: 14,
  sellThroughRate: 68,
  totalListings: 47,
  avgMargin: 22.6
}))

const channelMixData = computed(() => [
  { channel: 'Vinted', percentage: 65, revenue: 12122 },
  { channel: 'eBay', percentage: 35, revenue: 6528 }
])

const priceChangeImpact = ref([
  { item: 'iPhone 12 Pro', oldPrice: 520, newPrice: 480, impact: '+3 views, +1 sale' },
  { item: 'Galaxy Watch 4', oldPrice: 180, newPrice: 165, impact: '+5 views, +2 sales' },
  { item: 'MacBook Pro 13"', oldPrice: 850, newPrice: 820, impact: '+2 views, no sales yet' }
])

const orders = computed(() => store.state.orders.orders)

onMounted(() => {
  // Load analytics data
})

const applyFilters = () => {
  store.dispatch('toasts/showInfo', 'Filters applied')
}

const getBarWidth = (value, max) => {
  return Math.max((value / max) * 100, 5)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount)
}

const getChangeColor = (change) => {
  if (change > 0) return 'text-green-600 dark:text-green-400'
  if (change < 0) return 'text-red-600 dark:text-red-400'
  return 'text-gray-600 dark:text-gray-400'
}

const getChangeIcon = (change) => {
  if (change > 0) return 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  if (change < 0) return 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
  return 'M5 12h14'
}

// Mock percentage changes
const changes = {
  totalRevenue: 12,
  totalProfit: 15,
  avgDaysToSell: -8,
  sellThroughRate: -2,
  totalListings: 8,
  avgMargin: 3
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p class="text-gray-600 dark:text-gray-400">Business performance insights and metrics</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
          <select v-model="dateRange" @change="applyFilters" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Channel</label>
          <select v-model="selectedChannel" @change="applyFilters" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Channels</option>
            <option value="vinted">Vinted</option>
            <option value="ebay">eBay</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select v-model="selectedCategory" @change="applyFilters" class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="accessories">Accessories</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="applyFilters"
            class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(kpis.totalRevenue) }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <svg :class="['h-4 w-4 mr-1', getChangeColor(changes.totalRevenue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getChangeIcon(changes.totalRevenue)" />
          </svg>
          <span :class="['text-sm font-medium', getChangeColor(changes.totalRevenue)]">
            {{ Math.abs(changes.totalRevenue) }}%
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profit</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(kpis.totalProfit) }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <svg :class="['h-4 w-4 mr-1', getChangeColor(changes.totalProfit)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getChangeIcon(changes.totalProfit)" />
          </svg>
          <span :class="['text-sm font-medium', getChangeColor(changes.totalProfit)]">
            {{ Math.abs(changes.totalProfit) }}%
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Days to Sell</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ kpis.avgDaysToSell }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <svg :class="['h-4 w-4 mr-1', getChangeColor(changes.avgDaysToSell)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getChangeIcon(changes.avgDaysToSell)" />
          </svg>
          <span :class="['text-sm font-medium', getChangeColor(changes.avgDaysToSell)]">
            {{ Math.abs(changes.avgDaysToSell) }}%
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Sell-Through Rate</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ kpis.sellThroughRate }}%</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <svg :class="['h-4 w-4 mr-1', getChangeColor(changes.sellThroughRate)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getChangeIcon(changes.sellThroughRate)" />
          </svg>
          <span :class="['text-sm font-medium', getChangeColor(changes.sellThroughRate)]">
            {{ Math.abs(changes.sellThroughRate) }}%
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Listings</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ kpis.totalListings }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <svg :class="['h-4 w-4 mr-1', getChangeColor(changes.totalListings)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getChangeIcon(changes.totalListings)" />
          </svg>
          <span :class="['text-sm font-medium', getChangeColor(changes.totalListings)]">
            {{ Math.abs(changes.totalListings) }}%
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Margin</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ kpis.avgMargin }}%</p>
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <svg :class="['h-4 w-4 mr-1', getChangeColor(changes.avgMargin)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getChangeIcon(changes.avgMargin)" />
          </svg>
          <span :class="['text-sm font-medium', getChangeColor(changes.avgMargin)]">
            {{ Math.abs(changes.avgMargin) }}%
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue/Profit Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue & Profit Trend</h3>
        <div class="space-y-4">
          <div v-for="(data, index) in revenueData" :key="index" class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-20">{{ data.period }}</span>
            <div class="flex-1 mx-4">
              <div class="flex items-center space-x-2">
                <div class="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div 
                    class="bg-primary-600 h-3 rounded-full"
                    :style="{ width: getBarWidth(data.revenue, 2000) + '%' }"
                  ></div>
                </div>
                <div class="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div 
                    class="bg-green-500 h-3 rounded-full"
                    :style="{ width: getBarWidth(data.profit, 700) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="text-right w-24">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(data.revenue) }}</div>
              <div class="text-xs text-green-600 dark:text-green-400">{{ formatCurrency(data.profit) }}</div>
            </div>
          </div>
          <div class="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-primary-600 rounded-full"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400">Revenue</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400">Profit</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sell-Through by Category -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Sell-Through by Category</h3>
        <div class="space-y-4">
          <div v-for="category in sellThroughData" :key="category.category" class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-24">{{ category.category }}</span>
            <div class="flex-1 mx-4">
              <div class="bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                <div 
                  class="bg-blue-500 h-3 rounded-full"
                  :style="{ width: category.percentage + '%' }"
                ></div>
              </div>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">{{ category.percentage }}%</span>
          </div>
        </div>
      </div>

      <!-- Stock Ageing -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Stock Ageing</h3>
        <div class="space-y-4">
          <div v-for="age in stockAgeData" :key="age.range" class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-24">{{ age.range }}</span>
            <div class="flex-1 mx-4">
              <div class="bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                <div 
                  :class="[
                    'h-3 rounded-full',
                    age.range === '0-30 days' ? 'bg-green-500' :
                    age.range === '31-60 days' ? 'bg-yellow-500' :
                    age.range === '61-90 days' ? 'bg-orange-500' :
                    'bg-red-500'
                  ]"
                  :style="{ width: getBarWidth(age.count, 50) + '%' }"
                ></div>
              </div>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">{{ age.count }}</span>
          </div>
        </div>
      </div>

      <!-- Channel Mix -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Channel Mix</h3>
        <div class="space-y-4">
          <div v-for="channel in channelMixData" :key="channel.channel" class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400 w-16">{{ channel.channel }}</span>
            <div class="flex-1 mx-4">
              <div class="bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                <div 
                  :class="[
                    'h-3 rounded-full',
                    channel.channel === 'Vinted' ? 'bg-purple-500' : 'bg-yellow-500'
                  ]"
                  :style="{ width: channel.percentage + '%' }"
                ></div>
              </div>
            </div>
            <div class="text-right w-20">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ channel.percentage }}%</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatCurrency(channel.revenue) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tables Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Margin Items -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Top Margin Items (Last 30d)</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Margin</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">%</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in topMarginItems" :key="item.item" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.item }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">{{ formatCurrency(item.margin) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.percentage }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Slow Movers -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Slow Movers (60+ days)</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Days</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in slowMovers" :key="item.item" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.item }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {{ item.daysListed }}d
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatCurrency(item.askPrice) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Price Changes Impact -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Price Changes Impact</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Old Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Impact</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="change in priceChangeImpact" :key="change.item" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ change.item }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 line-through">{{ formatCurrency(change.oldPrice) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(change.newPrice) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ change.impact }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>