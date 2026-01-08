<script setup lang="ts">
import { ParticipantRole } from '@/constants/roles';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import type { Participant } from '@/stores/event';
import type { EntityId } from '@/types/common';

type PropTypes = {
    organizers: Participant[];
    members: Participant[];
};

type EmitTypes = {
    add: [];
    remove: [userId: EntityId, role: ParticipantRole];
};

defineProps<PropTypes>();
const emit = defineEmits<EmitTypes>();
</script>

<template>
    <div
        class="bg-surface-0 dark:bg-surface-900 p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-surface-100 dark:border-surface-800"
    >
        <div class="flex justify-between items-center mb-10">
            <h3 class="text-3xl font-black flex items-center gap-4 tracking-tight">
                <span class="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg">
                    <FontAwesomeIcon icon="fa-solid fa-users" />
                </span>
                Team
            </h3>
            <Button
                icon="fa-solid fa-plus"
                size="small"
                text
                rounded
                @click="emit('add')"
                class="w-10 h-10"
            />
        </div>

        <div class="space-y-12">
            <div>
                <span class="text-xs font-black uppercase tracking-[0.3em] text-surface-400 mb-8 block"
                    >Organizers</span
                >
                <div class="space-y-6">
                    <div
                        v-for="org in organizers"
                        :key="org.id"
                        class="flex items-center justify-between group p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 rounded-2xl transition-all"
                    >
                        <div class="flex items-center gap-5">
                            <Avatar
                                :image="org.avatar"
                                :label="!org.avatar ? org.username?.charAt(0) || '?' : undefined"
                                shape="circle"
                                size="xlarge"
                                class="ring-4 ring-primary/10"
                            />
                            <div class="flex flex-col">
                                <span class="font-black text-xl text-surface-900 dark:text-surface-0">{{
                                    org.username || 'Unknown'
                                }}</span>
                                <span class="text-xs text-primary font-black uppercase tracking-widest mt-1"
                                    >Organizer</span
                                >
                            </div>
                        </div>
                        <Button
                            icon="fa-solid fa-times"
                            variant="text"
                            severity="danger"
                            rounded
                            v-tooltip="'Remove Organizer'"
                            @click="emit('remove', org.id, ParticipantRole.ORGANIZER)"
                        />
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-surface-50 dark:border-surface-800">
                <span class="text-xs font-black uppercase tracking-[0.3em] text-surface-400 mb-8 block">Members</span>
                <div class="space-y-6">
                    <div
                        v-for="member in members"
                        :key="member.id"
                        class="flex items-center justify-between group p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 rounded-2xl transition-all"
                    >
                        <div class="flex items-center gap-5">
                            <Avatar
                                :image="member.avatar"
                                :label="!member.avatar ? member.username?.charAt(0) || '?' : undefined"
                                shape="circle"
                                size="xlarge"
                                class="ring-4 ring-surface-100 dark:ring-surface-700"
                            />
                            <span class="font-black text-xl text-surface-900 dark:text-surface-0">{{
                                member.username || 'Unknown'
                            }}</span>
                        </div>
                        <Button
                            variant="text"
                            severity="danger"
                            rounded
                            v-tooltip="'Remove Member'"
                            @click="emit('remove', member.id, ParticipantRole.MEMBER)"
                        >
                            <FontAwesomeIcon icon="fa-solid fa-times" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
