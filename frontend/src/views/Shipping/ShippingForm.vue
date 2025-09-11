<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
                <button @click="goBack" 
                    class="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors">
                    ← Back
                </button>
                <h1 class="text-3xl font-bold">{{ isEdit ? 'Edit Shipment' : 'Add New Shipment' }}</h1>
            </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border">
            <form @submit.prevent="saveShipment" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Basic Information -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold">Basic Information</h3>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                            <input v-model="form.itemName" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Direction *</label>
                            <select v-model="form.direction" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Direction</option>
                                <option value="inbound">Inbound (Purchase)</option>
                                <option value="outbound">Outbound (Sale)</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                            <select v-model="form.status" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="in_transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                                <option value="delayed">Delayed</option>
                                <option value="returned">Returned</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Courier *</label>
                            <select v-model="form.courier" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Courier</option>
                                <option value="DHL">DHL</option>
                                <option value="UPS">UPS</option>
                                <option value="FedEx">FedEx</option>
                                <option value="Royal Mail">Royal Mail</option>
                                <option value="DPD">DPD</option>
                                <option value="Hermes">Hermes</option>
                                <option value="Yodel">Yodel</option>
                                <option value="ParcelForce">ParcelForce</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                            <input v-model="form.trackingNumber" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <!-- Timeline Information -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold">Timeline Information</h3>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date Shipped</label>
                            <input v-model="form.dateShipped" type="date"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Expected Delivery</label>
                            <input v-model="form.expectedDelivery" type="date"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Actual Delivery</label>
                            <input v-model="form.actualDelivery" type="date"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Item ID</label>
                            <input v-model.number="form.itemId" type="number"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <p class="text-xs text-gray-500 mt-1">Link to inventory item (optional)</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                            <input v-model.number="form.transactionId" type="number"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <p class="text-xs text-gray-500 mt-1">Link to purchase/sale transaction (optional)</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                            <select v-model="form.transactionType"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Type</option>
                                <option value="purchase">Purchase</option>
                                <option value="sale">Sale</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="flex justify-end gap-4 pt-6 border-t">
                    <button type="button" @click="goBack"
                        class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" :disabled="loading"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {{ loading ? 'Saving...' : (isEdit ? 'Update Shipment' : 'Create Shipment') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'ShippingForm',
    data() {
        return {
            shipmentId: null,
            form: {
                itemName: '',
                direction: '',
                status: '',
                courier: '',
                trackingNumber: '',
                dateShipped: '',
                expectedDelivery: '',
                actualDelivery: '',
                itemId: null,
                transactionId: null,
                transactionType: ''
            },
            loading: false
        }
    },
    computed: {
        ...mapGetters('shipping', ['currentShipment']),
        isEdit() {
            return this.shipmentId && this.shipmentId !== 'new'
        }
    },
    methods: {
        ...mapActions('shipping', ['fetchShipment', 'createShipment', 'updateShipment']),
        async saveShipment() {
            this.loading = true
            try {
                if (this.isEdit) {
                    await this.updateShipment({
                        ...this.form,
                        id: parseInt(this.shipmentId)
                    })
                } else {
                    await this.createShipment(this.form)
                }
                this.$router.push('/shipping')
            } catch (error) {
                console.error('Error saving shipment:', error)
                alert('Error saving shipment. Please try again.')
            } finally {
                this.loading = false
            }
        },
        goBack() {
            if (this.isEdit) {
                this.$router.push(`/shipping/shipment/${this.shipmentId}`)
            } else {
                this.$router.push('/shipping')
            }
        },
        populateForm() {
            if (this.currentShipment) {
                const shipment = this.currentShipment
                this.form = {
                    itemName: shipment.itemName || '',
                    direction: shipment.direction || '',
                    status: shipment.status || '',
                    courier: shipment.courier || '',
                    trackingNumber: shipment.trackingNumber || '',
                    dateShipped: shipment.dateShipped || '',
                    expectedDelivery: shipment.expectedDelivery || '',
                    actualDelivery: shipment.actualDelivery || '',
                    itemId: shipment.itemId || null,
                    transactionId: shipment.transactionId || null,
                    transactionType: shipment.transactionType || ''
                }
            }
        }
    },
    async created() {
        this.shipmentId = this.$route.params.id
        
        if (this.isEdit) {
            await this.fetchShipment(this.shipmentId)
            this.populateForm()
        }
    },
    watch: {
        currentShipment() {
            if (this.isEdit) {
                this.populateForm()
            }
        }
    }
}
</script>