<template>
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <MainMenu />
    </nav>
</template>

<script>
import MainMenu from './Menus/MainMenu.vue'

export default {
    name: 'Header',
    components: { MainMenu }
}
</script>
