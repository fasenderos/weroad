<template>
    <div class="bg-white py-24">
        <div class="mx-auto w-full max-w-7xl px-4">
            <div class="h-full">
                <div class="grid grid-cols-12 gap-6">
                    <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
                        <BaseCard>
                            <div class="border-slate-200 flex items-center justify-between gap-4 border-b px-8 py-5">
                                <div>
                                    <h3 class="text-sm font-medium">
                                        Payment method
                                    </h3>
                                    <p class="text-sm text-slate-400">Select a payment method</p>
                                </div>
                                <div class="ms-auto">
                                    <button class="border rounded-md bg-slate-50 hover:bg-slate-100 py-3 px-8"
                                        @click.prevent="props.setStep(1)">
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div role="button" class="flex cursor-pointer items-center px-8 py-5" :class="selectedMethod === 'paypal'
                                    ? 'bg-slate-50'
                                    : ''
                                    " @click="selectedMethod = 'paypal'">
                                    <div class="h-4 w-4 rounded-full border-2 border-white ring-2 transition-colors"
                                        :class="selectedMethod === 'paypal'
                                            ? 'bg-primary-400 ring-primary-400'
                                            : 'ring-slate-400'
                                            "></div>
                                    <label class="ms-4 text-sm font-medium">PayPal</label>
                                </div>
                                <div v-if="selectedMethod === 'paypal'"
                                    class="flex items-center justify-between gap-4 p-8 pt-4">
                                    <div class="max-w-xs">
                                        <h3 class="text-md font-weight mb-2">
                                            Pay with PayPal
                                        </h3>
                                        <p class="text-sm text-slate-400">
                                            Click on "Complete your order" to complete your purchase securely.
                                        </p>
                                    </div>
                                    <div class="grow">
                                        <BaseCard shape="curved" elevated
                                            class="mx-auto flex max-w-[280px] items-center justify-center px-8 py-16">
                                            <Icon name="logos:paypal" class="h-12 w-12" />
                                        </BaseCard>
                                    </div>
                                </div>
                            </div>
                            <div class="border-slate-200 border-t">
                                <div role="button" class="flex cursor-pointer items-center px-8 py-5" :class="selectedMethod === 'stripe'
                                    ? 'bg-slate-50'
                                    : ''
                                    " @click="selectedMethod = 'stripe'">
                                    <div class="h-4 w-4 rounded-full border-2 border-white ring-2 transition-colors"
                                        :class="selectedMethod === 'stripe'
                                            ? 'bg-primary-400 ring-primary-400'
                                            : 'ring-slate-400'
                                            "></div>
                                    <label class="ms-4 text-sm font-medium">Stripe</label>
                                </div>
                                <div v-if="selectedMethod === 'stripe'"
                                    class="flex items-center justify-between gap-4 p-8 pt-4">
                                    <div class="max-w-xs">
                                        <h3 class="text-md font-weight mb-2">
                                            Pay with Stripe
                                        </h3>
                                        <p class="text-sm text-slate-400">
                                            Click on "Complete your order" to complete your purchase securely.
                                        </p>
                                    </div>
                                    <div class="grow">
                                        <BaseCard shape="curved" elevated
                                            class="mx-auto flex max-w-[280px] items-center justify-center px-8 py-16">
                                            <Icon name="logos:stripe" class="h-12 w-12" />
                                        </BaseCard>
                                    </div>
                                </div>
                            </div>
                        </BaseCard>
                    </div>
                    <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
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
                                        <div class="flex items-center pt-5">
                                            <p class="text-slate-500 py-2 text-sm">
                                                Number of Travelers
                                            </p>
                                            <div class="ms-auto">
                                                <p class="text-sm text-slate-800">
                                                    <span class="font-semibold">{{ cart?.lockedSeats }}</span>
                                                </p>
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
                                <button type="submit"
                                    class="bg-purple-500 hover:bg-purple-400 transition-colors text-white font-medium rounded-md py-2 px-5">Complete
                                    your order</button>
                                <TravelCountdown :setStep="setStep" :travelId="travel.id" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useForm } from "vee-validate";
import * as y from "yup";
import { RESERVE_BOOKINGS } from "../../queries/travels";
import type { ReserveBookingResponse, Travel } from "../../types/travels";

const props = defineProps<{
	travel: Travel;
	setStep: (step: number) => void;
}>();

const app = useNuxtApp()
const { travel } = props;
const selectedMethod = ref("paypal");
const cart = getValidCart(travel.id);
if (!cart) {
	props.setStep(1);
}

const totalPrice = computed(
	() => (travel?.price ?? 0) * (cart?.lockedSeats ?? 0),
);
const schema = y.object({
	cartId: y.string().required(),
});

const validationSchema = toTypedSchema(schema);
const initialValues = computed(() => ({
	cartId: cart?.id,
}));

const { handleSubmit, resetForm } = useForm({
	validationSchema,
	// @ts-ignore
	initialValues,
});

const toast = app.$toast;

// This is where you would send the form data to the server
const onSubmit = handleSubmit(
	async (values) => {
		try {
			const { mutate: reserveBooking } =
				useMutation<ReserveBookingResponse>(RESERVE_BOOKINGS);
			const response = await reserveBooking({ input: values });
			const booking = response?.data?.reserveBooking ?? null;
			if (booking) {
				removeCart(booking.travelId);
				props.setStep(3);
			} else throw new Error("Something went wrong, please try again");
			// biome-ignore lint/suspicious/noExplicitAny: there are two rules that conflicts: 1) no any and 2) error must be of type any or unknown
		} catch (error: any) {
			toast.clear();
			toast.error(error?.message ?? "Something went wrong, please try again");
		}
		resetForm();
		document.documentElement.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	},
	(error) => {
		// you can use it to scroll to the first error
		document.documentElement.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	},
);
</script>