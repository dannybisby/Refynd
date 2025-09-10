export default {
  namespaced: true,
  state: {
    toasts: []
  },
  mutations: {
    ADD_TOAST(state, toast) {
      const id = Date.now().toString()
      state.toasts.push({
        id,
        ...toast,
        timestamp: new Date().toISOString()
      })
    },
    REMOVE_TOAST(state, id) {
      state.toasts = state.toasts.filter(toast => toast.id !== id)
    },
    CLEAR_TOASTS(state) {
      state.toasts = []
    }
  },
  actions: {
    showToast({ commit }, toast) {
      commit('ADD_TOAST', toast)
      
      // Auto-remove toast after duration
      const duration = toast.duration || 5000
      if (duration > 0) {
        setTimeout(() => {
          commit('REMOVE_TOAST', toast.id)
        }, duration)
      }
    },
    showSuccess({ dispatch }, message) {
      dispatch('showToast', {
        type: 'success',
        title: 'Success',
        message,
        duration: 4000
      })
    },
    showError({ dispatch }, message) {
      dispatch('showToast', {
        type: 'error',
        title: 'Error',
        message,
        duration: 6000
      })
    },
    showWarning({ dispatch }, message) {
      dispatch('showToast', {
        type: 'warning',
        title: 'Warning',
        message,
        duration: 5000
      })
    },
    showInfo({ dispatch }, message) {
      dispatch('showToast', {
        type: 'info',
        title: 'Info',
        message,
        duration: 4000
      })
    },
    removeToast({ commit }, id) {
      commit('REMOVE_TOAST', id)
    },
    clearToasts({ commit }) {
      commit('CLEAR_TOASTS')
    }
  }
}