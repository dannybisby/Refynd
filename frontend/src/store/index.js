import { createStore } from 'vuex'
import menus from './modules/menus'
import inventory from './modules/inventory'
import buy from './modules/buy'

export default createStore({
  modules: {
    menus,
    inventory,
    buy
  }
})
