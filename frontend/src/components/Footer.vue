<template>
    <footer class="bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700">
        <div class="max-w-screen-xl mx-auto p-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <span>© {{ year }} Refynd - All rights reserved</span>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return { year: new Date().getFullYear() }
    }
}
</script>
