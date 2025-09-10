import type { Order } from '@/types'

export interface OrdersState {
  orders: Order[]
  loading: boolean
  error: string | null
  filters: {
    status: string
    platform: string
    dateRange: string
  }
}

const state: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    platform: '',
    dateRange: ''
  }
}

const mutations = {
  SET_ORDERS(state: OrdersState, orders: Order[]) {
    state.orders = orders
  },
  ADD_ORDER(state: OrdersState, order: Order) {
    state.orders.push(order)
  },
  UPDATE_ORDER(state: OrdersState, updatedOrder: Order) {
    const index = state.orders.findIndex(order => order.id === updatedOrder.id)
    if (index !== -1) {
      state.orders[index] = updatedOrder
    }
  },
  SET_LOADING(state: OrdersState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: OrdersState, error: string | null) {
    state.error = error
  },
  SET_FILTERS(state: OrdersState, filters: Partial<OrdersState['filters']>) {
    state.filters = { ...state.filters, ...filters }
  }
}

const actions = {
  async fetchOrders({ commit }: any) {
    commit('SET_LOADING', true)
    try {
      const orders = await new Promise<Order[]>(resolve => {
        setTimeout(() => resolve(generateMockOrders()), 600)
      })
      commit('SET_ORDERS', orders)
    } catch (error) {
      commit('SET_ERROR', 'Failed to fetch orders')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateOrderStatus({ commit }: any, { orderId, status }: { orderId: string, status: Order['status'] }) {
    const order = state.orders.find(o => o.id === orderId)
    if (order) {
      const updatedOrder = { ...order, status }
      commit('UPDATE_ORDER', updatedOrder)
    }
  }
}

const getters = {
  filteredOrders: (state: OrdersState) => {
    let filtered = state.orders
    
    if (state.filters.status) {
      filtered = filtered.filter(order => order.status === state.filters.status)
    }
    
    if (state.filters.platform) {
      filtered = filtered.filter(order => order.platform === state.filters.platform)
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },
  
  ordersByStatus: (state: OrdersState) => (status: Order['status']) => {
    return state.orders.filter(order => order.status === status)
  },
  
  pendingPickOrders: (state: OrdersState) => {
    return state.orders.filter(order => order.status === 'pending_pick')
  }
}

function generateMockOrders(): Order[] {
  const platforms: Order['platform'][] = ['vinted', 'ebay']
  const statuses: Order['status'][] = ['pending_pick', 'label_pending', 'label_ready', 'dispatched']
  const buyers = ['buyer1', 'buyer2', 'buyer3', 'buyer4', 'buyer5']
  
  return Array.from({ length: 20 }, (_, i) => {
    const salePrice = Math.floor(Math.random() * 300) + 100
    const shippingPaid = Math.floor(Math.random() * 15) + 5
    
    return {
      id: `order-${i + 1}`,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      itemId: `item-${Math.floor(Math.random() * 50) + 1}`,
      buyer: buyers[Math.floor(Math.random() * buyers.length)],
      salePrice,
      shippingPaid,
      feesEst: Math.floor(salePrice * 0.1),
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      buyerRating: Math.floor(Math.random() * 5) + 1
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}