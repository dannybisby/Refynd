// Sample data for mocking
const sampleItems = [
  {
    id: '1',
    sku: 'ITEM-001',
    title: 'iPhone 13 Pro 256GB Space Gray',
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    storageGb: 256,
    condition: 'like_new',
    source: 'vinted',
    buyPrice: 680,
    askPrice: 850,
    estResale: 900,
    channels: ['vinted'],
    location: 'A1-B2',
    status: 'listed',
    serial: 'ABC123456789',
    photos: ['/images/iphone-1.jpg', '/images/iphone-2.jpg'],
    createdAt: '2024-01-15T10:30:00Z',
    listedAt: '2024-01-15T14:00:00Z'
  },
  {
    id: '2',
    sku: 'ITEM-002',
    title: 'Samsung Galaxy Watch 4 44mm',
    brand: 'Samsung',
    model: 'Galaxy Watch 4',
    condition: 'good',
    source: 'facebook',
    buyPrice: 120,
    askPrice: 180,
    estResale: 200,
    channels: ['vinted', 'ebay'],
    location: 'A2-C1',
    status: 'in_stock',
    photos: ['/images/watch-1.jpg'],
    createdAt: '2024-01-10T09:15:00Z'
  }
]

export default {
  namespaced: true,
  state: {
    items: sampleItems,
    selectedItems: [],
    filters: {
      category: '',
      condition: '',
      source: '',
      status: '',
      location: ''
    },
    loading: false,
    error: null
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },
    ADD_ITEM(state, item) {
      state.items.push(item)
    },
    UPDATE_ITEM(state, { id, updates }) {
      const index = state.items.findIndex(item => item.id === id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates }
      }
    },
    DELETE_ITEM(state, id) {
      state.items = state.items.filter(item => item.id !== id)
    },
    SET_SELECTED_ITEMS(state, items) {
      state.selectedItems = items
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async fetchItems({ commit }) {
      commit('SET_LOADING', true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        commit('SET_ITEMS', sampleItems)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async createItem({ commit }, item) {
      try {
        const newItem = {
          ...item,
          id: Date.now().toString(),
          sku: `ITEM-${Date.now()}`,
          createdAt: new Date().toISOString()
        }
        commit('ADD_ITEM', newItem)
        return newItem
      } catch (error) {
        commit('SET_ERROR', error.message)
      }
    },
    updateItem({ commit }, { id, updates }) {
      commit('UPDATE_ITEM', { id, updates })
    },
    deleteItem({ commit }, id) {
      commit('DELETE_ITEM', id)
    },
    selectItems({ commit }, items) {
      commit('SET_SELECTED_ITEMS', items)
    },
    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters)
    }
  },
  getters: {
    filteredItems: (state) => {
      return state.items.filter(item => {
        return (!state.filters.category || item.category === state.filters.category) &&
               (!state.filters.condition || item.condition === state.filters.condition) &&
               (!state.filters.source || item.source === state.filters.source) &&
               (!state.filters.status || item.status === state.filters.status) &&
               (!state.filters.location || item.location === state.filters.location)
      })
    },
    itemsCount: (state) => state.items.length,
    stockValue: (state) => state.items.reduce((sum, item) => sum + (item.buyPrice || 0), 0),
    estimatedValue: (state) => state.items.reduce((sum, item) => sum + (item.estResale || 0), 0)
  }
}