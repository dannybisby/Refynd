import type { Listing } from '@/types'

export interface ListingsState {
  listings: Listing[]
  drafts: Listing[]
  loading: boolean
  error: string | null
}

const state: ListingsState = {
  listings: [],
  drafts: [],
  loading: false,
  error: null
}

const mutations = {
  SET_LISTINGS(state: ListingsState, listings: Listing[]) {
    state.listings = listings
  },
  SET_DRAFTS(state: ListingsState, drafts: Listing[]) {
    state.drafts = drafts
  },
  ADD_DRAFT(state: ListingsState, draft: Listing) {
    state.drafts.push(draft)
  },
  UPDATE_DRAFT(state: ListingsState, updatedDraft: Listing) {
    const index = state.drafts.findIndex(draft => draft.id === updatedDraft.id)
    if (index !== -1) {
      state.drafts[index] = updatedDraft
    }
  },
  DELETE_DRAFT(state: ListingsState, draftId: string) {
    state.drafts = state.drafts.filter(draft => draft.id !== draftId)
  },
  SET_LOADING(state: ListingsState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: ListingsState, error: string | null) {
    state.error = error
  }
}

const actions = {
  async fetchListings({ commit }: any) {
    commit('SET_LOADING', true)
    try {
      const listings = await new Promise<Listing[]>(resolve => {
        setTimeout(() => resolve(generateMockListings()), 500)
      })
      commit('SET_LISTINGS', listings)
    } catch (error) {
      commit('SET_ERROR', 'Failed to fetch listings')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async saveDraft({ commit }: any, draft: Omit<Listing, 'id' | 'createdAt'>) {
    const newDraft: Listing = {
      ...draft,
      id: `draft-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    commit('ADD_DRAFT', newDraft)
    return newDraft
  },
  
  async updateDraft({ commit }: any, draft: Listing) {
    commit('UPDATE_DRAFT', draft)
    return draft
  },
  
  async deleteDraft({ commit }: any, draftId: string) {
    commit('DELETE_DRAFT', draftId)
  }
}

const getters = {
  activeDrafts: (state: ListingsState) => {
    return state.drafts.filter(draft => draft.status === 'draft')
  }
}

function generateMockListings(): Listing[] {
  const platforms: Listing['platform'][] = ['vinted', 'ebay']
  const statuses: Listing['status'][] = ['draft', 'active', 'sold', 'ended']
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `listing-${i + 1}`,
    itemId: `item-${i + 1}`,
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    title: `Mock Listing ${i + 1}`,
    description: 'Mock description for listing',
    price: Math.floor(Math.random() * 200) + 50,
    photos: ['/api/placeholder/300/300'],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: Math.random() > 0.5 ? new Date().toISOString() : undefined
  }))
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}