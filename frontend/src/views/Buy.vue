<template>
  <div class="max-w-screen-xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Buy - Vinted Deal Finder</h1>
    
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">Active Searches</h2>
        <p class="text-2xl font-bold text-blue-600">{{ searchQueriesCount }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">Pending Deals</h2>
        <p class="text-2xl font-bold text-orange-600">{{ pendingDeals.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">Active Purchases</h2>
        <p class="text-2xl font-bold text-green-600">{{ activePurchases.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">Est. Profit</h2>
        <p class="text-2xl font-bold text-purple-600">£{{ totalEstimatedProfit.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Search Monitoring Section -->
    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Search Monitoring</h2>
        <button @click="showAddSearchModal = true" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Search Query
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto border-collapse">
          <thead>
            <tr class="bg-gray-100 text-left">
              <th class="px-4 py-2 border">Query</th>
              <th class="px-4 py-2 border">Category</th>
              <th class="px-4 py-2 border">Max Price</th>
              <th class="px-4 py-2 border">Results</th>
              <th class="px-4 py-2 border">Last Checked</th>
              <th class="px-4 py-2 border">Status</th>
              <th class="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="query in searchQueries" :key="query.id" class="hover:bg-gray-50">
              <td class="px-4 py-2 border font-medium">{{ query.query }}</td>
              <td class="px-4 py-2 border">{{ query.category }}</td>
              <td class="px-4 py-2 border">£{{ query.maxPrice }}</td>
              <td class="px-4 py-2 border">{{ query.resultsFound }}</td>
              <td class="px-4 py-2 border text-sm text-gray-600">{{ formatDate(query.lastChecked) }}</td>
              <td class="px-4 py-2 border">
                <span :class="getStatusBadgeClass(query.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ query.status }}
                </span>
              </td>
              <td class="px-4 py-2 border">
                <button @click="toggleQueryStatus(query)" 
                  class="text-blue-600 hover:text-blue-800 mr-2">
                  {{ query.status === 'active' ? 'Pause' : 'Resume' }}
                </button>
                <button @click="deleteQuery(query.id)" 
                  class="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Promising Deals Section -->
    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
      <h2 class="text-xl font-semibold mb-4">Promising Deals - Awaiting Review</h2>
      
      <div v-if="pendingDeals.length === 0" class="text-center text-gray-500 py-8">
        No pending deals to review. Your search queries will automatically find new opportunities.
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="deal in pendingDeals" :key="deal.id" 
          class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div class="flex items-start space-x-4">
            <img :src="deal.images[0]" :alt="deal.title" 
              class="w-20 h-24 object-cover rounded-md flex-shrink-0">
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 truncate">{{ deal.title }}</h3>
              <p class="text-sm text-gray-600">{{ deal.brand }} • Size {{ deal.size }}</p>
              <p class="text-sm text-gray-600">Condition: {{ deal.condition }}</p>
              <p class="text-sm text-gray-600">Seller: {{ deal.seller }}</p>
            </div>
          </div>
          
          <div class="mt-4 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-green-600">£{{ deal.price }}</span>
              <span class="text-sm text-gray-500 line-through">£{{ deal.originalPrice }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm">Est. Profit:</span>
              <span class="font-medium text-purple-600">£{{ deal.estimatedProfit }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm">Sale Potential:</span>
              <span :class="getPotentialBadgeClass(deal.salePotential)" 
                class="px-2 py-1 rounded-full text-xs font-medium">
                {{ deal.salePotential }}
              </span>
            </div>
          </div>
          
          <div class="mt-4 flex space-x-2">
            <button @click="approveDeal(deal.id)" 
              class="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
              Approve & Buy
            </button>
            <button @click="rejectDeal(deal.id)" 
              class="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
              Reject
            </button>
            <a :href="deal.vintedUrl" target="_blank" 
              class="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm">
              View
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase Tracking Section -->
    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">Purchase Tracking</h2>
      
      <div v-if="activePurchases.length === 0" class="text-center text-gray-500 py-8">
        No active purchases. Approved deals will appear here once purchased.
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full table-auto border-collapse">
          <thead>
            <tr class="bg-gray-100 text-left">
              <th class="px-4 py-2 border">Item</th>
              <th class="px-4 py-2 border">Price</th>
              <th class="px-4 py-2 border">Seller</th>
              <th class="px-4 py-2 border">Status</th>
              <th class="px-4 py-2 border">Purchased</th>
              <th class="px-4 py-2 border">Expected Delivery</th>
              <th class="px-4 py-2 border">Tracking</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="purchase in activePurchases" :key="purchase.id" class="hover:bg-gray-50">
              <td class="px-4 py-2 border font-medium">{{ purchase.title }}</td>
              <td class="px-4 py-2 border">£{{ purchase.price }}</td>
              <td class="px-4 py-2 border">{{ purchase.seller }}</td>
              <td class="px-4 py-2 border">
                <span :class="getStatusBadgeClass(purchase.status)" 
                  class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ purchase.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-4 py-2 border text-sm">{{ formatDate(purchase.purchasedAt) }}</td>
              <td class="px-4 py-2 border text-sm">{{ purchase.expectedDelivery || '-' }}</td>
              <td class="px-4 py-2 border text-sm">{{ purchase.trackingNumber || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Search Query Modal -->
    <div v-if="showAddSearchModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Add Search Query</h3>
        <form @submit.prevent="addSearchQuery">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Search Query</label>
              <input v-model="newQuery.query" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Zara jacket size L">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select v-model="newQuery.category" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select category</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
                <option value="Bags">Bags</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Price (£)</label>
              <input v-model.number="newQuery.maxPrice" type="number" min="1" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          <div class="flex space-x-3 mt-6">
            <button type="submit" 
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Add Query
            </button>
            <button type="button" @click="cancelAddQuery" 
              class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Buy',
  data() {
    return {
      showAddSearchModal: false,
      newQuery: {
        query: '',
        category: '',
        maxPrice: 20
      }
    }
  },
  computed: {
    ...mapState('buy', ['searchQueries', 'deals', 'purchases']),
    ...mapGetters('buy', [
      'pendingDeals',
      'activePurchases',
      'totalEstimatedProfit',
      'searchQueriesCount'
    ])
  },
  mounted() {
    this.fetchSearchQueries()
  },
  methods: {
    ...mapActions('buy', [
      'fetchSearchQueries',
      'addSearchQuery',
      'updateSearchQuery',
      'deleteSearchQuery',
      'approveDeal',
      'rejectDeal'
    ]),
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    getStatusBadgeClass(status) {
      const statusClasses = {
        'active': 'bg-green-100 text-green-800',
        'paused': 'bg-yellow-100 text-yellow-800',
        'pending_review': 'bg-orange-100 text-orange-800',
        'approved': 'bg-green-100 text-green-800',
        'rejected': 'bg-red-100 text-red-800',
        'pending_purchase': 'bg-blue-100 text-blue-800',
        'purchased': 'bg-green-100 text-green-800',
        'shipped': 'bg-purple-100 text-purple-800'
      }
      return statusClasses[status] || 'bg-gray-100 text-gray-800'
    },
    
    getPotentialBadgeClass(potential) {
      const potentialClasses = {
        'high': 'bg-green-100 text-green-800',
        'medium': 'bg-yellow-100 text-yellow-800',
        'low': 'bg-red-100 text-red-800'
      }
      return potentialClasses[potential] || 'bg-gray-100 text-gray-800'
    },
    
    async toggleQueryStatus(query) {
      const newStatus = query.status === 'active' ? 'paused' : 'active'
      await this.updateSearchQuery({
        id: query.id,
        updates: { status: newStatus }
      })
    },
    
    async deleteQuery(id) {
      if (confirm('Are you sure you want to delete this search query?')) {
        await this.deleteSearchQuery(id)
      }
    },
    
    async addSearchQuery() {
      await this.addSearchQuery({ ...this.newQuery })
      this.cancelAddQuery()
    },
    
    cancelAddQuery() {
      this.showAddSearchModal = false
      this.newQuery = {
        query: '',
        category: '',
        maxPrice: 20
      }
    }
  }
}
</script>