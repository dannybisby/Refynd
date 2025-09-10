import type { Settings } from '@/types'

export interface SettingsState extends Settings {}

const state: SettingsState = {
  darkMode: false,
  defaultPrinter: 'Default Printer',
  defaultCarrier: 'Royal Mail',
  labelSize: 'A6',
  autoPrint: false,
  savedViews: []
}

const mutations = {
  SET_DARK_MODE(state: SettingsState, darkMode: boolean) {
    state.darkMode = darkMode
    // Update HTML class for Tailwind dark mode
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  },
  SET_DEFAULT_PRINTER(state: SettingsState, printer: string) {
    state.defaultPrinter = printer
  },
  SET_DEFAULT_CARRIER(state: SettingsState, carrier: string) {
    state.defaultCarrier = carrier
  },
  SET_LABEL_SIZE(state: SettingsState, size: string) {
    state.labelSize = size
  },
  SET_AUTO_PRINT(state: SettingsState, autoPrint: boolean) {
    state.autoPrint = autoPrint
  },
  ADD_SAVED_VIEW(state: SettingsState, view: any) {
    state.savedViews.push(view)
  },
  UPDATE_SAVED_VIEW(state: SettingsState, view: any) {
    const index = state.savedViews.findIndex(v => v.id === view.id)
    if (index !== -1) {
      state.savedViews[index] = view
    }
  },
  DELETE_SAVED_VIEW(state: SettingsState, viewId: string) {
    state.savedViews = state.savedViews.filter(v => v.id !== viewId)
  }
}

const actions = {
  toggleDarkMode({ commit, state }: any) {
    const newDarkMode = !state.darkMode
    commit('SET_DARK_MODE', newDarkMode)
    // Persist to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(newDarkMode))
    }
  },
  
  initializeSettings({ commit }: any) {
    // Load from localStorage
    if (typeof localStorage !== 'undefined') {
      const darkMode = localStorage.getItem('darkMode')
      if (darkMode) {
        commit('SET_DARK_MODE', JSON.parse(darkMode))
      }
    }
  },
  
  updatePrinterSettings({ commit }: any, { defaultPrinter, autoPrint }: { defaultPrinter?: string, autoPrint?: boolean }) {
    if (defaultPrinter) {
      commit('SET_DEFAULT_PRINTER', defaultPrinter)
    }
    if (autoPrint !== undefined) {
      commit('SET_AUTO_PRINT', autoPrint)
    }
  },
  
  saveView({ commit }: any, view: any) {
    const newView = {
      ...view,
      id: `view-${Date.now()}`
    }
    commit('ADD_SAVED_VIEW', newView)
    return newView
  }
}

const getters = {
  isDarkMode: (state: SettingsState) => state.darkMode,
  printerSettings: (state: SettingsState) => ({
    defaultPrinter: state.defaultPrinter,
    defaultCarrier: state.defaultCarrier,
    labelSize: state.labelSize,
    autoPrint: state.autoPrint
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}