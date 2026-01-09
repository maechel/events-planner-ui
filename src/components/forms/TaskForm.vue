<script setup lang="ts">
import { ToastSeverity } from '@/constants/ui';
import { ref, computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import { taskSchema, taskInitialValues } from '@/schemas/task';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useEventStore, type Participant, type Task } from '@/stores/event';
import { useToast } from 'primevue/usetoast';
import { parseISO } from 'date-fns';
import Avatar from 'primevue/avatar';
import type { TaskSummary } from '@/types/tasks';
import type { EntityId } from '@/types/common';
import type { AxiosError } from 'axios';

type PropTypes = {
    eventId: EntityId;
    initialData?: TaskSummary;
    isEdit?: boolean;
    participants: Participant[];
    visible: boolean;
};

type EmitTypes = {
    success: [data: TaskSummary];
    cancel: [];
    'update:visible': [value: boolean];
};

const props = defineProps<PropTypes>();
const emit = defineEmits<EmitTypes>();

const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value),
});

const eventStore = useEventStore();
const toast = useToast();
const loading = ref(false);

const { handleSubmit, errors, defineField, meta, resetForm } = useForm({
    validationSchema: taskSchema,
    initialValues: props.initialData
        ? {
              description: props.initialData.description || '',
              assignedToId: props.initialData.assignedToId ?? (undefined as EntityId | undefined),
              dueDate: props.initialData.dueDate
                  ? parseISO(props.initialData.dueDate)
                  : (undefined as Date | undefined),
          }
        : taskInitialValues,
});

watch(
    () => props.visible,
    (newVal) => {
        if (!newVal) {
            resetForm();
        }
    },
);

const [description] = defineField('description');
const [assignedToId] = defineField('assignedToId');
const [dueDate] = defineField('dueDate');
const dueDateValue = computed({
    get: () => dueDate.value as unknown as Date,
    set: (val: Date) => {
        dueDate.value = val as unknown as Date;
    },
});

const onSubmit = handleSubmit(async (values) => {
    loading.value = true;
    try {
        const formattedValues: Partial<Task> = {
            description: values.description,
            assignedToId: values.assignedToId || undefined,
            dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
        };

        let result;
        if (props.isEdit && props.initialData?.id) {
            result = await eventStore.updateTask(props.initialData.id, formattedValues);
            toast.add({
                severity: ToastSeverity.SUCCESS,
                summary: 'Updated',
                detail: 'Task updated successfully',
                life: 3000,
            });
        } else {
            result = await eventStore.addTask(props.eventId, formattedValues as Omit<Task, 'id' | 'completed'>);
            toast.add({
                severity: ToastSeverity.SUCCESS,
                summary: 'Created',
                detail: 'Task added successfully',
                life: 3000,
            });
        }
        isVisible.value = false;
        emit('success', result);
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.add({
            severity: ToastSeverity.ERROR,
            summary: 'Error',
            detail: axiosError.response?.data?.message || 'Failed to save task',
            life: 5000,
        });
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <Dialog
        v-model:visible="isVisible"
        modal
        :header="isEdit ? 'Edit Task' : 'Add New Task'"
        :style="{ width: '35rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
        <form
            @submit.prevent="onSubmit"
            class="flex flex-col gap-4"
        >
            <div class="flex flex-col gap-2">
                <label
                    for="description"
                    class="font-semibold text-surface-700 dark:text-surface-0/80"
                    >Task Description</label
                >
                <InputText
                    id="description"
                    v-model="description"
                    :class="{ 'p-invalid': errors.description }"
                    placeholder="e.g. Order catering"
                />
                <div class="h-5">
                    <small
                        v-if="errors.description"
                        class="text-red-500"
                        >{{ errors.description }}</small
                    >
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label
                    for="assignedToId"
                    class="font-semibold text-surface-700 dark:text-surface-0/80"
                    >Assign To</label
                >
                <Select
                    id="assignedToId"
                    v-model="assignedToId"
                    :options="participants"
                    optionLabel="username"
                    optionValue="id"
                    placeholder="Select an assignee"
                    class="w-full"
                    showClear
                >
                    <template #value="slotProps">
                        <div
                            v-if="slotProps.value"
                            class="flex items-center gap-2"
                        >
                            <Avatar
                                :image="participants.find((p) => String(p.id) === String(slotProps.value))?.avatar"
                                :label="
                                    participants
                                        .find((p) => String(p.id) === String(slotProps.value))
                                        ?.username?.charAt(0)
                                "
                                shape="circle"
                                class="w-6 h-6"
                            />
                            <span>{{
                                participants.find((p) => String(p.id) === String(slotProps.value))?.username
                            }}</span>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="flex items-center gap-2">
                            <Avatar
                                :image="slotProps.option.avatar"
                                :label="slotProps.option.username?.charAt(0)"
                                shape="circle"
                                class="w-6 h-6"
                            />
                            <span>{{ slotProps.option.username }}</span>
                        </div>
                    </template>
                </Select>
                <div class="h-5">
                    <small
                        v-if="errors.assignedToId"
                        class="text-red-500"
                        >{{ errors.assignedToId }}</small
                    >
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label
                    for="dueDate"
                    class="font-semibold text-surface-700 dark:text-surface-0/80"
                    >Due Date</label
                >
                <DatePicker
                    id="dueDate"
                    v-model="dueDateValue"
                    showTime
                    hourFormat="24"
                    dateFormat="yy-mm-dd"
                    :class="{ 'p-invalid': errors.dueDate }"
                    placeholder="Select due date"
                />
                <div class="h-5">
                    <small
                        v-if="errors.dueDate"
                        class="text-red-500"
                        >{{ errors.dueDate }}</small
                    >
                </div>
            </div>

            <div class="flex justify-end gap-2 mt-4">
                <Button
                    type="button"
                    label="Cancel"
                    variant="text"
                    @click.prevent.stop="isVisible = false"
                    :disabled="loading"
                />
                <Button
                    type="submit"
                    :label="isEdit ? 'Update Task' : 'Add Task'"
                    :loading="loading"
                    :disabled="!meta.valid"
                />
            </div>
        </form>
    </Dialog>
</template>
