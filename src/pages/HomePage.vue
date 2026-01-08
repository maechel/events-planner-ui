<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import AppVersion from '@/components/common/AppVersion.vue';

const router = useRouter();

const startTasks = () => {
    router.push('/events');
};

const goChangelog = () => {
    router.push('/changelog');
};

const features = [
    {
        title: 'Event Coordination',
        description: 'Plan your events with precision, from initial concept to final execution.',
        icon: 'fa-solid fa-calendar-days',
    },
    {
        title: 'Team Collaboration',
        description: 'Assign tasks to both organizers and members in real-time.',
        icon: 'fa-solid fa-users',
    },
    {
        title: 'Location Mapping',
        description: 'Keep everyone informed with integrated address and venue details.',
        icon: 'fa-solid fa-location-dot',
    },
];
</script>

<template>
    <div class="relative isolate bg-white dark:bg-surface-950">
        <div
            class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
        >
            <div
                class="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary/30 to-[#9089fc]/30 sm:left-[calc(50%-30rem)] sm:w-288.75"
            ></div>
        </div>

        <div
            class="mx-auto max-w-7xl px-10 pt-10 pb-24 sm:pb-32 lg:flex lg:items-center lg:justify-center lg:gap-x-12 xl:gap-x-24 lg:px-12 lg:py-40"
        >
            <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:pt-8 flex flex-col justify-center">
                <div class="mt-24 sm:mt-32 lg:mt-16">
                    <button
                        @click="goChangelog"
                        class="inline-flex space-x-6 cursor-pointer group"
                    >
                        <span
                            class="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/10 group-hover:bg-primary/20 transition-colors"
                        >
                            What's new
                        </span>
                        <span
                            class="inline-flex items-center text-sm font-medium leading-6 text-surface-600 dark:text-surface-400 group-hover:text-surface-900 dark:group-hover:text-surface-0 transition-colors"
                        >
                            <AppVersion class="mr-1" />
                            <span>is out</span>
                            <FontAwesomeIcon
                                icon="fa-solid fa-chevron-right"
                                class="ml-2 h-5 w-5 text-surface-400 group-hover:translate-x-1 transition-transform"
                                aria-hidden="true"
                            />
                        </span>
                    </button>
                </div>
                <h1 class="mt-12 text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-0 sm:text-6xl">
                    Host unforgettable events with ease
                </h1>
                <p class="mt-8 text-lg leading-8 text-surface-600 dark:text-surface-400">
                    A professional event planning platform built for organizers and teams who want to coordinate tasks,
                    members, and locations seamlessly.
                </p>
                <div class="mt-12 flex items-center gap-x-6">
                    <Button
                        label="Get started"
                        @click="startTasks"
                        size="large"
                    />
                    <router-link
                        to="/about"
                        class="text-sm font-semibold leading-6 text-surface-900 dark:text-surface-0"
                    >
                        Learn more <span aria-hidden="true">→</span>
                    </router-link>
                </div>
            </div>

            <!-- Features Grid -->
            <div
                class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:max-w-none lg:flex-none flex-col justify-center"
            >
                <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
                        <div
                            v-for="feature in features"
                            :key="feature.title"
                            class="flex flex-col gap-4 rounded-xl bg-surface-0/5 p-6 ring-1 ring-inset ring-surface-900/10 dark:ring-surface-0/10"
                        >
                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <FontAwesomeIcon
                                    :icon="feature.icon"
                                    class="text-white"
                                />
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0">
                                    {{ feature.title }}
                                </h3>
                                <p class="mt-2 text-surface-600 dark:text-surface-400">
                                    {{ feature.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom -->
        <div
            class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
        >
            <div
                class="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5]/30 to-primary/30 sm:left-[calc(50%+36rem)] sm:w-288.75"
            ></div>
        </div>
    </div>
</template>
