const sampleDeals = [
  {
    id: '1',
    source: 'vinted',
    title: 'iPhone 14 Pro 128GB Deep Purple - Excellent condition',
    price: 720,
    url: 'https://vinted.com/items/123456',
    sellerRating: 4.8,
    estResale: 950,
    marginPct: 24,
    score: 'A',
    ageMinutes: 15,
    photos: ['/images/deal-1.jpg', '/images/deal-2.jpg']
  },
  {
    id: '2',
    source: 'vinted',
    title: 'MacBook Air M2 256GB Silver',
    price: 900,
    url: 'https://vinted.com/items/123457',
    sellerRating: 4.6,
    estResale: 1150,
    marginPct: 22,
    score: 'A',
    ageMinutes: 32,
    photos: ['/images/deal-3.jpg']
  },
  {
    id: '3',
    source: 'vinted',
    title: 'AirPods Pro 2nd Gen',
    price: 180,
    url: 'https://vinted.com/items/123458',
    sellerRating: 4.2,
    estResale: 220,
    marginPct: 18,
    score: 'B',
    ageMinutes: 67,
    photos: ['/images/deal-4.jpg']
  }
]

export default {
  namespaced: true,
  state: {
    deals: sampleDeals,
    selectedDeal: null,
    filters: {
      source: '',
      minMargin: 0,
      minScore: '',
      maxPrice: 0
    },
    savedSearches: [
      { id: '1', name: 'iPhone Deals >20%', query: 'iPhone margin:>20' },
      { id: '2', name: 'MacBook Under £1000', query: 'MacBook price:<1000' }
    ],
    rules: [
      {
        id: '1',
        name: 'High-value iPhone deals',
        query: 'iPhone',
        maxPrice: 800,
        minMargin: 20,
        minSellerRating: 4.5,
        requiredKeywords: ['excellent', 'mint'],
        excludedKeywords: ['damaged', 'cracked'],
        minPhotos: 3,
        active: true
      }
    ],
    loading: false,
    error: null
  },
  mutations: {
    SET_DEALS(state, deals) {
      state.deals = deals
    },
    SET_SELECTED_DEAL(state, deal) {
      state.selectedDeal = deal
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },
    ADD_SAVED_SEARCH(state, search) {
      state.savedSearches.push(search)
    },
    DELETE_SAVED_SEARCH(state, id) {
      state.savedSearches = state.savedSearches.filter(s => s.id !== id)
    },
    ADD_RULE(state, rule) {
      state.rules.push(rule)
    },
    UPDATE_RULE(state, { id, updates }) {
      const index = state.rules.findIndex(rule => rule.id === id)
      if (index !== -1) {
        state.rules[index] = { ...state.rules[index], ...updates }
      }
    },
    DELETE_RULE(state, id) {
      state.rules = state.rules.filter(rule => rule.id !== id)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async fetchDeals({ commit }) {
      commit('SET_LOADING', true)
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        commit('SET_DEALS', sampleDeals)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    selectDeal({ commit }, deal) {
      commit('SET_SELECTED_DEAL', deal)
    },
    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters)
    },
    saveSearch({ commit }, search) {
      const newSearch = {
        ...search,
        id: Date.now().toString()
      }
      commit('ADD_SAVED_SEARCH', newSearch)
    },
    deleteSavedSearch({ commit }, id) {
      commit('DELETE_SAVED_SEARCH', id)
    },
    createRule({ commit }, rule) {
      const newRule = {
        ...rule,
        id: Date.now().toString(),
        active: true
      }
      commit('ADD_RULE', newRule)
    },
    updateRule({ commit }, { id, updates }) {
      commit('UPDATE_RULE', { id, updates })
    },
    deleteRule({ commit }, id) {
      commit('DELETE_RULE', id)
    }
  },
  getters: {
    filteredDeals: (state) => {
      return state.deals.filter(deal => {
        return (!state.filters.source || deal.source === state.filters.source) &&
               (state.filters.minMargin === 0 || deal.marginPct >= state.filters.minMargin) &&
               (!state.filters.minScore || deal.score >= state.filters.minScore) &&
               (state.filters.maxPrice === 0 || deal.price <= state.filters.maxPrice)
      })
    },
    topDeals: (state) => {
      return state.deals
        .filter(deal => deal.score === 'A')
        .slice(0, 5)
    }
  }
}