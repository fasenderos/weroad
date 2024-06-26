<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import type { ApexOptions } from "apexcharts";
import { useLazyApexCharts } from "../../composables/apexcharts";

const props = defineProps<{
	type: string;
	height: number;
	width?: number;
	// biome-ignore lint/suspicious/noExplicitAny:
	series: any[];
	options?: ApexOptions;
}>();
const { LazyApexCharts, isLoaded } = useLazyApexCharts();
const target = ref(null);
const targetIsVisible = ref(false);

// When the target is visible on viewport, load the chart
const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
	if (isIntersecting) {
		targetIsVisible.value = isIntersecting;
		stop();
	}
});
</script>

<template>
    <div ref="target">
        <ClientOnly>
            <LazyApexCharts v-if="targetIsVisible" v-show="isLoaded" v-bind="props" />
        </ClientOnly>
    </div>
</template>