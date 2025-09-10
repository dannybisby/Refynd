<template>
    <div class="max-w-screen-xl mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">Messages</h1>
        
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Total Messages</div>
                <div class="text-2xl font-bold text-blue-600">{{ totalMessages }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Unread Messages</div>
                <div class="text-2xl font-bold text-red-600">{{ unreadMessages }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="text-sm text-gray-600">Active Conversations</div>
                <div class="text-2xl font-bold text-green-600">{{ activeConversations }}</div>
            </div>
        </div>

        <!-- Messages by Listing -->
        <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 pb-4 border-b border-gray-100">
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600">Search:</label>
                    <input v-model="query" type="text" placeholder="Message content, sender..."
                        class="border rounded px-2 py-1" />
                </div>

                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600">Filter:</label>
                        <select v-model="readFilter" class="border rounded px-2 py-1">
                            <option value="">All</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
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
                                <th class="px-3 py-2 border">Sender</th>
                                <th class="px-3 py-2 border">Message</th>
                                <th class="px-3 py-2 border">Date</th>
                                <th class="px-3 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(message, idx) in pagedData" :key="idx" 
                                :class="[
                                    'hover:bg-gray-50',
                                    !message.isRead && message.isFromBuyer ? 'bg-blue-50' : ''
                                ]">
                                <td class="px-3 py-2 border">
                                    <span :class="getStatusClass(message.isRead, message.isFromBuyer)">
                                        {{ message.isRead ? 'Read' : 'Unread' }}
                                    </span>
                                </td>
                                <td class="px-3 py-2 border">{{ getListingName(message.listingId) }}</td>
                                <td class="px-3 py-2 border">
                                    <span :class="message.isFromBuyer ? 'font-medium text-blue-600' : 'text-gray-600'">
                                        {{ message.senderName }}
                                    </span>
                                </td>
                                <td class="px-3 py-2 border max-w-xs">
                                    <div class="truncate" :title="message.message">
                                        {{ message.message }}
                                    </div>
                                </td>
                                <td class="px-3 py-2 border">{{ formatDate(message.timestamp) }}</td>
                                <td class="px-3 py-2 border">
                                    <div class="flex gap-1">
                                        <button @click="viewConversation(message)" 
                                            class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                            title="View Conversation">
                                            View
                                        </button>
                                        <button v-if="!message.isRead && message.isFromBuyer" @click="markAsRead(message)" 
                                            class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                            title="Mark as Read">
                                            Mark Read
                                        </button>
                                        <button @click="replyToMessage(message)" 
                                            class="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                                            title="Reply">
                                            Reply
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filtered.length === 0">
                                <td colspan="6" class="px-3 py-4 text-center text-gray-500">No messages found</td>
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
import messagesData from '../../data/messages.json'
import listingsData from '../../data/listings.json'

export default {
    name: 'SellMessages',
    data() {
        return {
            messages: messagesData || [],
            listings: listingsData || [],
            query: '',
            readFilter: '',
            page: 1,
            perPage: 25
        }
    },
    computed: {
        filtered() {
            let result = this.messages

            // Filter by search query
            const q = this.query && this.query.toLowerCase()
            if (q) {
                result = result.filter(message => {
                    return (
                        (message.message || '').toLowerCase().includes(q) ||
                        (message.senderName || '').toLowerCase().includes(q) ||
                        (this.getListingName(message.listingId) || '').toLowerCase().includes(q)
                    )
                })
            }

            // Filter by read status
            if (this.readFilter === 'unread') {
                result = result.filter(message => !message.isRead)
            } else if (this.readFilter === 'read') {
                result = result.filter(message => message.isRead)
            }

            // Sort by timestamp (newest first)
            return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
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
        totalMessages() {
            return this.messages.length
        },
        unreadMessages() {
            return this.messages.filter(m => !m.isRead && m.isFromBuyer).length
        },
        activeConversations() {
            const uniqueListings = new Set(this.messages.map(m => m.listingId))
            return uniqueListings.size
        }
    },
    methods: {
        getListingName(listingId) {
            const listing = this.listings.find(l => l.id === listingId)
            return listing ? listing.itemName : 'Unknown Listing'
        },
        formatDate(timestamp) {
            if (!timestamp) return '-'
            return new Date(timestamp).toLocaleDateString() + ' ' + 
                   new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        getStatusClass(isRead, isFromBuyer) {
            const baseClass = 'px-2 py-1 rounded-full text-xs font-medium '
            if (!isRead && isFromBuyer) {
                return baseClass + 'bg-red-100 text-red-800'
            } else if (isRead) {
                return baseClass + 'bg-green-100 text-green-800'
            } else {
                return baseClass + 'bg-gray-100 text-gray-800'
            }
        },
        viewConversation(message) {
            this.$router.push(`/sell/listing/${message.listingId}/messages`)
        },
        markAsRead(message) {
            // In a real app, this would make an API call
            message.isRead = true
        },
        replyToMessage(message) {
            this.$router.push(`/sell/listing/${message.listingId}/messages?reply=${message.id}`)
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