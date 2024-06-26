<template>
    <div class="bg-white py-24">
        <div class="mx-auto w-full max-w-7xl px-4">
            <div class="mb-10 max-w-2xl">
                <h2 class="text-4xl font-light leading-tight text-slate-800 mx-auto mb-4">
                    {{ travels.length }}+ Amazing Trips
                </h2>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <template v-for="travel in travels.slice(0, 10)" :key="travel.id">
                    <TravelCard :travel="travel" />
                </template>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { GET_TRAVELS } from "../queries/travels";
import type { GetTravelsData } from "../types/travels";

const { result } = useQuery<GetTravelsData>(GET_TRAVELS);
const travels = computed(() => result.value?.travels ?? []);
</script>