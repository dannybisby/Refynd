<template>
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- Logo + main links -->
        <div class="flex items-center space-x-8">
            <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Refynd</span>
            </a>
            <ul class="hidden md:flex space-x-8 font-medium">
                <li v-for="item in menuItems" :key="item.to">
                    <router-link :to="item.to"
                        class="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500">{{ item.label
                        }}</router-link>
                </li>
            </ul>
        </div>

        <!-- User dropdown + mobile toggle -->
        <div class="flex items-center space-x-3 md:ml-6">
            <button type="button"
                class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom">
                <span class="sr-only">Open user menu</span>
                <img class="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                    alt="user photo">
            </button>
            <!-- Dropdown menu -->
            <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                id="user-dropdown">
                <div class="px-4 py-3">
                    <span class="block text-sm text-gray-900 dark:text-white">Danny Bisby</span>
                    <span class="block text-sm text-gray-500 truncate dark:text-gray-400">danny@example.com</span>
                </div>
                <ul class="py-2" aria-labelledby="user-menu-button">
                    <li>
                        <a href="#"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</a>
                    </li>
                    <li>
                        <a href="#"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
                    </li>
                    <li>
                        <a href="#"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</a>
                    </li>
                    <li>
                        <router-link to="/login"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign
                            out</router-link>
                    </li>
                </ul>
            </div>
            <button data-collapse-toggle="navbar-user" type="button"
                class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-user" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M1 1h15M1 7h15M1 13h15" />
                </svg>
            </button>
        </div>

        <!-- Mobile menu -->
        <div class="items-center justify-between hidden w-full md:hidden" id="navbar-user">
            <ul
                class="flex flex-col font-medium p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <li v-for="item in menuItems" :key="item.to">
                    <router-link :to="item.to" class="block py-2 px-3 rounded md:bg-transparent md:p-0">{{ item.label
                    }}</router-link>
                </li>
            </ul>
        </div>

    </div>
    <div class="w-full">
        <InventorySubMenu v-if="activeSub === 'inventory'" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InventorySubMenu from './InventorySubMenu.vue'

export default {
    name: 'MainMenu',
    components: { InventorySubMenu },
    data() {
        return {
            menuItems: [
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Buy', to: '/buy' },
                { label: 'Sell', to: '/sell' },
                { label: 'Inventory', to: '/inventory' },
                { label: 'Shipping', to: '/shipping' },
                { label: 'Analytics', to: '/analytics' }
            ]
        }
    },
    computed: {
        ...mapGetters('menus', ['activeSub']),
    }
}
</script>
