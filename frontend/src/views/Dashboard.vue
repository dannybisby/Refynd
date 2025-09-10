<template>
  <div>

    <!-- Secondary Navigation is handled by MainMenu via the store -->

    <!-- Main content -->
    <div class="max-w-screen-xl mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 class="text-xl font-semibold mb-2">Total Sales</h2>
          <p class="text-2xl font-bold text-green-600">$12,345</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 class="text-xl font-semibold mb-2">Total Orders</h2>
          <p class="text-2xl font-bold text-blue-600">1,234</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 class="text-xl font-semibold mb-2">Inventory Items</h2>
          <p class="text-2xl font-bold text-purple-600">567</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 class="text-xl font-semibold mb-2">Revenue</h2>
          <p class="text-2xl font-bold text-orange-600">$45,678</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul class="space-y-2">
          <li class="flex justify-between">
            <span>Order #1234 placed</span>
            <span class="text-gray-500">2 hours ago</span>
          </li>
          <li class="flex justify-between">
            <span>Product added to inventory</span>
            <span class="text-gray-500">4 hours ago</span>
          </li>
          <li class="flex justify-between">
            <span>Sale completed</span>
            <span class="text-gray-500">1 day ago</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Chat UI that matches the parent content width (inline) -->
    <div class="flex items-start justify-center mt-0 max-w-screen-xl mx-auto p-4">
      <div class="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="md:flex">
          <!-- Left panel: intro & examples -->
          <div class="md:w-[32%] lg:w-[28%] p-6 bg-gray-50 max-w-[420px] border-r border-gray-100">
            <h2 class="text-2xl font-bold mb-2">Ask the Assistant</h2>
            <p class="text-sm text-gray-600 mb-4">Start a conversation about inventory, orders, sales, or get help with
              tasks.</p>

            <div class="space-y-3">
              <button @click="useExample('Show low stock items')"
                class="w-full text-left px-3 py-2 bg-white border rounded hover:bg-gray-100">Show low stock
                items</button>
              <button @click="useExample('Summarize sales for last month')"
                class="w-full text-left px-3 py-2 bg-white border rounded hover:bg-gray-100">Summarize sales for last
                month</button>
              <button @click="useExample('Export orders from last 7 days')"
                class="w-full text-left px-3 py-2 bg-white border rounded hover:bg-gray-100">Export orders from last 7
                days</button>
            </div>

            <div class="mt-6 text-xs text-gray-500">This is a local mock assistant. Connect a real LLM later for
              production responses.</div>
          </div>

          <!-- Right panel: chat area -->
          <div class="md:flex-1 p-4 flex flex-col min-w-0">
            <div class="flex items-center justify-between px-3 pb-2">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center">🤖</div>
                <div>
                  <div class="font-semibold">Assistant</div>
                  <div class="text-xs text-gray-500">How can I help you today?</div>
                </div>
              </div>
              <div class="text-sm text-gray-500">
                <button @click="clearConversation" class="underline">New chat</button>
              </div>
            </div>

            <div ref="messagesContainer" class="flex-1 px-3 pb-3 overflow-y-auto bg-white">
              <div class="space-y-4 max-h-[46vh] overflow-y-auto pr-2">
                <div v-for="(m, idx) in messages" :key="idx" class="flex"
                  :class="m.role === 'assistant' ? '' : 'justify-end'">
                  <div v-if="m.role === 'assistant'"
                    class="max-w-[80%] bg-gray-100 p-3 rounded-lg text-sm border border-gray-100">
                    <div class="whitespace-pre-wrap text-gray-800">{{ m.text }}</div>
                  </div>
                  <div v-else class="max-w-[80%] bg-indigo-600 text-white p-3 rounded-lg text-sm">
                    <div class="whitespace-pre-wrap">{{ m.text }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-3 pt-2 pb-4 bg-white border-t">
              <form @submit.prevent="sendMessage" class="flex items-end space-x-2">
                <textarea v-model="input" :disabled="loading" rows="2" placeholder="Ask me anything..."
                  class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring"></textarea>
                <button type="submit" :disabled="!input.trim() || loading"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-60">
                  <span v-if="!loading">Send</span>
                  <span v-else>...</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      open: false,
      input: '',
      loading: false,
      messages: [
        { role: 'assistant', text: 'How can I help you today? You can ask about inventory, orders, or general help.' }
      ]
    }
  },
  methods: {
    useExample(text) {
      // populate input and send immediately
      this.input = text
      this.$nextTick(() => this.sendMessage())
    },
    sendMessage() {
      const text = this.input.trim()
      if (!text) return
      this.messages.push({ role: 'user', text })
      this.input = ''
      this.scrollToBottom()
      this.loading = true

      // Simulated assistant response — replace with real API calls later
      setTimeout(() => {
        this.receiveResponse(this.generateMockResponse(text))
      }, 800 + Math.random() * 700)
    },

    receiveResponse(text) {
      this.messages.push({ role: 'assistant', text })
      this.loading = false
      this.$nextTick(this.scrollToBottom)
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.messagesContainer
        if (el) el.scrollTop = el.scrollHeight
      })
    },
    clearConversation() {
      this.messages = [{ role: 'assistant', text: 'How can I help you today? You can ask about inventory, orders, or general help.' }]
      this.input = ''
      this.$nextTick(this.scrollToBottom)
    },
    generateMockResponse(userText) {
      // Minimal heuristics to make responses feel helpful without calling an API
      const t = userText.toLowerCase()
      if (t.includes('inventory') || t.includes('stock')) {
        return "You have 567 items in inventory. Would you like a breakdown by category or low-stock alerts?"
      }
      if (t.includes('orders') || t.includes('order')) {
        return "There are 1,234 orders total; 34 are pending. I can show recent orders or export a report."
      }
      if (t.includes('sales') || t.includes('revenue')) {
        return "Total sales are $12,345 and revenue $45,678 this period. Want a chart or date range?"
      }
      return "I can help with inventory, orders, sales reports, and simple tips — could you clarify what you'd like to do?"
    }
  }
}
</script>
