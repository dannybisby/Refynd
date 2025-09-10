const sampleShipments = [
  {
    id: '1',
    orderId: '1',
    carrier: 'Royal Mail',
    labelUrl: '/labels/label-001.pdf',
    printer: 'Zebra ZD620',
    tracking: 'RM123456789GB',
    status: 'printed'
  },
  {
    id: '2',
    orderId: '2',
    carrier: 'DPD',
    labelUrl: '/labels/label-002.pdf',
    status: 'pending'
  }
]

export default {
  namespaced: true,
  state: {
    shipments: sampleShipments,
    labelQueue: [],
    printers: [
      { id: 'zebra-1', name: 'Zebra ZD620', status: 'online' },
      { id: 'brother-1', name: 'Brother QL-820NWB', status: 'offline' }
    ],
    defaultCarrier: 'Royal Mail',
    defaultPrinter: 'zebra-1',
    autoprint: false,
    loading: false,
    error: null
  },
  mutations: {
    SET_SHIPMENTS(state, shipments) {
      state.shipments = shipments
    },
    ADD_SHIPMENT(state, shipment) {
      state.shipments.push(shipment)
    },
    UPDATE_SHIPMENT(state, { id, updates }) {
      const index = state.shipments.findIndex(shipment => shipment.id === id)
      if (index !== -1) {
        state.shipments[index] = { ...state.shipments[index], ...updates }
      }
    },
    ADD_TO_LABEL_QUEUE(state, item) {
      state.labelQueue.push(item)
    },
    REMOVE_FROM_LABEL_QUEUE(state, id) {
      state.labelQueue = state.labelQueue.filter(item => item.id !== id)
    },
    SET_DEFAULT_CARRIER(state, carrier) {
      state.defaultCarrier = carrier
    },
    SET_DEFAULT_PRINTER(state, printer) {
      state.defaultPrinter = printer
    },
    SET_AUTOPRINT(state, autoprint) {
      state.autoprint = autoprint
    },
    UPDATE_PRINTER_STATUS(state, { id, status }) {
      const printer = state.printers.find(p => p.id === id)
      if (printer) {
        printer.status = status
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async printLabel({ commit, state }, { orderId, printer }) {
      try {
        const shipment = state.shipments.find(s => s.orderId === orderId)
        if (shipment) {
          commit('UPDATE_SHIPMENT', { 
            id: shipment.id, 
            updates: { 
              status: 'printing',
              printer: printer || state.defaultPrinter
            }
          })
          
          // Simulate printing delay
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          commit('UPDATE_SHIPMENT', { 
            id: shipment.id, 
            updates: { status: 'printed' }
          })
          
          return { success: true, tracking: `RM${Date.now()}GB` }
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
        return { success: false, error: error.message }
      }
    },
    async createShipment({ commit }, shipmentData) {
      const newShipment = {
        ...shipmentData,
        id: Date.now().toString(),
        status: 'pending'
      }
      commit('ADD_SHIPMENT', newShipment)
      return newShipment
    },
    updateShipmentStatus({ commit }, { id, status }) {
      commit('UPDATE_SHIPMENT', { id, updates: { status } })
    },
    addToLabelQueue({ commit }, item) {
      commit('ADD_TO_LABEL_QUEUE', item)
    },
    removeFromLabelQueue({ commit }, id) {
      commit('REMOVE_FROM_LABEL_QUEUE', id)
    },
    updateSettings({ commit }, settings) {
      if (settings.defaultCarrier) commit('SET_DEFAULT_CARRIER', settings.defaultCarrier)
      if (settings.defaultPrinter) commit('SET_DEFAULT_PRINTER', settings.defaultPrinter)
      if (settings.autoprint !== undefined) commit('SET_AUTOPRINT', settings.autoprint)
    }
  },
  getters: {
    pendingShipments: (state) => {
      return state.shipments.filter(shipment => shipment.status === 'pending')
    },
    printedShipments: (state) => {
      return state.shipments.filter(shipment => shipment.status === 'printed')
    },
    failedShipments: (state) => {
      return state.shipments.filter(shipment => shipment.status === 'failed')
    },
    onlinePrinters: (state) => {
      return state.printers.filter(printer => printer.status === 'online')
    }
  }
}