export default {
  namespaced: true,
  state: {
    listings: [],
    drafts: [
      {
        id: '1',
        title: 'iPhone 13 Pro 256GB',
        status: 'draft',
        createdAt: '2024-01-15T10:00:00Z',
        platforms: ['vinted']
      }
    ],
    templates: [
      {
        id: '1',
        name: 'iPhone Template',
        category: 'smartphones',
        fields: {
          brand: 'Apple',
          condition: 'like_new',
          description: 'Excellent condition iPhone with original box and accessories.'
        }
      }
    ],
    currentComposer: {
      step: 1,
      data: {}
    },
    loading: false,
    error: null
  },
  mutations: {
    SET_LISTINGS(state, listings) {
      state.listings = listings
    },
    ADD_DRAFT(state, draft) {
      state.drafts.push(draft)
    },
    UPDATE_DRAFT(state, { id, updates }) {
      const index = state.drafts.findIndex(draft => draft.id === id)
      if (index !== -1) {
        state.drafts[index] = { ...state.drafts[index], ...updates }
      }
    },
    DELETE_DRAFT(state, id) {
      state.drafts = state.drafts.filter(draft => draft.id !== id)
    },
    SET_COMPOSER_STEP(state, step) {
      state.currentComposer.step = step
    },
    SET_COMPOSER_DATA(state, data) {
      state.currentComposer.data = { ...state.currentComposer.data, ...data }
    },
    RESET_COMPOSER(state) {
      state.currentComposer = { step: 1, data: {} }
    },
    ADD_TEMPLATE(state, template) {
      state.templates.push(template)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    saveDraft({ commit }, draft) {
      const newDraft = {
        ...draft,
        id: Date.now().toString(),
        status: 'draft',
        createdAt: new Date().toISOString()
      }
      commit('ADD_DRAFT', newDraft)
      return newDraft
    },
    updateDraft({ commit }, { id, updates }) {
      commit('UPDATE_DRAFT', { id, updates })
    },
    deleteDraft({ commit }, id) {
      commit('DELETE_DRAFT', id)
    },
    setComposerStep({ commit }, step) {
      commit('SET_COMPOSER_STEP', step)
    },
    updateComposerData({ commit }, data) {
      commit('SET_COMPOSER_DATA', data)
    },
    resetComposer({ commit }) {
      commit('RESET_COMPOSER')
    },
    generateDescription({ commit }, itemData) {
      // Mock AI description generation
      const description = `${itemData.brand} ${itemData.model} in ${itemData.condition} condition. ${itemData.inclusions || 'Comes as shown in photos.'}`
      commit('SET_COMPOSER_DATA', { description })
      return description
    },
    saveTemplate({ commit }, template) {
      const newTemplate = {
        ...template,
        id: Date.now().toString()
      }
      commit('ADD_TEMPLATE', newTemplate)
      return newTemplate
    }
  },
  getters: {
    draftCount: (state) => state.drafts.length,
    templatesByCategory: (state) => (category) => {
      return state.templates.filter(template => template.category === category)
    }
  }
}