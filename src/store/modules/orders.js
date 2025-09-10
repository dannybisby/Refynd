const sampleOrders = [
  {
    id: '1',
    platform: 'vinted',
    itemId: '1',
    buyer: 'john_doe_123',
    salePrice: 850,
    shippingPaid: 5.99,
    feesEst: 85,
    createdAt: '2024-01-16T09:30:00Z',
    status: 'pending_pick'
  },
  {
    id: '2',
    platform: 'ebay',
    itemId: '2',
    buyer: 'tech_collector',
    salePrice: 180,
    shippingPaid: 4.99,
    feesEst: 18,
    createdAt: '2024-01-15T14:45:00Z',
    status: 'label_ready'
  }
]

export default {
  namespaced: true,
  state: {
    orders: sampleOrders,
    selectedOrder: null,
    filters: {
      status: '',
      platform: '',
      dateRange: ''
    },
    loading: false,
    error: null
  },
  mutations: {
    SET_ORDERS(state, orders) {
      state.orders = orders
    },
    ADD_ORDER(state, order) {
      state.orders.push(order)
    },
    UPDATE_ORDER(state, { id, updates }) {
      const index = state.orders.findIndex(order => order.id === id)
      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...updates }
      }
    },
    SET_SELECTED_ORDER(state, order) {
      state.selectedOrder = order
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
    async fetchOrders({ commit }) {
      commit('SET_LOADING', true)
      try {
        await new Promise(resolve => setTimeout(resolve, 600))
        commit('SET_ORDERS', sampleOrders)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    updateOrderStatus({ commit }, { id, status }) {
      commit('UPDATE_ORDER', { id, updates: { status } })
    },
    selectOrder({ commit }, order) {
      commit('SET_SELECTED_ORDER', order)
    },
    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters)
    }
  },
  getters: {
    filteredOrders: (state) => {
      return state.orders.filter(order => {
        return (!state.filters.status || order.status === state.filters.status) &&
               (!state.filters.platform || order.platform === state.filters.platform)
      })
    },
    ordersToPick: (state) => {
      return state.orders.filter(order => order.status === 'pending_pick')
    },
    ordersReadyToShip: (state) => {
      return state.orders.filter(order => order.status === 'label_ready')
    },
    totalRevenue: (state) => {
      return state.orders.reduce((sum, order) => sum + order.salePrice, 0)
    },
    totalProfit: (state) => {
      return state.orders.reduce((sum, order) => sum + (order.salePrice - order.feesEst), 0)
    }
  }
}