<script setup lang="ts">
import type { Travel } from "../types/travels";
const props = defineProps<{ travel: Travel }>();
</script>

<template>
    <NuxtLink :to="`/travels/${props.travel.slug}/${props.travel.id}`" class="group relative block">
        <div>
            <NuxtImg
                class="border-gray-200 block rounded-lg border motion-safe:transition-opacity motion-safe:duration-200 motion-safe:group-hover:opacity-75"
                :src="`https://picsum.photos/400/300.webp?random=${travel.id}`" :alt="`${props.travel?.name}`"
                height="271" width="487" sizes="sm:100vw md:50vw lg:974px" format="webp" loading="lazy"
                decoding="async" />
            <div class="absolute inset-x-0 -bottom-2 mx-auto max-w-[85%]">
                <BaseCard class="flex items-center p-4 rounded-xl" elevated>
                    <div class="flex-1">
                        <h3 class="text-sm font-medium leading-none text-slate-800 mx-auto">
                            {{ props.travel?.name }}</h3>
                    </div>
                    <div
                        class="bg-primary-500/10 text-primary-500 me-2 ms-auto flex h-8 w-8 items-center justify-center rounded-full motion-safe:opacity-0 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:group-hover:opacity-100">
                        <Icon name="lucide:arrow-right"
                            class="h-4 w-4 motion-safe:-translate-x-2 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-0 motion-reduce:translate-x-0" />
                    </div>
                </BaseCard>
            </div>
        </div>
    </NuxtLink>
</template>
