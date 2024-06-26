<template>
    <div class="bg-white py-24">
        <div class="mx-auto w-full max-w-7xl px-4">
            <div class="h-full">
                <div class="grid grid-cols-12 gap-6">
                    <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
                        <BaseCard class="space-y-12 p-10">
                            <div
                                class="border-slate-200 flex flex-col items-center justify-between gap-8 border-b pb-12 sm:flex-row">
                                <div class="flex flex-col grow">
                                    <h2 class="text-2xl font-medium">
                                        {{ travel?.name }}
                                    </h2>
                                    <p class="text-sm text-slate-400 py-4">
                                        {{ travel?.description }}
                                    </p>
                                    <div class="flex w-full justify-between gap-4 pb-9">
                                        <div class="flex gap-3 items-center">
                                            <span class="text-slate-800 block font-sans text-3xl font-semibold">
                                                ${{ travel?.price }}
                                            </span>
                                            <div>
                                                <span
                                                    class="text-slate-400 block font-sans text-[0.65rem] font-medium uppercase leading-snug">
                                                    Rate for </span><span
                                                    class="text-slate-500 block font-sans text-sm leading-none">
                                                    1 Adult
                                                </span>
                                            </div>
                                        </div>
                                        <div class="flex gap-3 items-center">
                                            <span class="text-slate-800 block font-sans text-3xl font-semibold">
                                                <Icon name="carbon:passenger-plus" class="h-5 w-5 text-red-500" />
                                                {{ availableSeats }}
                                            </span>
                                            <div>
                                                <span
                                                    class="text-slate-400 block font-sans text-[0.65rem] font-medium uppercase leading-snug">
                                                    Availability </span><span
                                                    class="text-slate-500 block font-sans text-sm leading-none">
                                                    Seats </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex w-full justify-between gap-4 pb-3">
                                        <div class="text-slate-400 flex items-center gap-1">
                                            <Icon name="carbon:departure" class="h-5 w-5 text-red-500" />
                                            <span class="font-sans text-sm">
                                                Departure {{ journey.start }}
                                            </span>
                                        </div>
                                        <div class="text-slate-400 flex items-center gap-1">
                                            <Icon name="carbon:sun" class="h-5 w-5 text-red-500 ml-3" />
                                            <span class="font-sans text-sm">
                                                {{ journey.days }} days
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex w-full justify-between gap-4 pb-4">
                                        <div class="text-slate-400 flex items-center gap-1">
                                            <Icon name="carbon:arrival" class="h-5 w-5 text-red-500" />
                                            <span class="font-sans text-sm">
                                                Arrival {{ journey.end }}
                                            </span>
                                        </div>
                                        <div class="text-slate-400 flex items-center gap-1">
                                            <Icon name="carbon:moon" class="h-5 w-5 text-red-500 ml-3" />
                                            <span class="font-sans text-sm">
                                                {{ journey.days - 1 }} nights
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full shrink-0 sm:w-72">
                                    <img :src="`https://picsum.photos/400/300.webp?random=${travel?.id}`"
                                        :alt="travel?.name" class="rounded-lg" />
                                </div>
                            </div>
                            <div class="border-slate-200 grid gap-4 grid-cols-3 md:grid-cols-5">
                                <div v-if="travel?.moods" v-for="(value, mood) in travel.moods" :key="mood">
                                    <Mood :value="value" :mood="mood" />
                                </div>
                            </div>
                        </BaseCard>
                    </div>
                    <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
                        <TravelForm v-if="!loading" :travel="travel" :journey="journey" :availableSeats="availableSeats"
                            :setStep="setStep" :checkAvailability="checkAvailability" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { differenceInDays, format } from "date-fns";
import { TRAVEL_AVAILABILITY } from "../../queries/travels";
import type {
	Cart,
	Travel,
	TravelAvailabilityResponse,
} from "../../types/travels";

const props = defineProps<{
	travel: Travel;
	setStep: (step: number) => void;
	cart?: Cart;
}>();
const travel = props.travel;
const { result, refetch, loading } = useQuery<TravelAvailabilityResponse>(
	TRAVEL_AVAILABILITY,
	{ id: travel.id },
);

const availableSeats = ref(0);

watch(
	() => result.value?.availability,
	(newValue, oldValue) => {
		if (typeof newValue === "number") {
            const cart = getValidCart(travel.id)
			const available = (newValue ?? 0) + (cart?.lockedSeats ?? 0);
			if (available !== oldValue) {
				availableSeats.value = available ?? 0;
			}
		}
	},
	{ immediate: true }, // Update immediately on first render
);

const journey = computed<{ start: string; end: string; days: number }>(() => {
	if (travel?.startingDate && travel?.endingDate) {
		const resp = {
			start: format(travel.startingDate, "dd MMM"),
			end: format(travel.endingDate, "dd MMM"),
			days: differenceInDays(travel.endingDate, travel.startingDate),
		};
		return resp;
	}
	return { start: "", end: "", days: 0 };
});

const checkAvailability = () => {
	refetch();
};
</script>