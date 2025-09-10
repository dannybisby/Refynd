<template>
        <Header />
        <main class="min-h-screen">
            <router-view />
        </main>
        <Footer />
</template>
<script>
import Header from './Header.vue'
import Footer from './Footer.vue'

export default {
    name: 'Refynd',
    components: { Header, Footer }
}
</script>