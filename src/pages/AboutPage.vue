<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const router = useRouter();

const goHome = () => {
    router.push('/');
};

const startTasks = () => {
    router.push('/events');
};

const features = [
    {
        title: 'Event Management',
        description:
            'Create, edit, and organize events with ease. Keep track of all your upcoming and past gatherings in one central hub.',
        icon: 'fa-solid fa-calendar-days',
        color: 'text-primary',
    },
    {
        title: 'Task Orchestration',
        description:
            'Break down events into actionable tasks. Assign owners, set due dates, and track completion status in real-time.',
        icon: 'fa-solid fa-list-check',
        color: 'text-orange-500',
    },
    {
        title: 'Team Collaboration',
        description:
            'Invite members and organizers to your events. Work together to ensure every detail is covered and responsibilities are clear.',
        icon: 'fa-solid fa-users',
        color: 'text-blue-500',
    },
    {
        title: 'Personal Dashboard',
        description:
            'Get a personalized overview of your responsibilities. Track your urgent tasks and upcoming events at a glance.',
        icon: 'fa-solid fa-chart-line',
        color: 'text-purple-500',
    },
    {
        title: 'Location Intelligence',
        description:
            'Store detailed venue and address information for every event, making it easy for everyone to find their way.',
        icon: 'fa-solid fa-map-location-dot',
        color: 'text-green-500',
    },
    {
        title: 'Secure Access',
        description:
            'Role-based access control ensures that only authorized users can manage events and sensitive information.',
        icon: 'fa-solid fa-user-shield',
        color: 'text-red-500',
    },
];
</script>

<template>
    <div
        class="min-h-screen bg-white dark:bg-surface-950 py-16 px-6 sm:py-24 lg:px-8 flex flex-col items-center animate-fade-in"
    >
        <div class="w-full max-w-4xl">
            <div class="text-center mb-24">
                <h1 class="text-4xl font-black tracking-tight text-surface-900 dark:text-surface-0 sm:text-6xl mb-8">
                    Everything you need to <span class="text-primary">Plan Perfect Events</span>
                </h1>
                <p class="mt-6 text-xl leading-8 text-surface-600 dark:text-surface-400 font-medium">
                    EventPlanner is designed for professional organizers and teams who need a robust tool to coordinate
                    complex logistics without the clutter.
                </p>
            </div>

            <!-- Core Purpose Section -->
            <div
                class="bg-surface-50 dark:bg-surface-900/50 rounded-[3rem] p-10 sm:p-16 mb-24 border border-surface-100 dark:border-surface-800 shadow-sm flex flex-col items-center"
            >
                <div class="max-w-2xl text-center">
                    <h2 class="text-3xl font-black text-surface-900 dark:text-surface-0 mb-10 tracking-tight">
                        Purpose & Vision
                    </h2>
                    <p class="text-lg text-surface-600 dark:text-surface-400 leading-relaxed mb-10">
                        In a world of constant digital noise, coordination often gets lost in translation. EventPlanner
                        provides a dedicated workspace for your events, focusing on the three pillars of successful
                        planning:
                        <strong class="text-surface-900 dark:text-surface-0"
                            >Clarity, Responsibility, and Visibility.</strong
                        >
                    </p>
                    <div class="flex flex-wrap justify-center gap-6">
                        <span class="px-5 py-2.5 rounded-full bg-white dark:bg-surface-800 text-sm font-bold shadow-xs"
                            >🚀 Efficient CRUD Operations</span
                        >
                        <span class="px-5 py-2.5 rounded-full bg-white dark:bg-surface-800 text-sm font-bold shadow-xs"
                            >🔐 Role-Based Security</span
                        >
                        <span class="px-5 py-2.5 rounded-full bg-white dark:bg-surface-800 text-sm font-bold shadow-xs"
                            >📊 Real-time Analytics</span
                        >
                    </div>
                </div>
            </div>

            <!-- Capabilities Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
                <div
                    v-for="feature in features"
                    :key="feature.title"
                    class="flex flex-col items-center text-center gap-4 p-8 rounded-3xl bg-white dark:bg-surface-900 border border-surface-100 dark:border-surface-800 hover:shadow-xl transition-all duration-500 group"
                >
                    <div
                        class="w-14 h-14 rounded-2xl bg-surface-50 dark:bg-surface-800 flex items-center justify-center group-hover:scale-110 transition-transform"
                    >
                        <FontAwesomeIcon
                            :icon="feature.icon"
                            :class="feature.color"
                            size="lg"
                        />
                    </div>
                    <div>
                        <h3 class="text-xl font-black text-surface-900 dark:text-surface-0 mb-3 tracking-tight">
                            {{ feature.title }}
                        </h3>
                        <p class="text-surface-500 dark:text-surface-400 leading-relaxed font-medium">
                            {{ feature.description }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- CTA Section -->
            <div class="text-center py-20 border-t border-surface-200 dark:border-surface-800">
                <h2 class="text-3xl font-black text-surface-900 dark:text-surface-0 mb-10 tracking-tight">
                    Ready to get started?
                </h2>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button
                        label="Go to My Events"
                        icon="fa-solid fa-arrow-right"
                        iconPos="right"
                        @click="startTasks"
                        size="large"
                        class="px-8 py-4 font-black rounded-2xl shadow-xl shadow-primary/20"
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
