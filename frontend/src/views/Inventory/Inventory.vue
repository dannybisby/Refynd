<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Inventory</h1>
        <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div
                class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 pb-4 border-b border-gray-100">
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600">Search:</label>
                    <input v-model="query" type="text" placeholder="Item name, brand, seller..."
                        class="border rounded px-2 py-1" />
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

            <div class="overflow-x-auto mt-4">
                <div class="w-full bg-white rounded-md border border-gray-100">
                    <table class="min-w-full table-auto border-collapse">
                        <thead>
                            <tr class="bg-gray-100 text-left">
                                <th class="px-3 py-2 border">Date</th>
                                <th class="px-3 py-2 border">Status</th>
                                <th class="px-3 py-2 border">Item</th>
                                <th class="px-3 py-2 border">SKU</th>
                                <th class="px-3 py-2 border">Brand</th>
                                <th class="px-3 py-2 border">Size</th>
                                <th class="px-3 py-2 border">Seller</th>
                                <th class="px-3 py-2 border">All-in Cost</th>
                                <th class="px-3 py-2 border">Target Price</th>
                                <th class="px-3 py-2 border">Actual Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, idx) in pagedData" :key="idx" class="hover:bg-gray-50">
                                <td class="px-3 py-2 border">{{ row.dateOfPurchase || '-' }}</td>
                                <td class="px-3 py-2 border">{{ row.status || '-' }}</td>
                                <td class="px-3 py-2 border">{{ row.itemName || '-' }}</td>
                                <td class="px-3 py-2 border">{{ row.sku || '-' }}</td>
                                <td class="px-3 py-2 border">{{ row.brand || '-' }}</td>
                                <td class="px-3 py-2 border">{{ row.size || '-' }}</td>
                                <td class="px-3 py-2 border">{{ row.seller || '-' }}</td>
                                <td class="px-3 py-2 border">{{ formatMoney(row.allInCost) }}</td>
                                <td class="px-3 py-2 border">{{ formatMoney(row.targetSalesPrice) }}</td>
                                <td class="px-3 py-2 border">{{ formatMoney(row.actualSalesPrice) }}</td>
                            </tr>
                            <tr v-if="filtered.length === 0">
                                <td colspan="10" class="px-3 py-4 text-center text-gray-500">No results</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div>Showing {{ startIndex + 1 }} - {{ Math.min(endIndex, filtered.length) }} of {{ filtered.length }}
                </div>
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
import data from '../../data/inventory.json'

export default {
    name: 'Inventory',
    data() {
        return {
            raw: data || [],
            query: '',
            page: 1,
            perPage: 25
        }
    },
    computed: {
        filtered() {
            const q = this.query && this.query.toLowerCase()
            if (!q) return this.raw
            return this.raw.filter(r => {
                return (
                    (r.itemName || '').toLowerCase().includes(q) ||
                    (r.brand || '').toLowerCase().includes(q) ||
                    (r.seller || '').toLowerCase().includes(q) ||
                    (r.sku || '').toLowerCase().includes(q)
                )
            })
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
    methods: {
        formatMoney(v) {
            if (v === null || v === undefined || v === '') return '-'
            if (typeof v !== 'number') return v
            return v.toFixed(2)
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
