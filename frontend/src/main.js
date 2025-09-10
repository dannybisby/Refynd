import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import 'flowbite'
import { registerUIComponents } from './components/ui'

const app = createApp(App)
app.use(router)
app.use(store)
registerUIComponents(app)
app.mount('#app')
