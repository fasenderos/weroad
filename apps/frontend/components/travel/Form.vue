<template>
    <form method="POST" action="" @submit.prevent="onSubmit" novalidate>
        <div class="flex flex-col gap-6">
            <BaseCard class="pb-6">
                <div class="border-slate-200 border-b px-8 py-5">
                    <h3 class="text-sm font-medium">
                        Order Summary
                    </h3>
                    <p class="text-xs text-slate-400">Check your order details</p>
                </div>
                <div class="px-8 pt-5">
                    <div class="flex items-center">
                        <h3 class="text-sm font-medium leading-none">
                            {{ travel?.name }}
                        </h3>
                        <div class="ms-auto">
                            <p class="text-sm text-slate-800">
                                <span class="font-semibold">${{ travel?.price }}/pp</span>
                            </p>
                        </div>
                    </div>
                    <p class="text-slate-500 py-2 text-xs">From
                        {{ journey.start }} To
                        {{ journey.end }}
                    </p>
                    <h3 class="text-sm font-medium leading-none py-4">
                        Who are you booking for?
                    </h3>
                    <div class="mb-6">
                        <label class="pb-3 text-sm">Number of Travelers <span class="text-red-500">*</span></label>
                        <div class="flex items-center gap-6">
                            <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="seats">
                                <BaseInput :model-value="field.value" :error="errorMessage"
                                    :disabled="isSubmitting || availableSeats <= 0" type="number"
                                    :maxNumber="availableSeats" :minNumber="0" :classes="{
                                        input: 'h-12',
                                    }" @update:model-value="handleChange" @blur="handleBlur" />
                            </Field>
                        </div>
                    </div>
                    <div class="mb-6">
                        <label class="pb-3 text-sm">Enter your email address <span class="text-red-500">*</span></label>
                        <div class="flex items-center gap-6">
                            <Field v-slot="{ field, errorMessage, handleChange, handleBlur }" name="email">
                                <BaseInput :model-value="field.value" :error="errorMessage"
                                    :disabled="isSubmitting || availableSeats <= 0" type="email"
                                    placeholder="john.doe@email.com" :classes="{
                                        input: 'h-12',
                                    }" @update:model-value="handleChange" @blur="handleBlur" />
                            </Field>
                        </div>
                    </div>
                </div>
                <div class="border-slate-200 mt-4 border-t px-8 pt-5">
                    <div class="flex items-end justify-between">
                        <h3 class="text-sm font-medium leading-none">
                            Total
                        </h3>
                        <p class="text-sm text-slate-800">
                            <span class="font-semibold">${{ totalPrice }}</span>
                        </p>
                    </div>
                </div>
            </BaseCard>
            <button type="submit" :disabled="isSubmitting || availableSeats <= 0"
                class="bg-purple-500 hover:bg-purple-400 disabled:bg-purple-200 transition-colors text-white font-medium rounded-md py-2 px-5">Book
                your trip now</button>
            <TravelCountdown :setStep="setStep" :travelId="travel.id" />
        </div>
    </form>
</template>
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { Field, useForm } from "vee-validate";
import * as y from "yup";
import { INIT_CART } from "../../queries/travels";
import type { InitCartResponse, Travel } from "../../types/travels";

const props = defineProps<{
	availableSeats: number;
	journey: { start: string; end: string; days: number };
	travel: Travel;
	setStep: (step: number) => void;
	checkAvailability: () => void;
}>();

const app = useNuxtApp();
const VALIDATION_TEXT = {
	EMAIL_VALID: "Please enter a valid email address",
	EMAIL_REQUIRED: "Pleae enter your email address",
	SEAT_REQUIRED: "Pick at least one seat",
	MAX_SEATS_REACHED: `Maximum number of ${props.availableSeats} seats reached`,
};

const cart = getValidCart(props.travel.id);

const schema = y.object({
	email: y
		.string()
		.email(VALIDATION_TEXT.EMAIL_VALID)
		.required(VALIDATION_TEXT.EMAIL_REQUIRED),
	seats: y
		.number()
		.min(1, VALIDATION_TEXT.SEAT_REQUIRED)
		.max(props.availableSeats, VALIDATION_TEXT.MAX_SEATS_REACHED)
		.required(VALIDATION_TEXT.SEAT_REQUIRED),
});

const validationSchema = toTypedSchema(schema);
const initialValues = computed(() => ({
	email: cart?.email ?? "",
	seats: cart?.lockedSeats ?? 0,
}));

const { handleSubmit, isSubmitting, values, resetForm } = useForm({
	validationSchema,
	// @ts-ignore
	initialValues,
});

const toast = app.$toast;
const totalPrice = computed(
	() => (props.travel?.price ?? 0) * (values?.seats ?? 0),
);
const availableSeats = computed(() => props.availableSeats);
const journey = computed(() => props.journey);
const travel = computed(() => props.travel);

// This is where you would send the form data to the server
const onSubmit = handleSubmit(
	async (values) => {
		try {
			const { mutate: initCart } = useMutation<InitCartResponse>(INIT_CART);
			const response = await initCart({
				input: {
					...values,
					travelId: props.travel.id,
				},
			});
			const cart = response?.data?.initCart ?? null;
			if (cart) {
				// Save cart and go to the next step
				saveCart(cart);
				props.setStep(2);
			} else throw new Error("Something goes wrong");
			// biome-ignore lint/suspicious/noExplicitAny: there are two rules that conflicts: 1) no any and 2) error must be of type any or unknown
		} catch (error: any) {
			toast.clear();
			toast.error(error.message);
			// In case of error check travel availability
			props.checkAvailability();
		}
		resetForm();
		document.documentElement.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	},
	() => {
		document.documentElement.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	},
);
</script>
