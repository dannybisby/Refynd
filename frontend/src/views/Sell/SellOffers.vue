<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Offers</h1>
        
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Total Offers</div>
                <div class="text-2xl font-bold text-blue-600">{{ totalOffers }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Pending Offers</div>
                <div class="text-2xl font-bold text-orange-600">{{ pendingOffers }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Accepted Offers</div>
                <div class="text-2xl font-bold text-green-600">{{ acceptedOffers }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Average Offer Value</div>
                <div class="text-2xl font-bold text-purple-600">{{ averageOfferValue }}</div>
            </div>
        </div>

        <!-- Offers Table -->
        <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 pb-4 border-b border-gray-100">
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600">Search:</label>
                    <input v-model="query" type="text" placeholder="Buyer name, listing..."
                        class="border rounded px-2 py-1" />
                </div>

                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600">Status:</label>
                        <select v-model="statusFilter" class="border rounded px-2 py-1">
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Declined">Declined</option>
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

            <div class="overflow-x-auto mt-4">
                <div class="w-full bg-white rounded-md border border-gray-100">
                    <table class="min-w-full table-auto border-collapse">
                        <thead>
                            <tr class="bg-gray-100 text-left">
                                <th class="px-3 py-2 border">Status</th>
                                <th class="px-3 py-2 border">Listing</th>
                                <th class="px-3 py-2 border">Listed Price</th>
                                <th class="px-3 py-2 border">Offered Price</th>
                                <th class="px-3 py-2 border">Difference</th>
                                <th class="px-3 py-2 border">Buyer</th>
                                <th class="px-3 py-2 border">Offer Date</th>
                                <th class="px-3 py-2 border">Message</th>
                                <th class="px-3 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(offer, idx) in pagedData" :key="idx" class="hover:bg-gray-50">
                                <td class="px-3 py-2 border">
                                    <span :class="getStatusClass(offer.status)">{{ offer.status }}</span>
                                </td>
                                <td class="px-3 py-2 border">{{ getListingName(offer.listingId) }}</td>
                                <td class="px-3 py-2 border">{{ formatMoney(getListingPrice(offer.listingId)) }}</td>
                                <td class="px-3 py-2 border">{{ formatMoney(offer.offeredPrice) }}</td>
                                <td class="px-3 py-2 border">
                                    <span :class="getDifferenceClass(offer.listingId, offer.offeredPrice)">
                                        {{ formatDifference(offer.listingId, offer.offeredPrice) }}
                                    </span>
                                </td>
                                <td class="px-3 py-2 border">{{ offer.buyerName }}</td>
                                <td class="px-3 py-2 border">{{ offer.offerDate }}</td>
                                <td class="px-3 py-2 border max-w-xs">
                                    <div class="truncate" :title="offer.message">
                                        {{ offer.message || '-' }}
                                    </div>
                                </td>
                                <td class="px-3 py-2 border">
                                    <div class="flex gap-1">
                                        <button v-if="offer.status === 'Pending'" @click="acceptOffer(offer)" 
                                            class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                            title="Accept Offer">
                                            Accept
                                        </button>
                                        <button v-if="offer.status === 'Pending'" @click="declineOffer(offer)" 
                                            class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                            title="Decline Offer">
                                            Decline
                                        </button>
                                        <button @click="viewListing(offer.listingId)" 
                                            class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                            title="View Listing">
                                            View
                                        </button>
                                        <button @click="messageBuyer(offer)" 
                                            class="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                                            title="Message Buyer">
                                            Message
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filtered.length === 0">
                                <td colspan="9" class="px-3 py-4 text-center text-gray-500">No offers found</td>
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
import offersData from '../../data/offers.json'
import listingsData from '../../data/listings.json'

export default {
    name: 'SellOffers',
    data() {
        return {
            offers: offersData || [],
            listings: listingsData || [],
            query: '',
            statusFilter: '',
            page: 1,
            perPage: 25
        }
    },
    computed: {
        filtered() {
            let result = this.offers

            // Filter by search query
            const q = this.query && this.query.toLowerCase()
            if (q) {
                result = result.filter(offer => {
                    return (
                        (offer.buyerName || '').toLowerCase().includes(q) ||
                        (this.getListingName(offer.listingId) || '').toLowerCase().includes(q) ||
                        (offer.message || '').toLowerCase().includes(q)
                    )
                })
            }

            // Filter by status
            if (this.statusFilter) {
                result = result.filter(offer => offer.status === this.statusFilter)
            }

            // Sort by offer date (newest first)
            return result.sort((a, b) => new Date(b.offerDate) - new Date(a.offerDate))
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
        totalOffers() {
            return this.offers.length
        },
        pendingOffers() {
            return this.offers.filter(o => o.status === 'Pending').length
        },
        acceptedOffers() {
            return this.offers.filter(o => o.status === 'Accepted').length
        },
        averageOfferValue() {
            if (this.offers.length === 0) return '€0.00'
            const total = this.offers.reduce((sum, o) => sum + (o.offeredPrice || 0), 0)
            return this.formatMoney(total / this.offers.length)
        }
    },
    methods: {
        getListingName(listingId) {
            const listing = this.listings.find(l => l.id === listingId)
            return listing ? listing.itemName : 'Unknown Listing'
        },
        getListingPrice(listingId) {
            const listing = this.listings.find(l => l.id === listingId)
            return listing ? listing.listedPrice : 0
        },
        formatMoney(v) {
            if (v === null || v === undefined || v === '') return '-'
            if (typeof v !== 'number') return v
            return '€' + v.toFixed(2)
        },
        formatDifference(listingId, offeredPrice) {
            const listedPrice = this.getListingPrice(listingId)
            if (!listedPrice || !offeredPrice) return '-'
            const diff = offeredPrice - listedPrice
            const percentage = ((diff / listedPrice) * 100).toFixed(1)
            return `${this.formatMoney(diff)} (${percentage}%)`
        },
        getDifferenceClass(listingId, offeredPrice) {
            const listedPrice = this.getListingPrice(listingId)
            if (!listedPrice || !offeredPrice) return 'text-gray-600'
            const diff = offeredPrice - listedPrice
            return diff >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
        },
        getStatusClass(status) {
            const baseClass = 'px-2 py-1 rounded-full text-xs font-medium '
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
        acceptOffer(offer) {
            // In a real app, this would make an API call
            offer.status = 'Accepted'
            alert(`Offer of ${this.formatMoney(offer.offeredPrice)} from ${offer.buyerName} has been accepted!`)
        },
        declineOffer(offer) {
            // In a real app, this would make an API call
            offer.status = 'Declined'
        },
        viewListing(listingId) {
            this.$router.push(`/sell/listing/${listingId}`)
        },
        messageBuyer(offer) {
            this.$router.push(`/sell/listing/${offer.listingId}/messages?buyer=${offer.buyerName}`)
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