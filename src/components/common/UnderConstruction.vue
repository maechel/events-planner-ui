<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

type PropTypes = {
    title?: string;
    description?: string;
    quarter?: string;
};

withDefaults(defineProps<PropTypes>(), {
    title: 'Feature Under Construction',
    description: 'We are working hard to bring this new functionality to you. Stay tuned for updates!',
    quarter: 'TBD',
});

const router = useRouter();

const goBack = () => {
    if (globalThis.history.length > 1) {
        router.back();
    } else {
        router.push('/');
    }
};
</script>

<template>
    <div
        class="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center animate-fade-in gap-12 sm:gap-16"
    >
        <div
            class="w-24 h-24 rounded-[2rem] bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/10"
        >
            <FontAwesomeIcon
                icon="fa-solid fa-person-digging"
                size="3x"
            />
        </div>

        <div class="flex flex-col items-center gap-10">
            <h1 class="text-4xl sm:text-5xl font-black text-surface-900 dark:text-surface-0 tracking-tight">
                {{ title }}
            </h1>

            <div class="max-w-2xl mx-auto">
                <slot>
                    <p class="text-xl leading-relaxed text-surface-600 dark:text-surface-400 font-medium">
                        {{ description }}
                    </p>
                </slot>
            </div>
        </div>

        <div
            class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
        >
            <FontAwesomeIcon
                icon="fa-solid fa-calendar-check"
                class="text-primary"
            />
            <span class="text-sm font-black uppercase tracking-widest text-surface-500 dark:text-surface-400">
                Expected Arrival:
            </span>
            <slot name="footer">
                <span class="text-sm font-black text-primary">{{ quarter }}</span>
            </slot>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
                label="Go Back"
                icon="fa-solid fa-arrow-left"
                @click="goBack"
                size="large"
                class="px-8 py-4 font-black rounded-2xl"
            />
            <Button
                label="Back to Home"
                icon="fa-solid fa-house"
                variant="text"
                @click="router.push('/')"
                class="font-bold"
            />
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
