<script setup lang="ts">
import { useVModel } from "@vueuse/core";

defineOptions({
	inheritAttrs: false,
});

const props = withDefaults(
	defineProps<{
		/**
		 * The model value of the input.
		 *
		 * @modifiers
		 * `v-model="value"`
		 *
		 * @modifiers
		 * `v-model.number="value"`
		 *
		 * @modifiers
		 * `v-model.trim="value"`
		 */
		modelValue?: string | number;
		/**
		 * Used internaly to allow v-model.number and v-model.trim
		 */
		// biome-ignore lint/suspicious/noExplicitAny:
		modelModifiers?: any;
		/**
		 * The form input identifier.
		 */
		id?: string;
		/**
		 * The type of input.
		 */
		type?: string;
		/**
		 * The minimum value for number inputs
		 */
		minNumber?: number;
		/**
		 * The maximum value for number inputs
		 */
		maxNumber?: number;
		/**
		 * The label to display for the input.
		 */
		label?: string;
		/**
		 * The placeholder to display for the input.
		 */
		placeholder?: string;
		/**
		 * Whether the input is in a loading state.
		 */
		loading?: boolean;
		/**
		 * An error message or boolean value indicating whether the input is in an error state.
		 */
		error?: string | boolean;
	}>(),
	{
		id: undefined,
		modelValue: undefined,
		modelModifiers: () => ({}),
		type: "text",
		minNumber: 0,
		maxNumber: Number.POSITIVE_INFINITY,
		label: undefined,
		error: false,
		placeholder: undefined,
	},
);
const emits =
	defineEmits<(event: "update:modelValue", value?: string | number) => void>();

// biome-ignore lint/suspicious/noExplicitAny:
function looseToNumber(val: any) {
	const n = Number.parseFloat(val);
	return Number.isNaN(n) ? val : n;
}

const value = useVModel(
	props,
	"modelValue",
	(_, val) => {
		if (props.modelModifiers.number) {
			emits("update:modelValue", looseToNumber(val));
		} else if (props.modelModifiers.trim) {
			emits("update:modelValue", typeof val === "string" ? val.trim() : val);
		} else {
			emits("update:modelValue", val);
		}
	},
	{
		passive: true,
	},
);

// The following are used for number type inputs
const incrementValue = () => {
	if (
		typeof props.modelValue === "number" &&
		props.modelValue < props.maxNumber
	) {
		emits("update:modelValue", props.modelValue + 1);
	}
};
const decrementValue = () => {
	if (
		typeof props.modelValue === "number" &&
		props.modelValue > props.minNumber
	) {
		emits("update:modelValue", props.modelValue - 1);
	}
};

const inputRef = ref<HTMLInputElement>();
defineExpose({
	/**
	 * The underlying HTMLInputElement element.
	 */
	el: inputRef,
});

const id = computed(() => props.id);
const placeholder = computed(() => {
	if (props.loading) {
		return;
	}
	return props.placeholder;
});
</script>

<template>
	<div class="w-full">
		<label v-if="'label' in $slots || props.label" class="nui-input-label" :for="id">
			<slot name="label">{{ props.label }}</slot>
		</label>
		<div class="relative">
			<input :id="id" ref="inputRef" v-model="value" :type="props.type" v-bind="$attrs"
				class="w-full border rounded-md border-slate-200 focus:outline-dashed focus:outline-slate-300 transition-all duration-75 focus:outline-offset-3 p-2 disabled:bg-slate-200 disabled:text-gray-500"
				:class="props.error ? 'border-red-500' : ''" :placeholder="placeholder" />
			<div v-if="props.type === 'number'" class="flex end-0 absolute top-1 right-1">
				<button type="button"
					class="flex justify-center items-center hover:bg-slate-100 transition-colors border rounded-l-md border-slate-200 h-8 w-8"
					@click="decrementValue">
					<Icon name="carbon:subtract" />
				</button>
				<button type="button"
					class="flex justify-center items-center hover:bg-slate-100 transition-colors border rounded-r-md border-slate-200 h-8 w-8"
					@click="incrementValue">
					<Icon name="carbon:add" />
				</button>
			</div>
		</div>
		<span v-if="props.error && typeof props.error === 'string'" class="text-red-500 text-xs">
			{{ props.error }}
		</span>
	</div>
</template>
<style>
.focus\:outline-dashed:focus {
	outline: 2px dashed #cbd5e1;
	outline-offset: 2px;
}

[type="number"]::-webkit-outer-spin-button,
[type="number"]::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
</style>