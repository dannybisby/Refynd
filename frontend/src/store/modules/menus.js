const state = () => ({
  activeMain: null,
  activeSub: null
})

const mutations = {
  SET_MAIN(state, name) {
    state.activeMain = name
  },
  SET_SUB(state, name) {
    state.activeSub = name
  }
}

const actions = {
  mainMenu({ commit }, name) {
    commit('SET_MAIN', name)
  },
  subMenu({ commit }, name) {
    commit('SET_SUB', name)
  }
}

const getters = {
  activeMain: (state) => state.activeMain,
  activeSub: (state) => state.activeSub
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
