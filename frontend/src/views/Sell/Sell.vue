<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Sell</h1>
        
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Active Listings</div>
                <div class="text-2xl font-bold text-blue-600">{{ activeListingsCount }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Total Views</div>
                <div class="text-2xl font-bold text-green-600">{{ totalViews }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Pending Offers</div>
                <div class="text-2xl font-bold text-orange-600">{{ pendingOffersCount }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Unread Messages</div>
                <div class="text-2xl font-bold text-red-600">{{ unreadMessagesCount }}</div>
            </div>
        </div>

        <!-- Listings Table -->
        <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 pb-4 border-b border-gray-100">
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600">Search:</label>
                    <input v-model="query" type="text" placeholder="Item name, brand, SKU..."
                        class="border rounded px-2 py-1" />
                </div>

                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600">Status:</label>
                        <select v-model="statusFilter" class="border rounded px-2 py-1">
                            <option value="">All</option>
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Sold">Sold</option>
                            <option value="Archived">Archived</option>
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
                    <button @click="createNewListing" 
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Create Listing
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto mt-4">
                <div class="w-full bg-white rounded-md border border-gray-100">
                    <table class="min-w-full table-auto border-collapse">
                        <thead>
                            <tr class="bg-gray-100 text-left">
                                <th class="px-3 py-2 border">Status</th>
                                <th class="px-3 py-2 border">Item</th>
                                <th class="px-3 py-2 border">SKU</th>
                                <th class="px-3 py-2 border">Listed Price</th>
                                <th class="px-3 py-2 border">Listed Date</th>
                                <th class="px-3 py-2 border">Views</th>
                                <th class="px-3 py-2 border">Likes</th>
                                <th class="px-3 py-2 border">Messages</th>
                                <th class="px-3 py-2 border">Offers</th>
                                <th class="px-3 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(listing, idx) in pagedData" :key="idx" class="hover:bg-gray-50">
                                <td class="px-3 py-2 border">
                                    <span :class="getStatusClass(listing.status)">{{ listing.status }}</span>
                                </td>
                                <td class="px-3 py-2 border">{{ listing.itemName }}</td>
                                <td class="px-3 py-2 border">{{ listing.sku }}</td>
                                <td class="px-3 py-2 border">{{ formatMoney(listing.listedPrice) }}</td>
                                <td class="px-3 py-2 border">{{ listing.listingDate || '-' }}</td>
                                <td class="px-3 py-2 border">{{ listing.views || 0 }}</td>
                                <td class="px-3 py-2 border">{{ listing.likes || 0 }}</td>
                                <td class="px-3 py-2 border">
                                    <span :class="listing.messages > 0 ? 'text-blue-600 font-medium' : ''">
                                        {{ listing.messages || 0 }}
                                    </span>
                                </td>
                                <td class="px-3 py-2 border">
                                    <span :class="listing.offers > 0 ? 'text-orange-600 font-medium' : ''">
                                        {{ listing.offers || 0 }}
                                    </span>
                                </td>
                                <td class="px-3 py-2 border">
                                    <div class="flex gap-1">
                                        <button @click="viewListing(listing)" 
                                            class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                            title="View Details">
                                            View
                                        </button>
                                        <button @click="editListing(listing)" 
                                            class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                            title="Edit Listing">
                                            Edit
                                        </button>
                                        <button v-if="listing.messages > 0" @click="viewMessages(listing)" 
                                            class="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                                            title="View Messages">
                                            Messages
                                        </button>
                                        <button v-if="listing.offers > 0" @click="viewOffers(listing)" 
                                            class="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                                            title="View Offers">
                                            Offers
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filtered.length === 0">
                                <td colspan="10" class="px-3 py-4 text-center text-gray-500">No listings found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

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
import listingsData from '../../data/listings.json'
import offersData from '../../data/offers.json'
import messagesData from '../../data/messages.json'

export default {
    name: 'Sell',
    data() {
        return {
            listings: listingsData || [],
            offers: offersData || [],
            messages: messagesData || [],
            query: '',
            statusFilter: '',
            page: 1,
            perPage: 25
        }
    },
    computed: {
        filtered() {
            let result = this.listings

            // Filter by search query
            const q = this.query && this.query.toLowerCase()
            if (q) {
                result = result.filter(listing => {
                    return (
                        (listing.itemName || '').toLowerCase().includes(q) ||
                        (listing.brand || '').toLowerCase().includes(q) ||
                        (listing.sku || '').toLowerCase().includes(q)
                    )
                })
            }

            // Filter by status
            if (this.statusFilter) {
                result = result.filter(listing => listing.status === this.statusFilter)
            }

            return result
        },
        startIndex() {
            return (this.page - 1) * this.perPage
        },
        endIndex() {
            return this.page * this.perPage
        },
        pagedData() {
            return this.filtered.slice(this.startIndex, this.endIndex)
        },
        activeListingsCount() {
            return this.listings.filter(l => l.status === 'Active').length
        },
        totalViews() {
            return this.listings.reduce((sum, l) => sum + (l.views || 0), 0)
        },
        pendingOffersCount() {
            return this.offers.filter(o => o.status === 'Pending').length
        },
        unreadMessagesCount() {
            return this.messages.filter(m => !m.isRead && m.isFromBuyer).length
        }
    },
    methods: {
        formatMoney(v) {
            if (v === null || v === undefined || v === '') return '-'
            if (typeof v !== 'number') return v
            return '€' + v.toFixed(2)
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
        viewListing(listing) {
            this.$router.push(`/sell/listing/${listing.id}`)
        },
        editListing(listing) {
            this.$router.push(`/sell/listing/${listing.id}/edit`)
        },
        viewMessages(listing) {
            this.$router.push(`/sell/listing/${listing.id}/messages`)
        },
        viewOffers(listing) {
            this.$router.push(`/sell/listing/${listing.id}/offers`)
        },
        createNewListing() {
            this.$router.push('/sell/listing/new')
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