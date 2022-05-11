import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";

import "primevue/resources/themes/lara-light-purple/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
const app = createApp(App);
app.use(PrimeVue);
app.mount("#app");
