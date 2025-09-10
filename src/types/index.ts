export type Source = 'vinted' | 'facebook' | 'gumtree' | 'carboot' | 'charity' | 'other'
export type Channel = 'vinted' | 'ebay'
export type Status = 'in_stock' | 'listed' | 'allocated' | 'sold' | 'archived'
export type Condition = 'new' | 'like_new' | 'good' | 'fair' | 'for_parts'
export type Score = 'A' | 'B' | 'C' | 'D'
export type OrderStatus = 'pending_pick' | 'label_pending' | 'label_ready' | 'dispatched'
export type ShipmentStatus = 'pending' | 'printing' | 'printed' | 'failed'

export interface Item {
  id: string
  sku: string
  title: string
  brand?: string
  model?: string
  storageGb?: number
  condition: Condition
  source: Source
  buyPrice: number
  askPrice?: number
  estResale?: number
  channels: Channel[]
  location?: string
  status: Status
  serial?: string
  photos: string[]
  createdAt: string
  listedAt?: string
  notes?: string
}

export interface Deal {
  id: string
  source: 'vinted'
  title: string
  price: number
  url: string
  sellerRating: number
  estResale: number
  marginPct: number
  score: Score
  ageMinutes: number
  photos: string[]
  description?: string
  seller?: string
  location?: string
}

export interface Order {
  id: string
  platform: Channel
  itemId: string
  buyer: string
  salePrice: number
  shippingPaid: number
  feesEst: number
  createdAt: string
  status: OrderStatus
  buyerRating?: number
  notes?: string
}

export interface Shipment {
  id: string
  orderId: string
  carrier: string
  labelUrl?: string
  printer?: string
  tracking?: string
  status: ShipmentStatus
  createdAt: string
  updatedAt: string
}

export interface Listing {
  id: string
  itemId: string
  platform: Channel
  title: string
  description: string
  price: number
  photos: string[]
  status: 'draft' | 'active' | 'sold' | 'ended'
  createdAt: string
  publishedAt?: string
}

export interface KPI {
  title: string
  value: string | number
  delta?: {
    value: number
    isPositive: boolean
    period: string
  }
  format?: 'currency' | 'number' | 'percentage'
}

export interface Activity {
  id: string
  type: 'sold' | 'dispatched' | 'repriced' | 'new_deal' | 'new_item' | 'message'
  title: string
  description?: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface Toast {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message?: string
  duration?: number
  actions?: Array<{
    label: string
    action: string
  }>
}

export interface SavedView {
  id: string
  name: string
  route: string
  filters: Record<string, any>
  columns?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Settings {
  darkMode: boolean
  defaultPrinter?: string
  defaultCarrier?: string
  labelSize?: string
  autoPrint: boolean
  savedViews: SavedView[]
}