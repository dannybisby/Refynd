const state = {
  searchQueries: [
    {
      id: 1,
      query: 'Zara jacket size L',
      category: 'Outerwear',
      maxPrice: 25,
      status: 'active',
      lastChecked: '2024-01-15T10:30:00Z',
      resultsFound: 12
    },
    {
      id: 2,
      query: 'Nike sneakers size 9',
      category: 'Shoes',
      maxPrice: 40,
      status: 'active',
      lastChecked: '2024-01-15T09:15:00Z',
      resultsFound: 8
    },
    {
      id: 3,
      query: 'Vintage band t-shirt',
      category: 'Tops',
      maxPrice: 15,
      status: 'paused',
      lastChecked: '2024-01-14T16:20:00Z',
      resultsFound: 3
    }
  ],
  
  deals: [
    {
      id: 1,
      title: 'Zara Black Blazer Size L',
      brand: 'Zara',
      size: 'L',
      price: 18.50,
      originalPrice: 89.99,
      seller: 'fashionista123',
      condition: 'Very good',
      images: ['https://via.placeholder.com/150x200/000000/FFFFFF?text=Zara+Blazer'],
      searchQuery: 'Zara jacket size L',
      vintedUrl: 'https://vinted.com/items/123456',
      discoveredAt: '2024-01-15T10:30:00Z',
      estimatedProfit: 25.50,
      salePotential: 'high',
      status: 'pending_review'
    },
    {
      id: 2,
      title: 'Nike Air Max 90 Size 9',
      brand: 'Nike',
      size: '9',
      price: 35.00,
      originalPrice: 120.00,
      seller: 'sneakerhead_uk',
      condition: 'Good',
      images: ['https://via.placeholder.com/150x200/FF0000/FFFFFF?text=Nike+Air+Max'],
      searchQuery: 'Nike sneakers size 9',
      vintedUrl: 'https://vinted.com/items/789012',
      discoveredAt: '2024-01-15T09:15:00Z',
      estimatedProfit: 30.00,
      salePotential: 'medium',
      status: 'pending_review'
    },
    {
      id: 3,
      title: 'Vintage Band T-Shirt',
      brand: 'Vintage',
      size: 'M',
      price: 12.00,
      originalPrice: 25.00,
      seller: 'vintage_collector',
      condition: 'Good',
      images: ['https://via.placeholder.com/150x200/800080/FFFFFF?text=Vintage+Tee'],
      searchQuery: 'Vintage band t-shirt',
      vintedUrl: 'https://vinted.com/items/345678',
      discoveredAt: '2024-01-14T16:20:00Z',
      estimatedProfit: 8.00,
      salePotential: 'low',
      status: 'approved'
    }
  ],
  
  purchases: [
    {
      id: 1,
      dealId: 3,
      title: 'Vintage Band T-Shirt',
      price: 12.00,
      seller: 'vintage_collector',
      status: 'purchased',
      purchasedAt: '2024-01-14T17:00:00Z',
      expectedDelivery: '2024-01-18',
      trackingNumber: 'VT123456789GB'
    }
  ]
}

const mutations = {
  SET_SEARCH_QUERIES(state, queries) {
    state.searchQueries = queries
  },
  
  ADD_SEARCH_QUERY(state, query) {
    const newQuery = {
      ...query,
      id: Date.now(),
      status: 'active',
      lastChecked: new Date().toISOString(),
      resultsFound: 0
    }
    state.searchQueries = [...state.searchQueries, newQuery]
  },
  
  UPDATE_SEARCH_QUERY(state, { id, updates }) {
    const index = state.searchQueries.findIndex(q => q.id === id)
    if (index !== -1) {
      const newQueries = [...state.searchQueries]
      newQueries[index] = { ...newQueries[index], ...updates }
      state.searchQueries = newQueries
    }
  },
  
  DELETE_SEARCH_QUERY(state, id) {
    state.searchQueries = state.searchQueries.filter(q => q.id !== id)
  },
  
  SET_DEALS(state, deals) {
    state.deals = deals
  },
  
  UPDATE_DEAL_STATUS(state, { id, status }) {
    const deal = state.deals.find(d => d.id === id)
    if (deal) {
      deal.status = status
    }
  },
  
  ADD_PURCHASE(state, purchase) {
    const newPurchase = {
      ...purchase,
      id: Date.now(),
      purchasedAt: new Date().toISOString()
    }
    state.purchases = [...state.purchases, newPurchase]
  },
  
  UPDATE_PURCHASE_STATUS(state, { id, status, trackingNumber }) {
    const purchase = state.purchases.find(p => p.id === id)
    if (purchase) {
      purchase.status = status
      if (trackingNumber) purchase.trackingNumber = trackingNumber
    }
  }
}

const actions = {
  async fetchSearchQueries({ commit }) {
    // In a real app, this would fetch from API
    // For now, using mock data
    commit('SET_SEARCH_QUERIES', state.searchQueries)
  },
  
  async addSearchQuery({ commit }, query) {
    commit('ADD_SEARCH_QUERY', query)
  },
  
  async updateSearchQuery({ commit }, { id, updates }) {
    commit('UPDATE_SEARCH_QUERY', { id, updates })
  },
  
  async deleteSearchQuery({ commit }, id) {
    commit('DELETE_SEARCH_QUERY', id)
  },
  
  async approveDeal({ commit, dispatch, state }, dealId) {
    commit('UPDATE_DEAL_STATUS', { id: dealId, status: 'approved' })
    
    const deal = state.deals.find(d => d.id === dealId)
    if (deal) {
      dispatch('purchaseItem', {
        dealId,
        title: deal.title,
        price: deal.price,
        seller: deal.seller,
        status: 'pending_purchase'
      })
    }
  },
  
  async rejectDeal({ commit }, dealId) {
    commit('UPDATE_DEAL_STATUS', { id: dealId, status: 'rejected' })
  },
  
  async purchaseItem({ commit }, purchase) {
    commit('ADD_PURCHASE', purchase)
  }
}

const getters = {
  activeSearchQueries: state => state.searchQueries.filter(q => q.status === 'active'),
  
  pendingDeals: state => state.deals.filter(d => d.status === 'pending_review'),
  
  approvedDeals: state => state.deals.filter(d => d.status === 'approved'),
  
  activePurchases: state => state.purchases.filter(p => ['pending_purchase', 'purchased', 'shipped'].includes(p.status)),
  
  totalEstimatedProfit: state => {
    return state.deals
      .filter(d => d.status !== 'rejected')
      .reduce((total, deal) => total + deal.estimatedProfit, 0)
  },
  
  searchQueriesCount: state => state.searchQueries.length,
  dealsCount: state => state.deals.length,
  purchasesCount: state => state.purchases.length
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}