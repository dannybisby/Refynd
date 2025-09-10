import type { Item } from '@/types'

export interface ItemsState {
  items: Item[]
  loading: boolean
  error: string | null
  filters: {
    search: string
    category: string
    condition: string
    source: string
    status: string
    location: string
  }
  selectedItems: string[]
}

const state: ItemsState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    condition: '',
    source: '',
    status: '',
    location: ''
  },
  selectedItems: []
}

const mutations = {
  SET_ITEMS(state: ItemsState, items: Item[]) {
    state.items = items
  },
  ADD_ITEM(state: ItemsState, item: Item) {
    state.items.push(item)
  },
  UPDATE_ITEM(state: ItemsState, updatedItem: Item) {
    const index = state.items.findIndex(item => item.id === updatedItem.id)
    if (index !== -1) {
      state.items[index] = updatedItem
    }
  },
  DELETE_ITEM(state: ItemsState, itemId: string) {
    state.items = state.items.filter(item => item.id !== itemId)
  },
  SET_LOADING(state: ItemsState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: ItemsState, error: string | null) {
    state.error = error
  },
  SET_FILTERS(state: ItemsState, filters: Partial<ItemsState['filters']>) {
    state.filters = { ...state.filters, ...filters }
  },
  SET_SELECTED_ITEMS(state: ItemsState, itemIds: string[]) {
    state.selectedItems = itemIds
  },
  TOGGLE_ITEM_SELECTION(state: ItemsState, itemId: string) {
    const index = state.selectedItems.indexOf(itemId)
    if (index === -1) {
      state.selectedItems.push(itemId)
    } else {
      state.selectedItems.splice(index, 1)
    }
  }
}

const actions = {
  async fetchItems({ commit }: any) {
    commit('SET_LOADING', true)
    try {
      // Mock API call - replace with actual API
      const items = await new Promise<Item[]>(resolve => {
        setTimeout(() => resolve(generateMockItems()), 1000)
      })
      commit('SET_ITEMS', items)
    } catch (error) {
      commit('SET_ERROR', 'Failed to fetch items')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async createItem({ commit }: any, item: Omit<Item, 'id' | 'createdAt'>) {
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    commit('ADD_ITEM', newItem)
    return newItem
  },
  
  async updateItem({ commit }: any, item: Item) {
    commit('UPDATE_ITEM', item)
    return item
  },
  
  async deleteItem({ commit }: any, itemId: string) {
    commit('DELETE_ITEM', itemId)
  },
  
  setFilters({ commit }: any, filters: Partial<ItemsState['filters']>) {
    commit('SET_FILTERS', filters)
  },
  
  selectItems({ commit }: any, itemIds: string[]) {
    commit('SET_SELECTED_ITEMS', itemIds)
  },
  
  toggleItemSelection({ commit }: any, itemId: string) {
    commit('TOGGLE_ITEM_SELECTION', itemId)
  }
}

const getters = {
  filteredItems: (state: ItemsState) => {
    let filtered = state.items
    
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase()
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search) ||
        item.brand?.toLowerCase().includes(search)
      )
    }
    
    if (state.filters.condition) {
      filtered = filtered.filter(item => item.condition === state.filters.condition)
    }
    
    if (state.filters.source) {
      filtered = filtered.filter(item => item.source === state.filters.source)
    }
    
    if (state.filters.status) {
      filtered = filtered.filter(item => item.status === state.filters.status)
    }
    
    if (state.filters.location) {
      filtered = filtered.filter(item => item.location === state.filters.location)
    }
    
    return filtered
  },
  
  itemById: (state: ItemsState) => (id: string) => {
    return state.items.find(item => item.id === id)
  },
  
  selectedItemsData: (state: ItemsState) => {
    return state.items.filter(item => state.selectedItems.includes(item.id))
  }
}

// Mock data generator
function generateMockItems(): Item[] {
  const brands = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Sony', 'Nintendo', 'Microsoft']
  const models = ['iPhone 13', 'Galaxy S21', '9 Pro', 'Pixel 6', 'WH-1000XM4', 'Switch', 'Surface Pro']
  const conditions: Item['condition'][] = ['new', 'like_new', 'good', 'fair']
  const sources: Item['source'][] = ['vinted', 'facebook', 'gumtree', 'carboot', 'charity']
  const statuses: Item['status'][] = ['in_stock', 'listed', 'allocated', 'sold']
  const locations = ['A1-B2', 'A2-C1', 'B1-A3', 'Storage', 'Office']
  
  return Array.from({ length: 50 }, (_, i) => {
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const model = models[Math.floor(Math.random() * models.length)]
    const buyPrice = Math.floor(Math.random() * 500) + 50
    const askPrice = buyPrice + Math.floor(Math.random() * 200) + 50
    
    return {
      id: `item-${i + 1}`,
      sku: `SKU${String(i + 1).padStart(4, '0')}`,
      title: `${brand} ${model}`,
      brand,
      model,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      buyPrice,
      askPrice,
      estResale: askPrice + Math.floor(Math.random() * 100),
      channels: ['vinted'],
      location: locations[Math.floor(Math.random() * locations.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      photos: ['/api/placeholder/300/300'],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: Math.random() > 0.7 ? 'Good condition, minor scratches' : undefined
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