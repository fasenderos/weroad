<template>
    <BaseCard v-if="countdown?.minutes || countdown?.seconds"
        class="flex items-center justify-between gap-2 p-3 bg-blue-50">
        <div class="test-info-500 flex items-center">
            <Icon name="uit:clock" class="h-5 w-5" />
        </div>
        <div>
            <h2 class="text-sm text-slate-800">
                Completa la prenotazione entro
            </h2>
            <p class="text-xs font-weight text-slate-800 leading-tight">
                <span>
                    {{ (countdown.minutes ?? '00').toString()?.padStart(2, '0') }} :
                    {{ (countdown.seconds ?? '00').toString()?.padStart(2, '0') }}
                </span>
            </p>
        </div>
        <div>
            <button type="button" @click="resetCart"
                class="py-1 px-2 border rounded-md border-blue-300 text-sm font-weight hover:bg-blue-200 transition-colors">Resetta
                Timer</button>
        </div>
    </BaseCard>

</template>
<script setup lang="ts">
import { RESET_CART } from "../../queries/travels";
import type { ResetCartResponse } from "../../types/travels";
const props = defineProps<{
	travelId: string;
	setStep: (step: number) => void;
}>();

const { mutate } = useMutation<ResetCartResponse>(RESET_CART);
const cart = getValidCart(props.travelId);

const onTimerExpire = () => {
	if (cart) {
		removeCart(props.travelId);
		props.setStep(4);
	}
};

const { countdown, resetCountdown } = useCountdown(
	cart?.expiresAt ?? new Date(),
	onTimerExpire,
);

const resetCart = async () => {
	if (cart) {
		const response = await mutate({
			input: {
				id: cart.id,
			},
		});
		if (response?.data?.resetCart) {
			saveCart(response.data.resetCart);
			resetCountdown(response.data.resetCart.expiresAt);
		}
	}
};
</script>