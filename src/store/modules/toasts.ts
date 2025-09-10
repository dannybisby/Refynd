import type { Toast } from '@/types'

export interface ToastsState {
  toasts: Toast[]
}

const state: ToastsState = {
  toasts: []
}

const mutations = {
  ADD_TOAST(state: ToastsState, toast: Toast) {
    state.toasts.push(toast)
  },
  REMOVE_TOAST(state: ToastsState, toastId: string) {
    state.toasts = state.toasts.filter(toast => toast.id !== toastId)
  },
  CLEAR_TOASTS(state: ToastsState) {
    state.toasts = []
  }
}

const actions = {
  showToast({ commit }: any, toast: Omit<Toast, 'id'>) {
    const newToast: Toast = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      duration: toast.duration || 5000
    }
    
    commit('ADD_TOAST', newToast)
    
    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        commit('REMOVE_TOAST', newToast.id)
      }, newToast.duration)
    }
    
    return newToast
  },
  
  removeToast({ commit }: any, toastId: string) {
    commit('REMOVE_TOAST', toastId)
  },
  
  clearAllToasts({ commit }: any) {
    commit('CLEAR_TOASTS')
  },
  
  // Convenience methods for different toast types
  showSuccess({ dispatch }: any, { title, message }: { title: string, message?: string }) {
    return dispatch('showToast', { type: 'success', title, message })
  },
  
  showError({ dispatch }: any, { title, message }: { title: string, message?: string }) {
    return dispatch('showToast', { type: 'error', title, message })
  },
  
  showWarning({ dispatch }: any, { title, message }: { title: string, message?: string }) {
    return dispatch('showToast', { type: 'warning', title, message })
  },
  
  showInfo({ dispatch }: any, { title, message }: { title: string, message?: string }) {
    return dispatch('showToast', { type: 'info', title, message })
  }
}

const getters = {
  activeToasts: (state: ToastsState) => state.toasts
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}