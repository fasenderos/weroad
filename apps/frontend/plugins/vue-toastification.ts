import * as vt from "vue-toastification";
import { defineNuxtPlugin } from "#app";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(vt.default);
	return {
		provide: {
			toast: vt.useToast(),
		},
	};
});
