<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import KPICard from '../components/KPICard.vue'

const store = useStore()

const kpis = computed(() => [
  { 
    title: "Today's Sales", 
    value: '£1,240', 
    delta: '+12%', 
    positive: true,
    period: 'vs yesterday'
  },
  { 
    title: 'MTD Sales', 
    value: '£18,650', 
    delta: '+8%', 
    positive: true,
    period: 'vs last month'
  },
  { 
    title: 'Profit MTD', 
    value: '£4,220', 
    delta: '+15%', 
    positive: true,
    period: 'vs last month'
  },
  { 
    title: 'Active Listings', 
    value: '47', 
    delta: '+3', 
    positive: true,
    period: 'this week'
  },
  { 
    title: 'Stock Value', 
    value: '£12,340', 
    delta: '+£850', 
    positive: true,
    period: 'COGS'
  },
  { 
    title: '14-day Sell-Through', 
    value: '68%', 
    delta: '-2%', 
    positive: false,
    period: 'vs last period'
  }
])

const ordersToPick = computed(() => store.getters['orders/ordersToPick'])
const topDeals = computed(() => store.getters['deals/topDeals'])

const recentActivity = [
  { type: 'sale', item: 'iPhone 13 Pro 256GB', amount: '£850', time: '2 hours ago' },
  { type: 'dispatch', item: 'Galaxy Watch 4', tracking: 'RM123456789GB', time: '4 hours ago' },
  { type: 'reprice', item: 'MacBook Air M2', change: '+£50', time: '6 hours ago' },
  { type: 'deal', item: 'iPad Pro 11" M2', score: 'A', time: '1 hour ago' }
]

onMounted(() => {
  store.dispatch('orders/fetchOrders')
  store.dispatch('deals/fetchDeals')
})

const quickActions = [
  { name: 'Add Item', action: 'openAddItem', icon: 'plus' },
  { name: 'Deal Feed', action: 'openDealFeed', icon: 'search' },
  { name: 'Print Labels', action: 'openPrintQueue', icon: 'printer' }
]

const executeQuickAction = (action) => {
  store.dispatch('toasts/showInfo', `Quick action: ${action}`)
}

const getActivityIcon = (type) => {
  const icons = {
    sale: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    dispatch: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    reprice: 'M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 010-2h4z',
    deal: 'M13 10V3L4 14h7v7l9-11h-7z'
  }
  return icons[type] || icons.sale
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400">Overview of your business performance</p>
      </div>
      <div class="flex space-x-3">
        <button
          v-for="action in quickActions"
          :key="action.name"
          @click="executeQuickAction(action.action)"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon === 'plus' ? 'M12 4v16m8-8H4' : action.icon === 'search' ? 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' : 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'" />
          </svg>
          {{ action.name }}
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <KPICard
        v-for="kpi in kpis"
        :key="kpi.title"
        :title="kpi.title"
        :value="kpi.value"
        :delta="kpi.delta"
        :positive="kpi.positive"
        :period="kpi.period"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Queues -->
      <div class="space-y-6">
        <!-- Orders to Pick -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Orders to Pick</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ ordersToPick.length }} orders waiting</p>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="order in ordersToPick.slice(0, 5)"
              :key="order.id"
              class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ order.buyer }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">£{{ order.salePrice }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Labels Pending -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Labels Pending</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">3 labels ready to print</p>
          </div>
          <div class="p-6">
            <div class="text-center text-gray-500 dark:text-gray-400">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <p class="mt-2 text-sm">Ready to print labels</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Activity & Insights -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="activity in recentActivity"
              :key="activity.time"
              class="px-6 py-4"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <svg class="h-4 w-4 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getActivityIcon(activity.type)" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900 dark:text-white">
                    <span class="font-medium">{{ activity.type === 'sale' ? 'Sold' : activity.type === 'dispatch' ? 'Dispatched' : activity.type === 'reprice' ? 'Repriced' : 'New deal' }}</span>
                    {{ activity.item }}
                    <span v-if="activity.amount" class="text-green-600 dark:text-green-400 font-medium">{{ activity.amount }}</span>
                    <span v-if="activity.change" class="text-blue-600 dark:text-blue-400 font-medium">{{ activity.change }}</span>
                    <span v-if="activity.score" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ml-2">{{ activity.score }}</span>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Deal Feed Teaser -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Top Deals</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">High-scoring opportunities</p>
            </div>
            <router-link
              to="/buy"
              class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
            >
              View all →
            </router-link>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="deal in topDeals.slice(0, 3)"
              :key="deal.id"
              class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ deal.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ deal.marginPct }}% margin • £{{ deal.price }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {{ deal.score }}
                  </span>
                  <button class="text-primary-600 dark:text-primary-400 hover:text-primary-500 text-xs font-medium">
                    Open in Vinted →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>