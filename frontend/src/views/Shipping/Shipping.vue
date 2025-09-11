<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-3xl font-bold">Shipping</h1>
            <button @click="addNewShipment" 
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add New Shipment
            </button>
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg shadow border">
                <div class="text-2xl font-bold text-blue-600">{{ shipmentStats.total }}</div>
                <div class="text-sm text-gray-600">Total Shipments</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow border">
                <div class="text-2xl font-bold text-green-600">{{ shipmentStats.delivered }}</div>
                <div class="text-sm text-gray-600">Delivered</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow border">
                <div class="text-2xl font-bold text-yellow-600">{{ shipmentStats.in_transit }}</div>
                <div class="text-sm text-gray-600">In Transit</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow border">
                <div class="text-2xl font-bold text-red-600">{{ shipmentStats.delayed }}</div>
                <div class="text-sm text-gray-600">Delayed</div>
            </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <!-- Search and Filters -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 pb-4 border-b border-gray-100">
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600">Search:</label>
                    <input v-model="query" type="text" placeholder="Item, tracking number, courier..."
                        class="border rounded px-2 py-1" />
                </div>

                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600">Direction:</label>
                        <select v-model="directionFilter" class="border rounded px-2 py-1">
                            <option value="">All</option>
                            <option value="inbound">Inbound</option>
                            <option value="outbound">Outbound</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600">Status:</label>
                        <select v-model="statusFilter" class="border rounded px-2 py-1">
                            <option value="">All</option>
                            <option v-for="status in statusList" :key="status" :value="status">
                                {{ formatStatus(status) }}
                            </option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600">Rows:</label>
                        <select v-model.number="perPage" class="border rounded px-2 py-1">
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Shipments Table -->
            <div class="overflow-x-auto mt-4">
                <div class="w-full bg-white rounded-md border border-gray-100">
                    <table class="min-w-full table-auto border-collapse">
                        <thead>
                            <tr class="bg-gray-100 text-left">
                                <th class="px-3 py-2 border">Direction</th>
                                <th class="px-3 py-2 border">Item</th>
                                <th class="px-3 py-2 border">Status</th>
                                <th class="px-3 py-2 border">Courier</th>
                                <th class="px-3 py-2 border">Tracking</th>
                                <th class="px-3 py-2 border">Date Shipped</th>
                                <th class="px-3 py-2 border">Expected</th>
                                <th class="px-3 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(shipment, idx) in pagedData" :key="idx" class="hover:bg-gray-50">
                                <td class="px-3 py-2 border">
                                    <span :class="getDirectionClass(shipment.direction)">
                                        {{ formatDirection(shipment.direction) }}
                                    </span>
                                </td>
                                <td class="px-3 py-2 border">{{ shipment.itemName || '-' }}</td>
                                <td class="px-3 py-2 border">
                                    <span :class="getStatusClass(shipment.status)">
                                        {{ formatStatus(shipment.status) }}
                                    </span>
                                </td>
                                <td class="px-3 py-2 border">{{ shipment.courier || '-' }}</td>
                                <td class="px-3 py-2 border">
                                    <span class="font-mono text-sm">{{ shipment.trackingNumber || '-' }}</span>
                                </td>
                                <td class="px-3 py-2 border">{{ formatDate(shipment.dateShipped) }}</td>
                                <td class="px-3 py-2 border">{{ formatDate(shipment.expectedDelivery) }}</td>
                                <td class="px-3 py-2 border">
                                    <div class="flex gap-1">
                                        <button @click="viewShipment(shipment)" 
                                            class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                            title="View Details">
                                            View
                                        </button>
                                        <button @click="editShipment(shipment)" 
                                            class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                            title="Edit Shipment">
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filtered.length === 0">
                                <td colspan="8" class="px-3 py-4 text-center text-gray-500">No shipments found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div>Showing {{ startIndex + 1 }} - {{ Math.min(endIndex, filtered.length) }} of {{ filtered.length }}</div>
                <div class="flex items-center gap-2">
                    <button :disabled="page === 1" @click="page--"
                        class="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
                    <button :disabled="endIndex >= filtered.length" @click="page++"
                        class="px-2 py-1 border rounded disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'Shipping',
    data() {
        return {
            query: '',
            directionFilter: '',
            statusFilter: '',
            page: 1,
            perPage: 25
        }
    },
    computed: {
        ...mapGetters('shipping', ['filteredShipments', 'shipmentStats', 'statusList']),
        filtered() {
            let shipments = this.filteredShipments
            
            // Apply local filters
            if (this.directionFilter) {
                shipments = shipments.filter(s => s.direction === this.directionFilter)
            }
            if (this.statusFilter) {
                shipments = shipments.filter(s => s.status === this.statusFilter)
            }
            
            return shipments
        },
        startIndex() {
            return (this.page - 1) * this.perPage
        },
        endIndex() {
            return this.page * this.perPage
        },
        pagedData() {
            return this.filtered.slice(this.startIndex, this.endIndex)
        }
    },
    watch: {
        query(newQuery) {
            this.setSearchQuery(newQuery)
            this.page = 1 // Reset to first page when searching
        }
    },
    methods: {
        ...mapActions('shipping', ['fetchShipments', 'setSearchQuery']),
        formatDate(dateString) {
            if (!dateString) return '-'
            return new Date(dateString).toLocaleDateString()
        },
        formatDirection(direction) {
            return direction === 'inbound' ? 'Inbound' : 'Outbound'
        },
        formatStatus(status) {
            if (!status) return '-'
            return status.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
        },
        getDirectionClass(direction) {
            const baseClass = 'px-2 py-1 rounded-full text-xs font-medium '
            return direction === 'inbound' 
                ? baseClass + 'bg-blue-100 text-blue-800'
                : baseClass + 'bg-green-100 text-green-800'
        },
        getStatusClass(status) {
            const baseClass = 'px-2 py-1 rounded-full text-xs font-medium '
            switch (status) {
                case 'pending':
                    return baseClass + 'bg-gray-100 text-gray-800'
                case 'shipped':
                    return baseClass + 'bg-blue-100 text-blue-800'
                case 'in_transit':
                    return baseClass + 'bg-yellow-100 text-yellow-800'
                case 'delivered':
                    return baseClass + 'bg-green-100 text-green-800'
                case 'delayed':
                    return baseClass + 'bg-red-100 text-red-800'
                case 'returned':
                    return baseClass + 'bg-purple-100 text-purple-800'
                default:
                    return baseClass + 'bg-gray-100 text-gray-800'
            }
        },
        viewShipment(shipment) {
            this.$router.push(`/shipping/shipment/${shipment.id}`)
        },
        editShipment(shipment) {
            this.$router.push(`/shipping/shipment/${shipment.id}/edit`)
        },
        addNewShipment() {
            this.$router.push('/shipping/shipment/new')
        }
    },
    async mounted() {
        if (this.$store) {
            this.$store.dispatch('menus/mainMenu', 'shipping')
            await this.fetchShipments()
        }
    }
}
</script>