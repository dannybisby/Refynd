// import inventoryData from '../../data/inventory.json'

const state = () => ({
  items: [], // [...inventoryData],
  currentItem: null,
  loading: false,
  searchQuery: '',
  filters: {
    status: '',
    category: '',
    brand: ''
  }
})

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items
  },
  SET_CURRENT_ITEM(state, item) {
    state.currentItem = item
  },
  ADD_ITEM(state, item) {
    // Generate new ID
    const maxId = Math.max(...state.items.map(i => i.id))
    item.id = maxId + 1
    state.items.push(item)
  },
  UPDATE_ITEM(state, updatedItem) {
    const index = state.items.findIndex(item => item.id === updatedItem.id)
    if (index !== -1) {
      state.items.splice(index, 1, updatedItem)
    }
  },
  DELETE_ITEM(state, itemId) {
    const index = state.items.findIndex(item => item.id === itemId)
    if (index !== -1) {
      state.items.splice(index, 1)
    }
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  }
}

const actions = {
  async fetchItems({ commit }) {
    commit('SET_LOADING', true)
    try {
      // In a real app, this would be an API call
      commit('SET_ITEMS', inventoryData)
    } catch (error) {
      console.error('Error fetching inventory items:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async fetchItem({ commit }, itemId) {
    commit('SET_LOADING', true)
    try {
      // In a real app, this would be an API call
      const item = inventoryData.find(item => item.id === parseInt(itemId))
      commit('SET_CURRENT_ITEM', item)
      return item
    } catch (error) {
      console.error('Error fetching inventory item:', error)
      return null
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async createItem({ commit }, itemData) {
    commit('SET_LOADING', true)
    try {
      // In a real app, this would be an API call
      const item = {
        ...itemData,
        id: Date.now(), // Simple ID generation for mock
        dateOfPurchase: itemData.dateOfPurchase || new Date().toISOString().split('T')[0]
      }
      commit('ADD_ITEM', item)
      return item
    } catch (error) {
      console.error('Error creating inventory item:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateItem({ commit }, itemData) {
    commit('SET_LOADING', true)
    try {
      // In a real app, this would be an API call
      commit('UPDATE_ITEM', itemData)
      return itemData
    } catch (error) {
      console.error('Error updating inventory item:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async deleteItem({ commit }, itemId) {
    commit('SET_LOADING', true)
    try {
      // In a real app, this would be an API call
      commit('DELETE_ITEM', itemId)
    } catch (error) {
      console.error('Error deleting inventory item:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  setSearchQuery({ commit }, query) {
    commit('SET_SEARCH_QUERY', query)
  },
  
  setFilters({ commit }, filters) {
    commit('SET_FILTERS', filters)
  }
}

const getters = {
  allItems: (state) => state.items,
  
  filteredItems: (state) => {
    let items = state.items
    
    // Apply search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      items = items.filter(item => 
        (item.itemName || '').toLowerCase().includes(query) ||
        (item.brand || '').toLowerCase().includes(query) ||
        (item.seller || '').toLowerCase().includes(query) ||
        (item.sku || '').toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query)
      )
    }
    
    // Apply filters
    if (state.filters.status) {
      items = items.filter(item => item.status === state.filters.status)
    }
    
    if (state.filters.category) {
      items = items.filter(item => item.category === state.filters.category)
    }
    
    if (state.filters.brand) {
      items = items.filter(item => item.brand === state.filters.brand)
    }
    
    return items
  },
  
  currentItem: (state) => state.currentItem,
  
  isLoading: (state) => state.loading,
  
  searchQuery: (state) => state.searchQuery,
  
  filters: (state) => state.filters,
  
  totalValue: (state) => {
    return state.items.reduce((total, item) => {
      return total + (item.allInCost || 0)
    }, 0)
  },
  
  totalPotentialProfit: (state) => {
    return state.items.reduce((total, item) => {
      if (item.targetSalesPrice && item.allInCost) {
        return total + (item.targetSalesPrice - item.allInCost)
      }
      return total
    }, 0)
  },
  
  itemsByStatus: (state) => {
    return state.items.reduce((acc, item) => {
      const status = item.status || 'Unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})
  },
  
  categories: (state) => {
    const categories = new Set(state.items.map(item => item.category).filter(Boolean))
    return Array.from(categories).sort()
  },
  
  brands: (state) => {
    const brands = new Set(state.items.map(item => item.brand).filter(Boolean))
    return Array.from(brands).sort()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}