<template>
    <div class="flex items-center justify-center bg-white py-24">
        <div class="mx-auto w-full max-w-2xl">
            <BaseCard>
                <div class="divide-slate-200 grid">
                    <div class="flex flex-col p-10">
                        <Icon name="uit:exclamation-circle" class="h-14 w-14 mx-auto text-red-400" />
                        <div class="mx-auto mb-4 max-w-xs text-center">
                            <h2 class="mt-4 text-md font-weight">
                                We are sorry but the time to complete your reservation is out!
                            </h2>
                            <p class="mt-2 text-sm font-weight">Available spot are not unlimited :)</p>
                        </div>
                        <button type="button" @click="goToHome"
                            class="my-6 mx-10 bg-purple-500 hover:bg-purple-400 disabled:bg-purple-200 transition-colors text-white font-medium rounded-md py-2 px-5">Go
                            back to Home</button>
                    </div>
                </div>
            </BaseCard>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
	setStep: (step: number) => void;
}>();

const router = useRouter();

const goToHome = () => {
	props.setStep(1);
	router.push("/");
};
</script>