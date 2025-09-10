<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-3xl font-bold">Listing Details</h1>
            <div class="flex gap-2">
                <button @click="editListing" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Edit Listing
                </button>
                <button @click="goBack" class="px-4 py-2 text-gray-600 hover:text-gray-800">
                    ← Back to Listings
                </button>
            </div>
        </div>

        <div v-if="listing" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Listing Info -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Basic Info Card -->
                <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 class="text-xl font-semibold mb-4">Basic Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm text-gray-600">Item Name</label>
                            <div class="font-medium">{{ listing.itemName }}</div>
                        </div>
                        <div>
                            <label class="text-sm text-gray-600">SKU</label>
                            <div class="font-medium">{{ listing.sku }}</div>
                        </div>
                        <div>
                            <label class="text-sm text-gray-600">Brand</label>
                            <div class="font-medium">{{ listing.brand }}</div>
                        </div>
                        <div>
                            <label class="text-sm text-gray-600">Size</label>
                            <div class="font-medium">{{ listing.size }}</div>
                        </div>
                        <div>
                            <label class="text-sm text-gray-600">Category</label>
                            <div class="font-medium">{{ listing.category }}</div>
                        </div>
                        <div>
                            <label class="text-sm text-gray-600">Condition</label>
                            <div class="font-medium">{{ listing.condition }}</div>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <label class="text-sm text-gray-600">Description</label>
                        <div class="mt-1">{{ listing.description || 'No description provided' }}</div>
                    </div>
                </div>

                <!-- Pricing & Performance -->
                <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 class="text-xl font-semibold mb-4">Pricing & Performance</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label class="text-sm text-gray-600">Listed Price</label>
                            <div class="text-xl font-bold text-blue-600">{{ formatMoney(listing.listedPrice) }}</div>
                        </div>
                        <div>
                            <label class="text-sm text-gray-600">Views</label>
                            <div class="text-xl font-bold text-green-600">{{ listing.views || 0 }}</div>
                        </div>
                        <div>
                            <label class="text-sm text-gray-600">Likes</label>
                            <div class="text-xl font-bold text-purple-600">{{ listing.likes || 0 }}</div>
                        </div>
                        <div>
                            <label class="text-sm text-gray-600">Platform</label>
                            <div class="font-medium">{{ listing.platform || 'Vinted' }}</div>
                        </div>
                    </div>
                </div>

                <!-- Messages & Offers -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Recent Messages -->
                    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold">Recent Messages ({{ recentMessages.length }})</h3>
                            <button @click="viewAllMessages" class="text-blue-600 hover:text-blue-800 text-sm">
                                View All
                            </button>
                        </div>
                        <div class="space-y-3">
                            <div v-for="message in recentMessages.slice(0, 3)" :key="message.id" 
                                 :class="[
                                     'p-3 rounded-lg',
                                     !message.isRead && message.isFromBuyer ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                                 ]">
                                <div class="flex justify-between items-start mb-1">
                                    <span class="font-medium text-sm">{{ message.senderName }}</span>
                                    <span class="text-xs text-gray-500">{{ formatDate(message.timestamp) }}</span>
                                </div>
                                <div class="text-sm text-gray-700">{{ message.message }}</div>
                            </div>
                            <div v-if="recentMessages.length === 0" class="text-center text-gray-500 py-4">
                                No messages yet
                            </div>
                        </div>
                    </div>

                    <!-- Recent Offers -->
                    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold">Offers ({{ recentOffers.length }})</h3>
                            <button @click="viewAllOffers" class="text-blue-600 hover:text-blue-800 text-sm">
                                View All
                            </button>
                        </div>
                        <div class="space-y-3">
                            <div v-for="offer in recentOffers.slice(0, 3)" :key="offer.id" 
                                 class="p-3 bg-gray-50 rounded-lg">
                                <div class="flex justify-between items-start mb-1">
                                    <span class="font-medium text-sm">{{ offer.buyerName }}</span>
                                    <span :class="getOfferStatusClass(offer.status)">{{ offer.status }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-lg font-bold">{{ formatMoney(offer.offeredPrice) }}</span>
                                    <span class="text-sm text-gray-600">{{ offer.offerDate }}</span>
                                </div>
                                <div v-if="offer.message" class="text-sm text-gray-600 mt-1">
                                    "{{ offer.message }}"
                                </div>
                            </div>
                            <div v-if="recentOffers.length === 0" class="text-center text-gray-500 py-4">
                                No offers yet
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Status & Actions -->
                <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 class="text-lg font-semibold mb-4">Status & Actions</h3>
                    
                    <div class="mb-4">
                        <label class="text-sm text-gray-600">Current Status</label>
                        <div class="mt-1">
                            <span :class="getStatusClass(listing.status)">{{ listing.status }}</span>
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <label class="text-sm text-gray-600">Listed Date</label>
                        <div class="font-medium">{{ listing.listingDate || 'Not listed yet' }}</div>
                    </div>

                    <div class="space-y-2">
                        <button v-if="listing.status === 'Draft'" @click="publishListing" 
                                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Publish Listing
                        </button>
                        <button v-if="listing.status === 'Active'" @click="pauseListing" 
                                class="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                            Pause Listing
                        </button>
                        <button v-if="listing.status === 'Active'" @click="markAsSold" 
                                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Mark as Sold
                        </button>
                        <button @click="archiveListing" 
                                class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            Archive Listing
                        </button>
                    </div>
                </div>

                <!-- Images -->
                <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 class="text-lg font-semibold mb-4">Images</h3>
                    <div v-if="listing.imageUrls && listing.imageUrls.length > 0" class="space-y-2">
                        <div v-for="(url, index) in listing.imageUrls" :key="index" 
                             class="text-sm text-blue-600 truncate">
                            Image {{ index + 1 }}: {{ url }}
                        </div>
                    </div>
                    <div v-else class="text-gray-500 text-center py-4">
                        No images uploaded
                    </div>
                </div>

                <!-- Profit Analysis -->
                <div v-if="inventoryItem" class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 class="text-lg font-semibold mb-4">Profit Analysis</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-600">All-in Cost:</span>
                            <span class="font-medium">{{ formatMoney(inventoryItem.allInCost) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Listed Price:</span>
                            <span class="font-medium">{{ formatMoney(listing.listedPrice) }}</span>
                        </div>
                        <div class="flex justify-between border-t pt-2">
                            <span class="text-gray-600">Potential Profit:</span>
                            <span :class="potentialProfit >= 0 ? 'font-bold text-green-600' : 'font-bold text-red-600'">
                                {{ formatMoney(potentialProfit) }}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Margin:</span>
                            <span :class="profitMargin >= 0 ? 'font-bold text-green-600' : 'font-bold text-red-600'">
                                {{ profitMargin.toFixed(1) }}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-8">
            <div class="text-gray-500">Listing not found</div>
        </div>
    </div>
</template>

<script>
import listingsData from '../../data/listings.json'
import messagesData from '../../data/messages.json'
import offersData from '../../data/offers.json'
import inventoryData from '../../data/inventory.json'

export default {
    name: 'SellListingDetail',
    data() {
        return {
            listings: listingsData || [],
            messages: messagesData || [],
            offers: offersData || [],
            inventory: inventoryData || []
        }
    },
    computed: {
        listingId() {
            return parseInt(this.$route.params.id)
        },
        listing() {
            return this.listings.find(l => l.id === this.listingId)
        },
        inventoryItem() {
            if (!this.listing) return null
            return this.inventory.find(item => item.id === this.listing.itemId)
        },
        recentMessages() {
            return this.messages.filter(m => m.listingId === this.listingId)
                              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        },
        recentOffers() {
            return this.offers.filter(o => o.listingId === this.listingId)
                             .sort((a, b) => new Date(b.offerDate) - new Date(a.offerDate))
        },
        potentialProfit() {
            if (!this.listing || !this.inventoryItem) return 0
            return this.listing.listedPrice - (this.inventoryItem.allInCost || 0)
        },
        profitMargin() {
            if (!this.listing || !this.inventoryItem || !this.inventoryItem.allInCost) return 0
            return ((this.listing.listedPrice - this.inventoryItem.allInCost) / this.inventoryItem.allInCost) * 100
        }
    },
    methods: {
        formatMoney(v) {
            if (v === null || v === undefined || v === '') return '€0.00'
            if (typeof v !== 'number') return v
            return '€' + v.toFixed(2)
        },
        formatDate(timestamp) {
            if (!timestamp) return '-'
            return new Date(timestamp).toLocaleDateString() + ' ' + 
                   new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        getStatusClass(status) {
            const baseClass = 'px-2 py-1 rounded-full text-xs font-medium '
            switch (status) {
                case 'Active':
                    return baseClass + 'bg-green-100 text-green-800'
                case 'Draft':
                    return baseClass + 'bg-gray-100 text-gray-800'
                case 'Sold':
                    return baseClass + 'bg-blue-100 text-blue-800'
                case 'Archived':
                    return baseClass + 'bg-red-100 text-red-800'
                default:
                    return baseClass + 'bg-gray-100 text-gray-800'
            }
        },
        getOfferStatusClass(status) {
            const baseClass = 'px-2 py-1 rounded text-xs font-medium '
            switch (status) {
                case 'Pending':
                    return baseClass + 'bg-orange-100 text-orange-800'
                case 'Accepted':
                    return baseClass + 'bg-green-100 text-green-800'
                case 'Declined':
                    return baseClass + 'bg-red-100 text-red-800'
                default:
                    return baseClass + 'bg-gray-100 text-gray-800'
            }
        },
        editListing() {
            this.$router.push(`/sell/listing/${this.listingId}/edit`)
        },
        viewAllMessages() {
            this.$router.push(`/sell/listing/${this.listingId}/messages`)
        },
        viewAllOffers() {
            this.$router.push(`/sell/listing/${this.listingId}/offers`)
        },
        publishListing() {
            // In a real app, this would make an API call
            alert('Listing published successfully!')
            this.listing.status = 'Active'
            this.listing.listingDate = new Date().toISOString().split('T')[0]
        },
        pauseListing() {
            // In a real app, this would make an API call
            alert('Listing paused')
            this.listing.status = 'Paused'
        },
        markAsSold() {
            // In a real app, this would make an API call
            const soldPrice = prompt('Enter the sold price:')
            if (soldPrice && !isNaN(soldPrice)) {
                alert('Listing marked as sold!')
                this.listing.status = 'Sold'
                this.listing.soldPrice = parseFloat(soldPrice)
                this.listing.soldDate = new Date().toISOString().split('T')[0]
            }
        },
        archiveListing() {
            if (confirm('Are you sure you want to archive this listing?')) {
                alert('Listing archived')
                this.listing.status = 'Archived'
            }
        },
        goBack() {
            this.$router.push('/sell')
        }
    },
    mounted() {
        if (this.$store) {
            this.$store.dispatch('menus/mainMenu', 'sell')
            this.$store.dispatch('menus/subMenu', 'sell')
        }
    }
}
</script>