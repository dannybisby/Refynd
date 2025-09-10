<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
                <button @click="goBack" 
                    class="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors">
                    ← Back
                </button>
                <h1 class="text-3xl font-bold">Shipment Details</h1>
            </div>
            <div class="flex gap-2">
                <button @click="editShipment" 
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Edit Shipment
                </button>
            </div>
        </div>

        <div v-if="loading" class="text-center py-8">
            <div class="text-gray-500">Loading shipment details...</div>
        </div>

        <div v-else-if="!shipment" class="text-center py-8">
            <div class="text-red-500">Shipment not found</div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Main Details -->
            <div class="bg-white p-6 rounded-lg shadow border">
                <h2 class="text-xl font-semibold mb-4">Shipment Information</h2>
                <div class="space-y-4">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Shipment ID:</span>
                        <span class="font-medium">#{{ shipment.id }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Direction:</span>
                        <span :class="getDirectionClass(shipment.direction)">
                            {{ formatDirection(shipment.direction) }}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Status:</span>
                        <span :class="getStatusClass(shipment.status)">
                            {{ formatStatus(shipment.status) }}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Item:</span>
                        <span class="font-medium">{{ shipment.itemName }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Courier:</span>
                        <span class="font-medium">{{ shipment.courier }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Tracking Number:</span>
                        <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{{ shipment.trackingNumber }}</span>
                    </div>
                </div>
            </div>

            <!-- Timeline -->
            <div class="bg-white p-6 rounded-lg shadow border">
                <h2 class="text-xl font-semibold mb-4">Shipping Timeline</h2>
                <div class="space-y-4">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Date Shipped:</span>
                        <span class="font-medium">{{ formatDate(shipment.dateShipped) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Expected Delivery:</span>
                        <span class="font-medium">{{ formatDate(shipment.expectedDelivery) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Actual Delivery:</span>
                        <span class="font-medium">{{ formatDate(shipment.actualDelivery) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Created:</span>
                        <span class="text-sm">{{ formatDateTime(shipment.createdAt) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Last Updated:</span>
                        <span class="text-sm">{{ formatDateTime(shipment.updatedAt) }}</span>
                    </div>
                </div>
            </div>

            <!-- Transaction Info -->
            <div class="bg-white p-6 rounded-lg shadow border">
                <h2 class="text-xl font-semibold mb-4">Transaction Details</h2>
                <div class="space-y-4">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Transaction ID:</span>
                        <span class="font-medium">#{{ shipment.transactionId }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Transaction Type:</span>
                        <span :class="getTransactionTypeClass(shipment.transactionType)">
                            {{ formatTransactionType(shipment.transactionType) }}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Item ID:</span>
                        <span class="font-medium">#{{ shipment.itemId }}</span>
                    </div>
                </div>
            </div>

            <!-- Status History (Placeholder for future enhancement) -->
            <div class="bg-white p-6 rounded-lg shadow border">
                <h2 class="text-xl font-semibold mb-4">Status History</h2>
                <div class="text-gray-500 text-sm">
                    Status tracking history will be available when integrated with courier APIs.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'ShippingDetail',
    data() {
        return {
            shipmentId: null
        }
    },
    computed: {
        ...mapGetters('shipping', ['currentShipment', 'isLoading']),
        shipment() {
            return this.currentShipment
        },
        loading() {
            return this.isLoading
        }
    },
    methods: {
        ...mapActions('shipping', ['fetchShipment']),
        formatDate(dateString) {
            if (!dateString) return 'Not set'
            return new Date(dateString).toLocaleDateString()
        },
        formatDateTime(dateString) {
            if (!dateString) return 'Not set'
            return new Date(dateString).toLocaleString()
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
        formatTransactionType(type) {
            return type === 'purchase' ? 'Purchase' : 'Sale'
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
        getTransactionTypeClass(type) {
            const baseClass = 'px-2 py-1 rounded-full text-xs font-medium '
            return type === 'purchase' 
                ? baseClass + 'bg-orange-100 text-orange-800'
                : baseClass + 'bg-purple-100 text-purple-800'
        },
        editShipment() {
            this.$router.push(`/shipping/shipment/${this.shipmentId}/edit`)
        },
        goBack() {
            this.$router.push('/shipping')
        }
    },
    async created() {
        this.shipmentId = this.$route.params.id
        if (this.shipmentId && this.shipmentId !== 'new') {
            await this.fetchShipment(this.shipmentId)
        }
    }
}
</script>