<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Skeleton from 'primevue/skeleton';
import { useEventStore } from '@/stores/event';
import EventForm from '@/components/forms/EventForm.vue';
import EventList from '@/components/events/EventList.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const router = useRouter();
const eventStore = useEventStore();
const { events, loading, upcomingEvents, passedEvents } = storeToRefs(eventStore);

const showCreateDialog = ref(false);

onMounted(async () => {
    await eventStore.fetchEvents();
});

const viewDetails = (id: string | number) => {
    router.push(`/events/${id}`);
};

const handleCreateSuccess = () => {
    showCreateDialog.value = false;
};
</script>

<template>
    <div class="p-6 sm:p-10 max-w-[1600px] mx-auto space-y-16 sm:space-y-20">
        <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-8">
            <div>
                <h1 class="text-3xl sm:text-4xl font-black text-surface-900 dark:text-surface-0 tracking-tight">
                    Your Events
                </h1>
                <p class="text-surface-500 dark:text-surface-400 mt-2 text-base sm:text-lg font-medium">
                    Manage and coordinate all your upcoming gatherings.
                </p>
            </div>
            <Button
                label="Create Event"
                icon="fa-solid fa-calendar-plus"
                size="large"
                @click="showCreateDialog = true"
                class="shadow-xl shadow-primary/20 px-8 py-4 font-black text-lg"
            />
        </div>

        <Dialog
            v-model:visible="showCreateDialog"
            modal
            header="Create New Event"
            :style="{ width: '45rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
            <EventForm
                @success="handleCreateSuccess"
                @cancel="showCreateDialog = false"
            />
        </Dialog>

        <div
            v-if="loading && events.length === 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
            <div
                v-for="i in 6"
                :key="i"
                class="bg-surface-0 dark:bg-surface-900 rounded-3xl overflow-hidden shadow-sm border border-surface-100 dark:border-surface-800"
            >
                <Skeleton
                    width="100%"
                    height="12rem"
                ></Skeleton>
                <div class="p-8">
                    <Skeleton
                        width="70%"
                        height="2rem"
                        class="mb-4"
                    ></Skeleton>
                    <Skeleton
                        width="40%"
                        height="1.5rem"
                        class="mb-8"
                    ></Skeleton>
                    <Skeleton
                        width="100%"
                        height="5rem"
                        class="mb-8"
                    ></Skeleton>
                    <div class="flex gap-8">
                        <Skeleton
                            width="5rem"
                            height="1.5rem"
                        ></Skeleton>
                        <Skeleton
                            width="5rem"
                            height="1.5rem"
                        ></Skeleton>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-else-if="events.length > 0"
            class="space-y-20"
        >
            <EventList
                title="Upcoming Events"
                :events="upcomingEvents"
                @view-details="viewDetails"
            />
            <EventList
                title="Past Events"
                :events="passedEvents"
                isPassed
                @view-details="viewDetails"
            />
        </div>

        <div
            v-else
            class="text-center py-24 bg-surface-0 dark:bg-surface-900 rounded-[3rem] border-4 border-dashed border-surface-100 dark:border-surface-800 shadow-inner"
        >
            <div
                class="w-24 h-24 rounded-full bg-surface-50 dark:bg-surface-800 flex items-center justify-center mx-auto mb-8 text-surface-200 dark:text-surface-700"
            >
                <FontAwesomeIcon
                    icon="fa-solid fa-calendar-xmark"
                    size="4x"
                />
            </div>
            <h3 class="text-3xl font-black text-surface-900 dark:text-surface-0 mb-4 tracking-tight">
                No events found
            </h3>
            <p class="text-surface-500 text-lg mb-10 max-w-md mx-auto font-medium">
                Your event schedule is empty. Time to plan something amazing!
            </p>
            <Button
                label="Create Your First Event"
                icon="fa-solid fa-plus"
                @click="showCreateDialog = true"
                size="large"
                class="px-8 py-4 font-black"
            />
        </div>
    </div>
</template>
