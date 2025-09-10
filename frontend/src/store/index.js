import { createStore } from 'vuex'
import menus from './modules/menus'
import inventory from './modules/inventory'

export default createStore({
  modules: {
    menus,
    inventory
  }
})
