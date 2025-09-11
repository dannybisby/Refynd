import { createStore } from 'vuex'
import menus from './modules/menus'
import inventory from './modules/inventory'
import buy from './modules/buy'
import shipping from './modules/shipping'

export default createStore({
  modules: {
    menus,
    inventory,
    buy,
    shipping
  }
})
