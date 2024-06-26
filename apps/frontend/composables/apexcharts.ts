const useApexChartLoaded = () => useState("apex-loaded", () => false);

const LazyApexCharts = defineAsyncComponent({
	suspensible: false,
	loader: () =>
		import("vue3-apexcharts").then((module) => {
			nextTick(() => {
				useApexChartLoaded().value = true;
			});
			return module.default;
		}),
});

export function useLazyApexCharts() {
	const isLoaded = useApexChartLoaded();

	return {
		LazyApexCharts,
		isLoaded,
	};
}
