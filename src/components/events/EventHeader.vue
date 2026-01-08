<script setup lang="ts">
import { DATE_FORMATS } from '@/constants/ui';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import { format, parseISO } from 'date-fns';
import type { EventDetailDTO } from '@/types/events';

type PropTypes = {
    event: EventDetailDTO;
};

type EmitTypes = {
    back: [];
    edit: [];
    delete: [];
    invite: [];
};

defineProps<PropTypes>();
const emit = defineEmits<EmitTypes>();

const formatDate = (dateString: string) => {
    return format(parseISO(dateString), DATE_FORMATS.DEFAULT);
};
</script>

<template>
    <div>
        <Button
            @click="emit('back')"
            variant="text"
            class="mb-8 font-black uppercase tracking-widest text-xs"
        >
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
            <span>Back to Events</span>
        </Button>
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div class="max-w-3xl">
                <h1
                    class="text-4xl sm:text-6xl font-black text-surface-900 dark:text-surface-0 mb-6 tracking-tight leading-[1.1]"
                >
                    {{ event.title }}
                </h1>
                <div class="flex flex-wrap gap-8 text-surface-500 dark:text-surface-400 text-lg font-bold">
                    <span class="flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <FontAwesomeIcon icon="fa-solid fa-calendar-days" />
                        </span>
                        {{ formatDate(event.date) }}
                    </span>
                    <span class="flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <FontAwesomeIcon icon="fa-solid fa-location-dot" />
                        </span>
                        {{ event.address?.locationName || 'Unknown Venue'
                        }}{{ event.address?.city ? `, ${event.address.city}` : '' }}
                    </span>
                </div>
            </div>
            <div class="flex flex-wrap gap-4">
                <Button
                    variant="outlined"
                    size="large"
                    @click="emit('edit')"
                    class="px-6 py-4 font-black"
                >
                    <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                    <span>Edit Event</span>
                </Button>
                <Button
                    severity="danger"
                    variant="outlined"
                    size="large"
                    @click="emit('delete')"
                    class="px-6 py-4 font-black"
                >
                    <FontAwesomeIcon icon="fa-solid fa-trash" />
                    <span>Delete</span>
                </Button>
                <Button
                    size="large"
                    @click="emit('invite')"
                    class="shadow-xl shadow-primary/20 px-8 py-4 font-black"
                >
                    <FontAwesomeIcon icon="fa-solid fa-user-plus" />
                    <span>Invite Team</span>
                </Button>
            </div>
        </div>
    </div>
</template>
