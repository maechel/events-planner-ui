<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import AppVersion from '@/components/common/AppVersion.vue';

const router = useRouter();

const changelog = [
    {
        version: '1.2.0',
        date: '2026-01-07',
        title: 'Platform Refinement',
        features: [
            'Enhanced Event Details with structured location intelligence and venue management',
            'Advanced Task Tracking with assignee visualization and urgency-based status indicators',
            'Improved User Management with administrative controls and account audit logs',
            'Standardized wide layouts for high-density information display',
            'Implemented robust service-oriented architecture and reusable logic composables',
            'New About page and feature showcases for better onboarding',
        ],
    },
    {
        version: '1.1.0',
        date: '2025-12-20',
        title: 'Event Management Evolution',
        features: [
            'Personalized API integration for user-specific event and task visibility',
            'Advanced event grouping (Upcoming vs. Past) with chronological sorting',
            'Real-time Dashboard analytics for personal productivity and team participation',
            'Optimistic UI updates for seamless task and participant management',
            'Enhanced accessibility and semantic HTML improvements',
        ],
    },
    {
        version: '1.0.0',
        date: '2024-01-05',
        title: 'Initial Release',
        features: [
            'Core Event Coordination system with multi-step creation flow',
            'Role-based access control (Admin & User roles)',
            'Secure authentication with login and registration',
            'Interactive event workspace with collaborative task lists',
            'Modern responsive design with native dark mode support',
        ],
    },
];

const goHome = () => {
    router.push('/');
};
</script>

<template>
    <div class="min-h-screen bg-white dark:bg-surface-950 py-16 px-6 sm:py-24 lg:px-8 flex flex-col items-center">
        <div class="w-full max-w-4xl">
            <div class="text-center mb-16">
                <h1 class="text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-0 sm:text-6xl">
                    Changelog
                </h1>
                <p class="mt-4 text-lg leading-8 text-surface-600 dark:text-surface-400">
                    Stay up to date with the latest features and improvements.
                </p>
            </div>

            <div class="space-y-16 sm:space-y-20">
                <div
                    v-for="release in changelog"
                    :key="release.version"
                    class="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-surface-200 dark:before:bg-surface-800"
                >
                    <div
                        class="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-primary ring-4 ring-white dark:ring-surface-950"
                    ></div>

                    <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">
                            {{ release.title }}
                        </h2>
                        <div class="flex items-center gap-3">
                            <AppVersion
                                :version="release.version"
                                class="bg-primary/10 text-primary font-bold rounded-md px-2 py-0.5"
                            />
                            <time class="text-sm text-surface-500">{{ release.date }}</time>
                        </div>
                    </div>

                    <ul class="mt-6 space-y-4 text-surface-600 dark:text-surface-400">
                        <li
                            v-for="feature in release.features"
                            :key="feature"
                            class="flex items-start gap-3"
                        >
                            <FontAwesomeIcon
                                icon="fa-solid fa-check"
                                class="mt-1 text-primary text-sm"
                            />
                            <span>{{ feature }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                class="mt-16 pt-8 border-t border-surface-200 dark:border-surface-800 flex justify-between items-center"
            >
                <Button
                    @click="goHome"
                    variant="text"
                >
                    <FontAwesomeIcon icon="fa-solid fa-house" />
                    <span>Back to Home</span>
                </Button>

                <a
                    href="#"
                    class="text-sm font-semibold text-primary hover:underline flex items-center gap-2"
                >
                    View on GitHub
                    <FontAwesomeIcon
                        icon="fa-solid fa-up-right-from-square"
                        class="text-xs"
                    />
                </a>
            </div>
        </div>
    </div>
</template>
