import shippingData from '../../data/shipping.json'

const state = () => ({
  shipments: [...shippingData],
  currentShipment: null,
  loading: false,
  searchQuery: '',
  filters: {
    status: '',
    direction: '',
    courier: ''
  }
})

const mutations = {
  SET_SHIPMENTS(state, shipments) {
    state.shipments = shipments
  },
  SET_CURRENT_SHIPMENT(state, shipment) {
    state.currentShipment = shipment
  },
  ADD_SHIPMENT(state, shipment) {
    // Generate new ID
    const maxId = Math.max(...state.shipments.map(s => s.id))
    shipment.id = maxId + 1
    shipment.createdAt = new Date().toISOString()
    shipment.updatedAt = new Date().toISOString()
    state.shipments.push(shipment)
  },
  UPDATE_SHIPMENT(state, updatedShipment) {
    const index = state.shipments.findIndex(shipment => shipment.id === updatedShipment.id)
    if (index !== -1) {
      updatedShipment.updatedAt = new Date().toISOString()
      state.shipments.splice(index, 1, updatedShipment)
    }
  },
  DELETE_SHIPMENT(state, shipmentId) {
    const index = state.shipments.findIndex(shipment => shipment.id === shipmentId)
    if (index !== -1) {
      state.shipments.splice(index, 1)
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
  async fetchShipments({ commit }) {
    commit('SET_LOADING', true)
    try {
      // In a real app, this would be an API call
      commit('SET_SHIPMENTS', shippingData)
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async fetchShipment({ commit }, shipmentId) {
    commit('SET_LOADING', true)
    try {
      // In a real app, this would be an API call
      const shipment = shippingData.find(shipment => shipment.id === parseInt(shipmentId))
      commit('SET_CURRENT_SHIPMENT', shipment)
      return shipment
    } catch (error) {
      console.error('Error fetching shipment:', error)
      return null
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async createShipment({ commit }, shipmentData) {
    commit('SET_LOADING', true)
    try {
      // In a real app, this would be an API call
      const shipment = {
        ...shipmentData,
        id: Date.now() // Simple ID generation for mock
      }
      commit('ADD_SHIPMENT', shipment)
      return shipment
    } catch (error) {
      console.error('Error creating shipment:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateShipment({ commit }, shipmentData) {
    commit('SET_LOADING', true)
    try {
      // In a real app, this would be an API call
      commit('UPDATE_SHIPMENT', shipmentData)
      return shipmentData
    } catch (error) {
      console.error('Error updating shipment:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async deleteShipment({ commit }, shipmentId) {
    commit('SET_LOADING', true)
    try {
      // In a real app, this would be an API call
      commit('DELETE_SHIPMENT', shipmentId)
    } catch (error) {
      console.error('Error deleting shipment:', error)
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
  allShipments: (state) => state.shipments,
  
  filteredShipments: (state) => {
    let shipments = state.shipments
    
    // Apply search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      shipments = shipments.filter(shipment => 
        (shipment.itemName || '').toLowerCase().includes(query) ||
        (shipment.trackingNumber || '').toLowerCase().includes(query) ||
        (shipment.courier || '').toLowerCase().includes(query) ||
        (shipment.status || '').toLowerCase().includes(query)
      )
    }
    
    // Apply filters
    if (state.filters.status) {
      shipments = shipments.filter(shipment => shipment.status === state.filters.status)
    }
    
    if (state.filters.direction) {
      shipments = shipments.filter(shipment => shipment.direction === state.filters.direction)
    }
    
    if (state.filters.courier) {
      shipments = shipments.filter(shipment => shipment.courier === state.filters.courier)
    }
    
    return shipments
  },
  
  currentShipment: (state) => state.currentShipment,
  
  isLoading: (state) => state.loading,
  
  searchQuery: (state) => state.searchQuery,
  
  filters: (state) => state.filters,
  
  shipmentStats: (state) => {
    const shipments = state.shipments
    const stats = {
      total: shipments.length,
      inbound: shipments.filter(s => s.direction === 'inbound').length,
      outbound: shipments.filter(s => s.direction === 'outbound').length,
      pending: shipments.filter(s => s.status === 'pending').length,
      shipped: shipments.filter(s => s.status === 'shipped').length,
      in_transit: shipments.filter(s => s.status === 'in_transit').length,
      delivered: shipments.filter(s => s.status === 'delivered').length,
      delayed: shipments.filter(s => s.status === 'delayed').length,
      returned: shipments.filter(s => s.status === 'returned').length
    }
    return stats
  },
  
  courierList: (state) => {
    const couriers = new Set(state.shipments.map(shipment => shipment.courier).filter(Boolean))
    return Array.from(couriers).sort()
  },
  
  statusList: () => [
    'pending',
    'shipped', 
    'in_transit',
    'delivered',
    'delayed',
    'returned'
  ]
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}