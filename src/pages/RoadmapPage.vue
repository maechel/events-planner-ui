<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const router = useRouter();

const roadmap = [
    {
        quarter: 'Q1 2026',
        status: 'In Progress',
        title: 'Budget & Expense Management',
        description:
            'Track event costs, manage vendor payments, and visualize budget allocation with real-time financial reporting.',
        features: ['Real-time expense tracking', 'Budget vs. Actual comparison', 'Vendor invoice management'],
        icon: 'fa-solid fa-file-invoice-dollar',
        color: 'text-primary',
    },
    {
        quarter: 'Q2 2026',
        status: 'Planning',
        title: 'Advanced Notifications & Reminders',
        description:
            'Stay on top of every detail with customizable automated alerts via email, push notifications, and SMS integration.',
        features: ['Multi-channel notifications', 'Custom trigger rules', 'Task escalation alerts'],
        icon: 'fa-solid fa-bell',
        color: 'text-orange-500',
    },
    {
        quarter: 'Q3 2026',
        status: 'Backlog',
        title: 'External Integrations Ecosystem',
        description:
            'Seamlessly sync your events with popular tools like Google Calendar, Slack, Zoom, and Microsoft Teams.',
        features: ['Calendar bi-directional sync', 'Slack channel automation', 'Virtual meeting integration'],
        icon: 'fa-solid fa-plug',
        color: 'text-blue-500',
    },
    {
        quarter: 'Q4 2026',
        status: 'Concept',
        title: 'AI-Powered Event Intelligence',
        description:
            'Leverage machine learning to optimize event scheduling, suggest venues, and automate routine task assignments.',
        features: ['Smart scheduling assistant', 'Predictive resource planning', 'Automated task delegation'],
        icon: 'fa-solid fa-brain',
        color: 'text-purple-500',
    },
];

const goHome = () => {
    router.push('/');
};

const getStatusSeverity = (status: string) => {
    switch (status) {
        case 'In Progress':
            return 'bg-primary/10 text-primary border-primary/20';
        case 'Planning':
            return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50';
        case 'Backlog':
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
        default:
            return 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700';
    }
};
</script>

<template>
    <div
        class="min-h-screen bg-white dark:bg-surface-950 py-16 px-6 sm:py-24 lg:px-8 flex flex-col items-center animate-fade-in"
    >
        <div class="w-full max-w-4xl">
            <div class="text-center mb-20">
                <h1 class="text-4xl font-black tracking-tight text-surface-900 dark:text-surface-0 sm:text-6xl mb-8">
                    Product <span class="text-primary">Roadmap</span>
                </h1>
                <p class="mt-6 text-xl leading-8 text-surface-600 dark:text-surface-400 font-medium">
                    Our vision for the future of professional event management. Explore the features and capabilities
                    we're building for 2026.
                </p>
            </div>

            <!-- Roadmap Timeline -->
            <div class="flex flex-col gap-12 sm:gap-16">
                <div
                    v-for="item in roadmap"
                    :key="item.quarter"
                    class="bg-surface-0 dark:bg-surface-900 rounded-[2.5rem] border border-surface-100 dark:border-surface-800 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden"
                >
                    <div class="flex flex-col md:flex-row">
                        <!-- Left Column: Icon & Quarter -->
                        <div
                            class="md:w-64 p-8 md:p-10 flex flex-col items-center justify-center bg-surface-50/50 dark:bg-surface-800/30 border-b md:border-b-0 md:border-r border-surface-100 dark:border-surface-800 shrink-0"
                        >
                            <div
                                class="w-16 h-16 rounded-2xl bg-white dark:bg-surface-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4"
                            >
                                <FontAwesomeIcon
                                    :icon="item.icon"
                                    :class="item.color"
                                    size="2xl"
                                />
                            </div>
                            <span class="text-2xl font-black text-surface-900 dark:text-surface-0 tracking-tight">{{
                                item.quarter
                            }}</span>
                            <span
                                :class="getStatusSeverity(item.status)"
                                class="mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                            >
                                {{ item.status }}
                            </span>
                        </div>

                        <!-- Right Column: Details -->
                        <div class="flex-1 p-8 md:p-10">
                            <h2 class="text-2xl font-black text-surface-900 dark:text-surface-0 mb-4 tracking-tight">
                                {{ item.title }}
                            </h2>
                            <p class="text-lg text-surface-500 dark:text-surface-400 leading-relaxed mb-8 font-medium">
                                {{ item.description }}
                            </p>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    v-for="feature in item.features"
                                    :key="feature"
                                    class="flex items-center gap-3"
                                >
                                    <span class="w-2 h-2 rounded-full bg-primary/40 shrink-0"></span>
                                    <span class="text-sm font-bold text-surface-600 dark:text-surface-300">{{
                                        feature
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer CTA -->
            <div class="text-center py-20 mt-12 border-t border-surface-200 dark:border-surface-800">
                <h3 class="text-2xl font-black text-surface-900 dark:text-surface-0 mb-8 tracking-tight">
                    Have a feature request?
                </h3>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button
                        label="Submit Feedback"
                        icon="fa-solid fa-comment-dots"
                        class="px-8 py-4 font-black rounded-2xl"
                    />
                    <Button
                        label="Back to Home"
                        icon="fa-solid fa-house"
                        variant="text"
                        @click="goHome"
                        class="font-bold"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
