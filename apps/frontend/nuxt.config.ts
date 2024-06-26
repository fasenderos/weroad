// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: [
		"@nuxtjs/apollo",
		"@nuxtjs/tailwindcss",
		"@nuxtjs/color-mode",
		"@nuxt/icon",
		"@element-plus/nuxt",
		"@nuxt/image",
	],
	plugins: [{ src: "~/plugins/vue-toastification.ts", mode: "client" }],
	apollo: {
		clients: {
			default: {
				httpEndpoint: "http://127.0.0.1:3001/graphql",
				inMemoryCacheOptions: {
					addTypename: false,
				},
				defaultOptions: {
					watchQuery: {
						fetchPolicy: "no-cache",
					},
					query: {
						fetchPolicy: "no-cache",
					},
				},
			},
		},
	},
	css: ["@fontsource-variable/inter/index.css"],
});
