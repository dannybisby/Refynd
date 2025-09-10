import type { Deal } from '@/types'

export interface DealsState {
  deals: Deal[]
  loading: boolean
  error: string | null
  selectedDeals: string[]
  filters: {
    source: string
    minMargin: number
    maxPrice: number
    minSellerRating: number
  }
  viewMode: 'cards' | 'table'
}

const state: DealsState = {
  deals: [],
  loading: false,
  error: null,
  selectedDeals: [],
  filters: {
    source: '',
    minMargin: 0,
    maxPrice: 0,
    minSellerRating: 0
  },
  viewMode: 'cards'
}

const mutations = {
  SET_DEALS(state: DealsState, deals: Deal[]) {
    state.deals = deals
  },
  SET_LOADING(state: DealsState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: DealsState, error: string | null) {
    state.error = error
  },
  SET_SELECTED_DEALS(state: DealsState, dealIds: string[]) {
    state.selectedDeals = dealIds
  },
  SET_FILTERS(state: DealsState, filters: Partial<DealsState['filters']>) {
    state.filters = { ...state.filters, ...filters }
  },
  SET_VIEW_MODE(state: DealsState, mode: 'cards' | 'table') {
    state.viewMode = mode
  },
  TOGGLE_DEAL_SELECTION(state: DealsState, dealId: string) {
    const index = state.selectedDeals.indexOf(dealId)
    if (index === -1) {
      state.selectedDeals.push(dealId)
    } else {
      state.selectedDeals.splice(index, 1)
    }
  }
}

const actions = {
  async fetchDeals({ commit }: any) {
    commit('SET_LOADING', true)
    try {
      const deals = await new Promise<Deal[]>(resolve => {
        setTimeout(() => resolve(generateMockDeals()), 800)
      })
      commit('SET_DEALS', deals)
    } catch (error) {
      commit('SET_ERROR', 'Failed to fetch deals')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  setFilters({ commit }: any, filters: Partial<DealsState['filters']>) {
    commit('SET_FILTERS', filters)
  },
  
  setViewMode({ commit }: any, mode: 'cards' | 'table') {
    commit('SET_VIEW_MODE', mode)
  }
}

const getters = {
  filteredDeals: (state: DealsState) => {
    let filtered = state.deals
    
    if (state.filters.source) {
      filtered = filtered.filter(deal => deal.source === state.filters.source)
    }
    
    if (state.filters.minMargin > 0) {
      filtered = filtered.filter(deal => deal.marginPct >= state.filters.minMargin)
    }
    
    if (state.filters.maxPrice > 0) {
      filtered = filtered.filter(deal => deal.price <= state.filters.maxPrice)
    }
    
    if (state.filters.minSellerRating > 0) {
      filtered = filtered.filter(deal => deal.sellerRating >= state.filters.minSellerRating)
    }
    
    return filtered.sort((a, b) => {
      const scoreOrder = { A: 4, B: 3, C: 2, D: 1 }
      return scoreOrder[b.score] - scoreOrder[a.score]
    })
  }
}

function generateMockDeals(): Deal[] {
  const items = [
    'iPhone 13 Pro 128GB', 'Samsung Galaxy S21', 'OnePlus 9 Pro', 'Google Pixel 6',
    'iPad Air 4th Gen', 'MacBook Air M1', 'Nintendo Switch OLED', 'Sony WH-1000XM4',
    'AirPods Pro 2nd Gen', 'Apple Watch Series 8'
  ]
  
  const scores: Deal['score'][] = ['A', 'B', 'C', 'D']
  
  return Array.from({ length: 25 }, (_, i) => {
    const price = Math.floor(Math.random() * 400) + 50
    const estResale = price + Math.floor(Math.random() * 300) + 100
    const marginPct = ((estResale - price) / price) * 100
    
    return {
      id: `deal-${i + 1}`,
      source: 'vinted',
      title: items[Math.floor(Math.random() * items.length)],
      price,
      url: `https://vinted.com/items/${i + 1}`,
      sellerRating: Math.floor(Math.random() * 5) + 1,
      estResale,
      marginPct: Math.floor(marginPct),
      score: scores[Math.floor(Math.random() * scores.length)],
      ageMinutes: Math.floor(Math.random() * 120),
      photos: ['/api/placeholder/300/300'],
      description: 'Good condition, some wear',
      seller: `seller${i + 1}`,
      location: 'UK'
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