export default {
  namespaced: true,
  state: {
    darkMode: localStorage.getItem('darkMode') === 'true',
    sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
    commandPaletteOpen: false,
    savedViews: {
      inventory: [
        { id: '1', name: 'Listed Items', filters: { status: 'listed' } },
        { id: '2', name: 'High Value', filters: { minValue: 500 } }
      ],
      deals: [
        { id: '1', name: 'iPhone Deals', filters: { query: 'iPhone' } }
      ]
    },
    notifications: {
      email: true,
      push: true,
      priceAlerts: true
    }
  },
  mutations: {
    SET_DARK_MODE(state, darkMode) {
      state.darkMode = darkMode
      localStorage.setItem('darkMode', darkMode.toString())
      
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    SET_SIDEBAR_COLLAPSED(state, collapsed) {
      state.sidebarCollapsed = collapsed
      localStorage.setItem('sidebarCollapsed', collapsed.toString())
    },
    SET_COMMAND_PALETTE_OPEN(state, open) {
      state.commandPaletteOpen = open
    },
    ADD_SAVED_VIEW(state, { section, view }) {
      if (!state.savedViews[section]) {
        state.savedViews[section] = []
      }
      state.savedViews[section].push(view)
    },
    DELETE_SAVED_VIEW(state, { section, id }) {
      if (state.savedViews[section]) {
        state.savedViews[section] = state.savedViews[section].filter(view => view.id !== id)
      }
    },
    UPDATE_NOTIFICATIONS(state, notifications) {
      state.notifications = { ...state.notifications, ...notifications }
    }
  },
  actions: {
    toggleDarkMode({ commit, state }) {
      commit('SET_DARK_MODE', !state.darkMode)
    },
    toggleSidebar({ commit, state }) {
      commit('SET_SIDEBAR_COLLAPSED', !state.sidebarCollapsed)
    },
    openCommandPalette({ commit }) {
      commit('SET_COMMAND_PALETTE_OPEN', true)
    },
    closeCommandPalette({ commit }) {
      commit('SET_COMMAND_PALETTE_OPEN', false)
    },
    saveView({ commit }, { section, name, filters }) {
      const view = {
        id: Date.now().toString(),
        name,
        filters
      }
      commit('ADD_SAVED_VIEW', { section, view })
    },
    deleteSavedView({ commit }, { section, id }) {
      commit('DELETE_SAVED_VIEW', { section, id })
    },
    updateNotifications({ commit }, notifications) {
      commit('UPDATE_NOTIFICATIONS', notifications)
    },
    initializeSettings({ commit, state }) {
      // Initialize dark mode on app start
      if (state.darkMode) {
        document.documentElement.classList.add('dark')
      }
    }
  },
  getters: {
    savedViewsBySection: (state) => (section) => {
      return state.savedViews[section] || []
    }
  }
}