import { createStore } from 'vuex'
import items from './modules/items'
import listings from './modules/listings'
import orders from './modules/orders'
import shipments from './modules/shipments'
import deals from './modules/deals'
import settings from './modules/settings'
import toasts from './modules/toasts'

export default createStore({
  modules: {
    items,
    listings,
    orders,
    shipments,
    deals,
    settings,
    toasts
  }
})