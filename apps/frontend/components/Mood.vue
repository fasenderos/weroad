<script setup lang="ts">
import type { ApexOptions } from "apexcharts";
import type { Moods } from "../types/travels";
import { tailwindToRgb } from "../utils/tailwind";

const props = defineProps<{
	mood: keyof Moods;
	value: number;
	height?: number;
	colors?: string | string[];
}>();

const moods: Record<keyof Moods, { label: string; color: string }> = {
	nature: { label: "Nature and Adventure", color: "lime-400" },
	relax: { label: "Relax", color: "blue-400" },
	history: { label: "Monuments and History", color: "amber-400" },
	culture: { label: "City and Cultures", color: "orange-400" },
	party: { label: "Party and Nightlife", color: "violet-400" },
};
const colors = computed(() =>
	Array.isArray(props.colors)
		? props.colors
		: props.colors
			? [props.colors]
			: [moods[props.mood].color],
);
const height = computed(() => props.height ?? 100);
const options: ApexOptions = {
	chart: {
		height: 100,
		type: "radialBar",
		offsetY: -10,
		toolbar: {
			show: false,
		},
	},
	colors: colors.value.map((className) => tailwindToRgb(className)),
	plotOptions: {
		radialBar: {
			hollow: {
				size: "35%",
			},
			dataLabels: {
				show: false,
			},
		},
	},
	labels: [""],
};
const series = ref([props.value]);
</script>
<template>
    <div class="flex flex-1 flex-col gap-2 text-center">
        <BaseChart type="radialBar" :height="height" :options="options" :series="series"></BaseChart>
        <div class="-mt-6">
            <h5 class="text-md font-semibold leading-tight text-slate-800">
                <span>{{ props.value }}</span>
            </h5>
            <p>
                <span class="text-xs text-slate-400">{{ moods[props.mood].label }}</span>
            </p>
        </div>
    </div>
</template>