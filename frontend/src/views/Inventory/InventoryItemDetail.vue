<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <div class="mb-4">
            <button @click="$router.back()" 
                class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                ← Back to Inventory
            </button>
        </div>

        <div v-if="item" class="bg-white rounded-lg shadow-md border border-gray-200">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex justify-between items-start">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">{{ item.itemName }}</h1>
                        <p class="text-gray-600 mt-1">SKU: {{ item.sku }}</p>
                        <div class="mt-2">
                            <span :class="getStatusClass(item.status)">{{ item.status }}</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button @click="editItem" 
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Edit Item
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                <!-- Main Details -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Basic Information -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Brand</label>
                                <p class="mt-1 text-gray-900">{{ item.brand }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Size</label>
                                <p class="mt-1 text-gray-900">{{ item.size }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Category</label>
                                <p class="mt-1 text-gray-900">{{ item.category }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Condition</label>
                                <p class="mt-1 text-gray-900">{{ item.condition }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Weight</label>
                                <p class="mt-1 text-gray-900">{{ item.weight }}kg</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Location</label>
                                <p class="mt-1 text-gray-900">{{ item.location }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h2 class="text-lg font-semibold mb-4">Description</h2>
                        <p class="text-gray-900">{{ item.description }}</p>
                    </div>

                    <!-- Measurements -->
                    <div class="bg-gray-50 rounded-lg p-4" v-if="item.measurements">
                        <h2 class="text-lg font-semibold mb-4">Measurements</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div v-for="(value, key) in item.measurements" :key="key">
                                <label class="block text-sm font-medium text-gray-700 capitalize">{{ key }}</label>
                                <p class="mt-1 text-gray-900">{{ value }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Purchase Information -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h2 class="text-lg font-semibold mb-4">Purchase Details</h2>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Date of Purchase</label>
                                <p class="mt-1 text-gray-900">{{ formatDate(item.dateOfPurchase) }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Seller</label>
                                <p class="mt-1 text-gray-900">{{ item.seller }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Purchase Price</label>
                                <p class="mt-1 text-gray-900">£{{ formatMoney(item.purchasePrice) }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Shipping Cost</label>
                                <p class="mt-1 text-gray-900">£{{ formatMoney(item.shippingCost) }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Fees</label>
                                <p class="mt-1 text-gray-900">£{{ formatMoney(item.fees) }}</p>
                            </div>
                            <div class="border-t pt-3">
                                <label class="block text-sm font-medium text-gray-700">All-in Cost</label>
                                <p class="mt-1 text-xl font-bold text-gray-900">£{{ formatMoney(item.allInCost) }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Pricing Information -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h2 class="text-lg font-semibold mb-4">Pricing</h2>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Target Price</label>
                                <p class="mt-1 text-lg font-semibold text-green-600">£{{ formatMoney(item.targetSalesPrice) }}</p>
                            </div>
                            <div v-if="item.actualSalesPrice">
                                <label class="block text-sm font-medium text-gray-700">Actual Sale Price</label>
                                <p class="mt-1 text-lg font-semibold text-blue-600">£{{ formatMoney(item.actualSalesPrice) }}</p>
                            </div>
                            <div v-if="item.actualSalesPrice" class="border-t pt-3">
                                <label class="block text-sm font-medium text-gray-700">Profit/Loss</label>
                                <p :class="profitLossClass" class="mt-1 text-lg font-bold">
                                    £{{ formatMoney(profitLoss) }}
                                </p>
                            </div>
                            <div v-if="!item.actualSalesPrice" class="border-t pt-3">
                                <label class="block text-sm font-medium text-gray-700">Potential Profit</label>
                                <p class="mt-1 text-lg font-semibold text-green-600">
                                    £{{ formatMoney(potentialProfit) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Images -->
                    <div class="bg-gray-50 rounded-lg p-4" v-if="item.images && item.images.length">
                        <h2 class="text-lg font-semibold mb-4">Images</h2>
                        <div class="space-y-2">
                            <div v-for="(image, index) in item.images" :key="index" 
                                class="bg-gray-200 rounded p-3 text-center text-gray-600">
                                <span class="text-sm">{{ image.split('/').pop() }}</span>
                                <p class="text-xs text-gray-500 mt-1">Image {{ index + 1 }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
            <p class="text-gray-500">Item not found</p>
        </div>
    </div>
</template>

<script>
// import inventoryData from "../../data/inventory.json"

export default {
    name: 'InventoryItemDetail',
    data() {
        return {
            item: null
        }
    },
    computed: {
        profitLoss() {
            if (!this.item?.actualSalesPrice) return 0
            return this.item.actualSalesPrice - this.item.allInCost
        },
        potentialProfit() {
            if (!this.item?.targetSalesPrice) return 0
            return this.item.targetSalesPrice - this.item.allInCost
        },
        profitLossClass() {
            const profit = this.profitLoss
            if (profit > 0) return 'text-green-600'
            if (profit < 0) return 'text-red-600'
            return 'text-gray-600'
        }
    },
    methods: {
        formatMoney(v) {
            if (v === null || v === undefined || v === '') return '0.00'
            if (typeof v !== 'number') return v
            return v.toFixed(2)
        },
        formatDate(dateStr) {
            if (!dateStr) return '-'
            return new Date(dateStr).toLocaleDateString('en-GB')
        },
        getStatusClass(status) {
            const baseClass = 'px-3 py-1 rounded-full text-sm font-medium '
            switch (status) {
                case 'In Stock':
                    return baseClass + 'bg-green-100 text-green-800'
                case 'Listed':
                    return baseClass + 'bg-blue-100 text-blue-800'
                case 'Sold':
                    return baseClass + 'bg-gray-100 text-gray-800'
                case 'Processing':
                    return baseClass + 'bg-yellow-100 text-yellow-800'
                default:
                    return baseClass + 'bg-gray-100 text-gray-800'
            }
        },
        editItem() {
            this.$router.push(`/inventory/item/${this.item.id}/edit`)
        },
        loadItem() {
            const itemId = parseInt(this.$route.params.id)
            this.item = inventoryData.find(item => item.id === itemId)
        }
    },
    created() {
        this.loadItem()
    },
    watch: {
        '$route'() {
            this.loadItem()
        }
    },
    mounted() {
        if (this.$store) {
            this.$store.dispatch('menus/mainMenu', 'inventory')
            this.$store.dispatch('menus/subMenu', 'inventory')
        }
    }
}
</script>