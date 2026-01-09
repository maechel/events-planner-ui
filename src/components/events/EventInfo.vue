<script setup lang="ts">
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { EventDetail } from '@/types/events';

type PropTypes = {
    event: EventDetail;
};

const props = defineProps<PropTypes>();

const hasAddress = computed(() => {
    return !!(props.event.address?.street || props.event.address?.city || props.event.address?.country);
});

const formattedCityState = computed(() => {
    if (!props.event.address) return '';
    const { zipCode, city } = props.event.address;
    return [zipCode, city].filter(Boolean).join(' ');
});
</script>

<template>
    <div
        class="bg-surface-0 dark:bg-surface-900 p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-surface-100 dark:border-surface-800"
    >
        <h3 class="text-3xl font-black mb-8 tracking-tight">Description</h3>
        <p class="text-surface-500 dark:text-surface-400 text-xl leading-relaxed font-medium">
            {{ event.description }}
        </p>
        <div class="mt-12 pt-12 border-t border-surface-100 dark:border-surface-800">
            <h4 class="text-2xl font-black mb-6 tracking-tight">Venue & Address</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    class="flex items-start gap-5 p-6 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50 hover:shadow-md transition-shadow"
                >
                    <span
                        class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"
                    >
                        <FontAwesomeIcon
                            icon="fa-solid fa-building"
                            size="lg"
                        />
                    </span>
                    <div class="flex flex-col">
                        <span class="text-xs font-black uppercase tracking-widest text-surface-400 mb-1">Venue</span>
                        <span class="text-xl font-bold text-surface-700 dark:text-surface-200">
                            {{ event.address?.locationName || 'N/A' }}
                        </span>
                    </div>
                </div>
                <div
                    class="flex items-start gap-5 p-6 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50 hover:shadow-md transition-shadow"
                >
                    <span
                        class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"
                    >
                        <FontAwesomeIcon
                            icon="fa-solid fa-map-location-dot"
                            size="lg"
                        />
                    </span>
                    <div class="flex flex-col">
                        <span class="text-xs font-black uppercase tracking-widest text-surface-400 mb-1">Address</span>
                        <div class="text-xl font-bold text-surface-700 dark:text-surface-200 leading-snug">
                            <div v-if="event.address?.street">{{ event.address.street }}</div>
                            <div v-if="formattedCityState">
                                {{ formattedCityState }}
                            </div>
                            <div
                                v-if="event.address?.country"
                                class="text-surface-500 dark:text-surface-400 text-lg mt-1"
                            >
                                {{ event.address.country }}
                            </div>
                            <div
                                v-if="!hasAddress"
                                class="text-surface-400 italic"
                            >
                                No address provided
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
