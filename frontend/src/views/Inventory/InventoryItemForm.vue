<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <div class="mb-4">
            <button @click="$router.back()" 
                class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                ← Back to Inventory
            </button>
        </div>

        <div class="bg-white rounded-lg shadow-md border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
                <h1 class="text-2xl font-bold text-gray-900">
                    {{ isEdit ? 'Edit Item' : 'Add New Item' }}
                </h1>
                <p class="text-gray-600 mt-1" v-if="isEdit">
                    Editing: {{ form.itemName || 'Untitled Item' }}
                </p>
            </div>

            <form @submit.prevent="saveItem" class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Left Column -->
                    <div class="space-y-6">
                        <!-- Basic Information -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Item Name *</label>
                                    <input v-model="form.itemName" type="text" required
                                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">SKU *</label>
                                        <input v-model="form.sku" type="text" required
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Brand</label>
                                        <input v-model="form.brand" type="text"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Size</label>
                                        <input v-model="form.size" type="text"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Category</label>
                                        <select v-model="form.category"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="">Select Category</option>
                                            <option value="Outerwear">Outerwear</option>
                                            <option value="Footwear">Footwear</option>
                                            <option value="Formal Wear">Formal Wear</option>
                                            <option value="T-Shirts">T-Shirts</option>
                                            <option value="Accessories">Accessories</option>
                                            <option value="Bottoms">Bottoms</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Condition</label>
                                        <select v-model="form.condition"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="">Select Condition</option>
                                            <option value="Excellent">Excellent</option>
                                            <option value="Very Good">Very Good</option>
                                            <option value="Good">Good</option>
                                            <option value="Fair">Fair</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                        <input v-model.number="form.weight" type="number" step="0.1"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea v-model="form.description" rows="3"
                                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Purchase Information -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h2 class="text-lg font-semibold mb-4">Purchase Information</h2>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Date of Purchase</label>
                                    <input v-model="form.dateOfPurchase" type="date"
                                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Seller</label>
                                    <input v-model="form.seller" type="text"
                                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                </div>

                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Purchase Price (£)</label>
                                        <input v-model.number="form.purchasePrice" type="number" step="0.01"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Shipping (£)</label>
                                        <input v-model.number="form.shippingCost" type="number" step="0.01"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Fees (£)</label>
                                        <input v-model.number="form.fees" type="number" step="0.01"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Location</label>
                                    <input v-model="form.location" type="text" placeholder="e.g., A1-B2"
                                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-6">
                        <!-- Pricing & Status -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h2 class="text-lg font-semibold mb-4">Pricing & Status</h2>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Status</label>
                                    <select v-model="form.status"
                                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Select Status</option>
                                        <option value="In Stock">In Stock</option>
                                        <option value="Listed">Listed</option>
                                        <option value="Sold">Sold</option>
                                        <option value="Processing">Processing</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Target Sale Price (£)</label>
                                    <input v-model.number="form.targetSalesPrice" type="number" step="0.01"
                                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                </div>

                                <div v-if="form.status === 'Sold'">
                                    <label class="block text-sm font-medium text-gray-700">Actual Sale Price (£)</label>
                                    <input v-model.number="form.actualSalesPrice" type="number" step="0.01"
                                        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                </div>

                                <div class="bg-white rounded p-3 border">
                                    <label class="block text-sm font-medium text-gray-700">All-in Cost</label>
                                    <p class="text-lg font-semibold text-gray-900 mt-1">
                                        £{{ formatMoney(calculatedAllInCost) }}
                                    </p>
                                    <p class="text-xs text-gray-500">
                                        Purchase + Shipping + Fees
                                    </p>
                                </div>

                                <div v-if="form.targetSalesPrice" class="bg-white rounded p-3 border">
                                    <label class="block text-sm font-medium text-gray-700">Potential Profit</label>
                                    <p :class="potentialProfitClass" class="text-lg font-semibold mt-1">
                                        £{{ formatMoney(potentialProfit) }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Measurements -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h2 class="text-lg font-semibold mb-4">Measurements (optional)</h2>
                            <div class="space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Chest/Width</label>
                                        <input v-model="form.measurements.chest" type="text" placeholder="e.g., 52cm"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Length/Height</label>
                                        <input v-model="form.measurements.length" type="text" placeholder="e.g., 65cm"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Shoulders/Width</label>
                                        <input v-model="form.measurements.shoulders" type="text" placeholder="e.g., 48cm"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Depth/Inseam</label>
                                        <input v-model="form.measurements.depth" type="text" placeholder="e.g., 12cm"
                                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Images -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h2 class="text-lg font-semibold mb-4">Images</h2>
                            <div class="space-y-3">
                                <div v-for="(image, index) in form.images" :key="index" class="flex gap-2">
                                    <input v-model="form.images[index]" type="text" placeholder="Image URL or path"
                                        class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <button type="button" @click="removeImage(index)"
                                        class="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                                        Remove
                                    </button>
                                </div>
                                <button type="button" @click="addImage"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                                    Add Image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
                    <button type="button" @click="$router.back()"
                        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" 
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        {{ isEdit ? 'Update Item' : 'Create Item' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
// import inventoryData from "../../data/inventory.json"

export default {
    name: 'InventoryItemForm',
    data() {
        return {
            form: {
                itemName: '',
                sku: '',
                brand: '',
                size: '',
                category: '',
                condition: '',
                weight: null,
                description: '',
                dateOfPurchase: '',
                seller: '',
                purchasePrice: null,
                shippingCost: null,
                fees: null,
                location: '',
                status: '',
                targetSalesPrice: null,
                actualSalesPrice: null,
                measurements: {
                    chest: '',
                    length: '',
                    shoulders: '',
                    depth: ''
                },
                images: ['']
            }
        }
    },
    computed: {
        isEdit() {
            return this.$route.params.id && this.$route.params.id !== 'new'
        },
        calculatedAllInCost() {
            const purchase = this.form.purchasePrice || 0
            const shipping = this.form.shippingCost || 0
            const fees = this.form.fees || 0
            return purchase + shipping + fees
        },
        potentialProfit() {
            const target = this.form.targetSalesPrice || 0
            return target - this.calculatedAllInCost
        },
        potentialProfitClass() {
            const profit = this.potentialProfit
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
        addImage() {
            this.form.images.push('')
        },
        removeImage(index) {
            this.form.images.splice(index, 1)
            if (this.form.images.length === 0) {
                this.form.images.push('')
            }
        },
        generateSKU() {
            if (!this.form.sku && this.form.itemName && this.form.brand) {
                const brandInitial = this.form.brand.substring(0, 3).toUpperCase()
                const nameInitial = this.form.itemName.substring(0, 2).toUpperCase()
                const random = Math.floor(Math.random() * 999).toString().padStart(3, '0')
                this.form.sku = `${brandInitial}-${nameInitial}${random}`
            }
        },
        loadItem() {
            if (this.isEdit) {
                const itemId = parseInt(this.$route.params.id)
                const item = inventoryData.find(item => item.id === itemId)
                if (item) {
                    // Copy all properties from the item to the form
                    Object.keys(this.form).forEach(key => {
                        if (item.hasOwnProperty(key)) {
                            this.form[key] = item[key]
                        }
                    })
                    
                    // Ensure measurements object exists
                    if (!this.form.measurements) {
                        this.form.measurements = { chest: '', length: '', shoulders: '', depth: '' }
                    }
                    
                    // Ensure images array exists and has at least one empty string
                    if (!this.form.images || this.form.images.length === 0) {
                        this.form.images = ['']
                    }
                }
            }
        },
        saveItem() {
            // Calculate all-in cost
            this.form.allInCost = this.calculatedAllInCost
            
            // Clean up empty images
            this.form.images = this.form.images.filter(img => img.trim() !== '')
            
            // Clean up empty measurements
            Object.keys(this.form.measurements).forEach(key => {
                if (!this.form.measurements[key]) {
                    delete this.form.measurements[key]
                }
            })
            
            // In a real app, this would make an API call
            console.log('Saving item:', this.form)
            
            // Show success message and redirect
            alert(this.isEdit ? 'Item updated successfully!' : 'Item created successfully!')
            this.$router.push('/inventory')
        }
    },
    watch: {
        'form.brand'() {
            this.generateSKU()
        },
        'form.itemName'() {
            this.generateSKU()
        },
        'form.status'(newStatus) {
            // Clear actual sales price if not sold
            if (newStatus !== 'Sold') {
                this.form.actualSalesPrice = null
            }
        }
    },
    created() {
        this.loadItem()
    },
    mounted() {
        if (this.$store) {
            this.$store.dispatch('menus/mainMenu', 'inventory')
            this.$store.dispatch('menus/subMenu', 'inventory')
        }
    }
}
</script>