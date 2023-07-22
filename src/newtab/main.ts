// Vue select
import 'vue-select/dist/vue-select.css'
import vSelect from 'vue-select'

import { createApp } from 'vue'
import App from './NewTab.vue'
import { setupApp } from '~/logic/common-setup'
import '../styles'

const app = createApp(App)
setupApp(app)
app.component('VueSelect', vSelect)
app.mount('#app')
