import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";

import "primevue/resources/themes/lara-light-purple/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import ToastService from 'primevue/toastservice';


const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.mount("#app");
