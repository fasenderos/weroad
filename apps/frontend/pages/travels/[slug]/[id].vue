<template>
	<div v-if="travel">
		<div v-if="step === 2">
			<TravelCheckout :travel="travel" :setStep="setStep" />
		</div>
		<div v-else-if="step === 3">
			<TravelConfirm :setStep="setStep" />
		</div>
		<div v-else-if="step === 4">
			<TravelExpiredCart :setStep="setStep" />
		</div>
		<div v-else>
			<TravelDetails :travel="travel" :cart="cart" :setStep="setStep" />
		</div>
	</div>
</template>

<script lang="ts">
import { myUseState } from "../../../composables/states";
import { GET_TRAVEL_BY_ID } from "../../../queries/travels";
import type { Cart, GetTravelByIdData } from "../../../types/travels";

export default {
	setup() {
		const route = useRoute();
		const id = ref(route.params.id);
		const [step, setStep] = myUseState(1);
		const [cart, setCart] = myUseState<Cart>(
			getValidCart(id.value as string) ?? undefined,
		);
		const { result } = useQuery<GetTravelByIdData>(GET_TRAVEL_BY_ID, {
			id: id.value,
		});
		const travel = computed(() => result.value?.travel ?? null);

		return {
			travel,
			step,
			cart: cart?.value,
			setStep,
			setCart,
		};
	},
};
</script>