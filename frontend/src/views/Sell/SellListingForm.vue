<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-3xl font-bold">{{ isEditing ? 'Edit Listing' : 'Create New Listing' }}</h1>
            <button @click="goBack" class="px-4 py-2 text-gray-600 hover:text-gray-800">
                ← Back to Listings
            </button>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <form @submit.prevent="saveListing">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Item Selection -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Select Inventory Item
                        </label>
                        <select v-model="form.itemId" class="w-full border rounded px-3 py-2" required>
                            <option value="">Choose an item to list...</option>
                            <option v-for="item in availableItems" :key="item.id" :value="item.id">
                                {{ item.itemName }} - {{ item.brand }} ({{ item.sku }})
                            </option>
                        </select>
                    </div>

                    <!-- Listing Price -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Listing Price (€)
                        </label>
                        <input 
                            v-model.number="form.listedPrice" 
                            type="number" 
                            step="0.01" 
                            min="0"
                            class="w-full border rounded px-3 py-2" 
                            required 
                        />
                        <div v-if="selectedItem" class="text-sm text-gray-600 mt-1">
                            Target price: €{{ selectedItem.targetSalesPrice?.toFixed(2) || '0.00' }}
                        </div>
                    </div>

                    <!-- Platform -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Platform
                        </label>
                        <select v-model="form.platform" class="w-full border rounded px-3 py-2" required>
                            <option value="Vinted">Vinted</option>
                            <option value="Depop">Depop</option>
                            <option value="eBay">eBay</option>
                            <option value="Facebook Marketplace">Facebook Marketplace</option>
                        </select>
                    </div>

                    <!-- Status -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select v-model="form.status" class="w-full border rounded px-3 py-2" required>
                            <option value="Draft">Draft</option>
                            <option value="Active">Active</option>
                            <option value="Paused">Paused</option>
                        </select>
                    </div>

                    <!-- Condition -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Condition
                        </label>
                        <select v-model="form.condition" class="w-full border rounded px-3 py-2" required>
                            <option value="New with tags">New with tags</option>
                            <option value="New without tags">New without tags</option>
                            <option value="Very good">Very good</option>
                            <option value="Good">Good</option>
                            <option value="Satisfactory">Satisfactory</option>
                        </select>
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea 
                            v-model="form.description" 
                            rows="4" 
                            class="w-full border rounded px-3 py-2"
                            placeholder="Describe the item condition, size, fit, etc..."
                        ></textarea>
                    </div>

                    <!-- Image URLs -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Image URLs
                        </label>
                        <div v-for="(url, index) in form.imageUrls" :key="index" class="flex gap-2 mb-2">
                            <input 
                                v-model="form.imageUrls[index]" 
                                type="url" 
                                class="flex-1 border rounded px-3 py-2"
                                :placeholder="`Image ${index + 1} URL`"
                            />
                            <button 
                                @click="removeImageUrl(index)" 
                                type="button"
                                class="px-3 py-2 text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        </div>
                        <button 
                            @click="addImageUrl" 
                            type="button"
                            class="px-4 py-2 text-blue-600 hover:text-blue-800"
                        >
                            + Add Image URL
                        </button>
                    </div>
                </div>

                <!-- Profit Analysis -->
                <div v-if="selectedItem" class="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 class="text-lg font-semibold mb-3">Profit Analysis</h3>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div class="text-gray-600">All-in Cost</div>
                            <div class="font-medium">€{{ selectedItem.allInCost?.toFixed(2) || '0.00' }}</div>
                        </div>
                        <div>
                            <div class="text-gray-600">Listed Price</div>
                            <div class="font-medium">€{{ form.listedPrice?.toFixed(2) || '0.00' }}</div>
                        </div>
                        <div>
                            <div class="text-gray-600">Estimated Profit</div>
                            <div :class="estimatedProfit >= 0 ? 'font-medium text-green-600' : 'font-medium text-red-600'">
                                €{{ estimatedProfit.toFixed(2) }}
                            </div>
                        </div>
                        <div>
                            <div class="text-gray-600">Profit Margin</div>
                            <div :class="profitMargin >= 0 ? 'font-medium text-green-600' : 'font-medium text-red-600'">
                                {{ profitMargin.toFixed(1) }}%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-3 mt-6">
                    <button 
                        @click="goBack" 
                        type="button"
                        class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        :disabled="!isFormValid"
                    >
                        {{ isEditing ? 'Update Listing' : 'Create Listing' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import inventoryData from '../../data/inventory.json'
import listingsData from '../../data/listings.json'

export default {
    name: 'SellListingForm',
    data() {
        return {
            inventoryItems: inventoryData || [],
            listings: listingsData || [],
            form: {
                itemId: null,
                listedPrice: null,
                platform: 'Vinted',
                status: 'Draft',
                condition: 'Very good',
                description: '',
                imageUrls: ['']
            }
        }
    },
    computed: {
        isEditing() {
            return this.$route.params.id && this.$route.params.id !== 'new'
        },
        availableItems() {
            // Show inventory items that aren't already actively listed
            const listedItemIds = this.listings
                .filter(listing => listing.status === 'Active')
                .map(listing => listing.itemId)
            
            return this.inventoryItems.filter(item => 
                item.status === 'In Stock' && !listedItemIds.includes(item.id)
            )
        },
        selectedItem() {
            if (!this.form.itemId) return null
            return this.inventoryItems.find(item => item.id === this.form.itemId)
        },
        estimatedProfit() {
            if (!this.selectedItem || !this.form.listedPrice) return 0
            return this.form.listedPrice - (this.selectedItem.allInCost || 0)
        },
        profitMargin() {
            if (!this.selectedItem || !this.form.listedPrice) return 0
            const cost = this.selectedItem.allInCost || 0
            if (cost === 0) return 0
            return ((this.form.listedPrice - cost) / cost) * 100
        },
        isFormValid() {
            return this.form.itemId && 
                   this.form.listedPrice && 
                   this.form.listedPrice > 0 &&
                   this.form.platform &&
                   this.form.status &&
                   this.form.condition
        }
    },
    methods: {
        addImageUrl() {
            this.form.imageUrls.push('')
        },
        removeImageUrl(index) {
            if (this.form.imageUrls.length > 1) {
                this.form.imageUrls.splice(index, 1)
            }
        },
        saveListing() {
            if (!this.isFormValid) return

            const listingData = {
                ...this.form,
                id: this.isEditing ? parseInt(this.$route.params.id) : Date.now(),
                itemName: this.selectedItem?.itemName,
                sku: this.selectedItem?.sku,
                brand: this.selectedItem?.brand,
                size: this.selectedItem?.size,
                category: this.selectedItem?.category,
                listingDate: this.isEditing ? undefined : new Date().toISOString().split('T')[0],
                views: this.isEditing ? undefined : 0,
                likes: this.isEditing ? undefined : 0,
                messages: this.isEditing ? undefined : 0,
                offers: this.isEditing ? undefined : 0,
                imageUrls: this.form.imageUrls.filter(url => url.trim())
            }

            // In a real app, this would make an API call
            console.log('Saving listing:', listingData)
            
            // Show success message
            alert(`Listing ${this.isEditing ? 'updated' : 'created'} successfully!`)
            
            // Navigate back to listings
            this.$router.push('/sell')
        },
        goBack() {
            this.$router.push('/sell')
        },
        loadListing() {
            if (this.isEditing) {
                const listing = this.listings.find(l => l.id === parseInt(this.$route.params.id))
                if (listing) {
                    this.form = {
                        itemId: listing.itemId,
                        listedPrice: listing.listedPrice,
                        platform: listing.platform || 'Vinted',
                        status: listing.status,
                        condition: listing.condition,
                        description: listing.description || '',
                        imageUrls: listing.imageUrls || ['']
                    }
                }
            }
        }
    },
    mounted() {
        this.loadListing()
        if (this.$store) {
            this.$store.dispatch('menus/mainMenu', 'sell')
            this.$store.dispatch('menus/subMenu', 'sell')
        }
    }
}
</script>