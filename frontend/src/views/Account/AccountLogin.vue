<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h2 class="text-3xl font-bold text-center text-gray-800">Refynd</h2>
            <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label for="email" class="block text-gray-700 mb-2">Email Address</label>
                    <input id="email" v-model="email" type="email" required
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="you@example.com" />
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-gray-700 mb-2">Password</label>
                    <input id="password" v-model="password" type="password" required
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••" />
                </div>
                <button type="submit"
                    class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold">
                    Log In
                </button>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    name: "AccountLogin",
    data() {
        return {
            email: "",
            password: ""
        };
    },
    methods: {
        handleLogin() {
            // Placeholder for login logic
            alert(`Email: ${this.email}\nPassword: ${this.password}`);
        }
    }
};
</script>