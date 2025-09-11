<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Performance Analytics</h1>
        
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Total Revenue</div>
                <div class="text-2xl font-bold text-green-600">{{ totalRevenue }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Conversion Rate</div>
                <div class="text-2xl font-bold text-blue-600">{{ conversionRate }}%</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Avg. Days to Sell</div>
                <div class="text-2xl font-bold text-purple-600">{{ avgDaysToSell }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Best Performing Category</div>
                <div class="text-2xl font-bold text-orange-600">{{ bestCategory }}</div>
            </div>
        </div>

        <!-- Performance Metrics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Views vs Sales Chart Placeholder -->
            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 class="text-xl font-semibold mb-4">Views vs Sales Trend</h2>
                <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    <div class="text-center">
                        <div class="text-4xl mb-2">📊</div>
                        <div>Chart integration placeholder</div>
                        <div class="text-sm">Connect to Chart.js or similar library</div>
                    </div>
                </div>
            </div>

            <!-- Top Performing Items -->
            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 class="text-xl font-semibold mb-4">Top Performing Items</h2>
                <div class="space-y-3">
                    <div v-for="item in topPerformingItems" :key="item.id" 
                         class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                            <div class="font-medium">{{ item.itemName }}</div>
                            <div class="text-sm text-gray-600">{{ item.views }} views • {{ item.likes }} likes</div>
                        </div>
                        <div class="text-right">
                            <div class="font-semibold text-green-600">{{ formatMoney(item.listedPrice) }}</div>
                            <div class="text-sm text-gray-600">{{ item.status }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detailed Performance Table -->
        <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 pb-4 border-b border-gray-100">
                <h2 class="text-xl font-semibold">Listing Performance Details</h2>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600">Sort by:</label>
                        <select v-model="sortBy" class="border rounded px-2 py-1">
                            <option value="views">Views</option>
                            <option value="likes">Likes</option>
                            <option value="conversion">Conversion Rate</option>
                            <option value="revenue">Revenue</option>
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
                                <th class="px-3 py-2 border">Item</th>
                                <th class="px-3 py-2 border">Status</th>
                                <th class="px-3 py-2 border">Listed Price</th>
                                <th class="px-3 py-2 border">Views</th>
                                <th class="px-3 py-2 border">Likes</th>
                                <th class="px-3 py-2 border">Messages</th>
                                <th class="px-3 py-2 border">Offers</th>
                                <th class="px-3 py-2 border">Conversion Rate</th>
                                <th class="px-3 py-2 border">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(listing, idx) in pagedData" :key="idx" class="hover:bg-gray-50">
                                <td class="px-3 py-2 border">
                                    <div>
                                        <div class="font-medium">{{ listing.itemName }}</div>
                                        <div class="text-sm text-gray-600">{{ listing.brand }} • {{ listing.sku }}</div>
                                    </div>
                                </td>
                                <td class="px-3 py-2 border">
                                    <span :class="getStatusClass(listing.status)">{{ listing.status }}</span>
                                </td>
                                <td class="px-3 py-2 border">{{ formatMoney(listing.listedPrice) }}</td>
                                <td class="px-3 py-2 border">
                                    <span class="font-medium">{{ listing.views || 0 }}</span>
                                </td>
                                <td class="px-3 py-2 border">
                                    <span class="font-medium">{{ listing.likes || 0 }}</span>
                                </td>
                                <td class="px-3 py-2 border">{{ listing.messages || 0 }}</td>
                                <td class="px-3 py-2 border">{{ listing.offers || 0 }}</td>
                                <td class="px-3 py-2 border">
                                    <span :class="getConversionRateClass(listing)">
                                        {{ calculateConversionRate(listing) }}%
                                    </span>
                                </td>
                                <td class="px-3 py-2 border">
                                    <span class="font-medium text-green-600">
                                        {{ formatMoney(calculateRevenue(listing)) }}
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="sortedListings.length === 0">
                                <td colspan="9" class="px-3 py-4 text-center text-gray-500">No performance data available</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div>Showing {{ startIndex + 1 }} - {{ Math.min(endIndex, sortedListings.length) }} of {{ sortedListings.length }}</div>
                <div class="flex items-center gap-2">
                    <button :disabled="page === 1" @click="page--"
                        class="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
                    <button :disabled="endIndex >= sortedListings.length" @click="page++"
                        class="px-2 py-1 border rounded disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import listingsData from '../../data/listings.json'

export default {
    name: 'SellPerformance',
    data() {
        return {
            listings: listingsData || [],
            sortBy: 'views',
            page: 1,
            perPage: 25
        }
    },
    computed: {
        sortedListings() {
            const sorted = [...this.listings].sort((a, b) => {
                switch (this.sortBy) {
                    case 'views':
                        return (b.views || 0) - (a.views || 0)
                    case 'likes':
                        return (b.likes || 0) - (a.likes || 0)
                    case 'conversion':
                        return this.calculateConversionRate(b) - this.calculateConversionRate(a)
                    case 'revenue':
                        return this.calculateRevenue(b) - this.calculateRevenue(a)
                    default:
                        return 0
                }
            })
            return sorted
        },
        startIndex() {
            return (this.page - 1) * this.perPage
        },
        endIndex() {
            return this.page * this.perPage
        },
        pagedData() {
            return this.sortedListings.slice(this.startIndex, this.endIndex)
        },
        totalRevenue() {
            const revenue = this.listings.reduce((sum, listing) => {
                return sum + this.calculateRevenue(listing)
            }, 0)
            return this.formatMoney(revenue)
        },
        conversionRate() {
            const totalViews = this.listings.reduce((sum, l) => sum + (l.views || 0), 0)
            const soldListings = this.listings.filter(l => l.status === 'Sold').length
            if (totalViews === 0) return '0.0'
            return ((soldListings / this.listings.length) * 100).toFixed(1)
        },
        avgDaysToSell() {
            const soldListings = this.listings.filter(l => l.status === 'Sold' && l.soldDate && l.listingDate)
            if (soldListings.length === 0) return 'N/A'
            
            const totalDays = soldListings.reduce((sum, listing) => {
                const listDate = new Date(listing.listingDate)
                const soldDate = new Date(listing.soldDate)
                const daysDiff = Math.ceil((soldDate - listDate) / (1000 * 60 * 60 * 24))
                return sum + daysDiff
            }, 0)
            
            return Math.round(totalDays / soldListings.length)
        },
        bestCategory() {
            const categoryStats = {}
            this.listings.forEach(listing => {
                const category = listing.category || 'Unknown'
                if (!categoryStats[category]) {
                    categoryStats[category] = { count: 0, revenue: 0 }
                }
                categoryStats[category].count++
                categoryStats[category].revenue += this.calculateRevenue(listing)
            })
            
            let bestCategory = 'N/A'
            let highestRevenue = 0
            Object.entries(categoryStats).forEach(([category, stats]) => {
                if (stats.revenue > highestRevenue) {
                    highestRevenue = stats.revenue
                    bestCategory = category
                }
            })
            
            return bestCategory
        },
        topPerformingItems() {
            return [...this.listings]
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 5)
        }
    },
    methods: {
        formatMoney(v) {
            if (v === null || v === undefined || v === '') return '€0.00'
            if (typeof v !== 'number') return v
            return '€' + v.toFixed(2)
        },
        calculateConversionRate(listing) {
            const views = listing.views || 0
            if (views === 0) return 0
            const sold = listing.status === 'Sold' ? 1 : 0
            return ((sold / 1) * 100).toFixed(1)
        },
        calculateRevenue(listing) {
            return listing.status === 'Sold' ? (listing.soldPrice || listing.listedPrice || 0) : 0
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
        getConversionRateClass(listing) {
            const rate = this.calculateConversionRate(listing)
            if (rate >= 50) return 'text-green-600 font-medium'
            if (rate >= 25) return 'text-orange-600 font-medium'
            return 'text-gray-600'
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