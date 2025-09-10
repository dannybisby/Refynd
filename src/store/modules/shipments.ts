import type { Shipment } from '@/types'

export interface ShipmentsState {
  shipments: Shipment[]
  loading: boolean
  error: string | null
  selectedPrinter: string
  printers: string[]
}

const state: ShipmentsState = {
  shipments: [],
  loading: false,
  error: null,
  selectedPrinter: 'Default Printer',
  printers: ['Default Printer', 'Label Printer', 'Sunmi L2S']
}

const mutations = {
  SET_SHIPMENTS(state: ShipmentsState, shipments: Shipment[]) {
    state.shipments = shipments
  },
  ADD_SHIPMENT(state: ShipmentsState, shipment: Shipment) {
    state.shipments.push(shipment)
  },
  UPDATE_SHIPMENT(state: ShipmentsState, updatedShipment: Shipment) {
    const index = state.shipments.findIndex(shipment => shipment.id === updatedShipment.id)
    if (index !== -1) {
      state.shipments[index] = updatedShipment
    }
  },
  SET_LOADING(state: ShipmentsState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: ShipmentsState, error: string | null) {
    state.error = error
  },
  SET_SELECTED_PRINTER(state: ShipmentsState, printer: string) {
    state.selectedPrinter = printer
  }
}

const actions = {
  async fetchShipments({ commit }: any) {
    commit('SET_LOADING', true)
    try {
      const shipments = await new Promise<Shipment[]>(resolve => {
        setTimeout(() => resolve(generateMockShipments()), 400)
      })
      commit('SET_SHIPMENTS', shipments)
    } catch (error) {
      commit('SET_ERROR', 'Failed to fetch shipments')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async printLabel({ commit }: any, { orderId, printer }: { orderId: string, printer?: string }) {
    const shipment: Shipment = {
      id: `shipment-${Date.now()}`,
      orderId,
      carrier: 'Royal Mail',
      printer: printer || state.selectedPrinter,
      status: 'printing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    commit('ADD_SHIPMENT', shipment)
    
    // Simulate printing process
    setTimeout(() => {
      const updatedShipment = {
        ...shipment,
        status: 'printed' as const,
        labelUrl: '/api/placeholder/400/600',
        tracking: `RM${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        updatedAt: new Date().toISOString()
      }
      commit('UPDATE_SHIPMENT', updatedShipment)
    }, 2000)
    
    return shipment
  },
  
  async retryPrint({ commit }: any, shipmentId: string) {
    const shipment = state.shipments.find(s => s.id === shipmentId)
    if (shipment) {
      const updatedShipment = {
        ...shipment,
        status: 'printing' as const,
        updatedAt: new Date().toISOString()
      }
      commit('UPDATE_SHIPMENT', updatedShipment)
      
      setTimeout(() => {
        const finalShipment = {
          ...updatedShipment,
          status: 'printed' as const,
          updatedAt: new Date().toISOString()
        }
        commit('UPDATE_SHIPMENT', finalShipment)
      }, 1500)
    }
  }
}

const getters = {
  shipmentsByStatus: (state: ShipmentsState) => (status: Shipment['status']) => {
    return state.shipments.filter(shipment => shipment.status === status)
  },
  
  pendingLabels: (state: ShipmentsState) => {
    return state.shipments.filter(shipment => shipment.status === 'pending')
  },
  
  printedLabels: (state: ShipmentsState) => {
    return state.shipments.filter(shipment => shipment.status === 'printed')
  },
  
  failedLabels: (state: ShipmentsState) => {
    return state.shipments.filter(shipment => shipment.status === 'failed')
  }
}

function generateMockShipments(): Shipment[] {
  const carriers = ['Royal Mail', 'DPD', 'Hermes', 'UPS']
  const statuses: Shipment['status'][] = ['pending', 'printing', 'printed', 'failed']
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `shipment-${i + 1}`,
    orderId: `order-${i + 1}`,
    carrier: carriers[Math.floor(Math.random() * carriers.length)],
    labelUrl: Math.random() > 0.3 ? '/api/placeholder/400/600' : undefined,
    printer: 'Default Printer',
    tracking: Math.random() > 0.3 ? `RM${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
  }))
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}