<template>
    <div class="bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="max-w-screen-xl mx-auto px-4">
            <ul class="flex space-x-8 py-3">
                <li v-for="item in submenuItems" :key="item.to">
                    <router-link :to="item.to"
                        class="text-gray-700 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-500">{{
                        item.label }}</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SellSubMenu',
    data() {
        return {
            submenuItems: [
                { label: 'Listings', to: '/sell' },
                { label: 'Messages', to: '/sell/messages' },
                { label: 'Offers', to: '/sell/offers' },
                { label: 'Performance', to: '/sell/performance' }
            ]
        }
    }
}
</script>