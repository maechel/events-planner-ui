<script setup lang="ts">
import { ToastSeverity } from '@/constants/ui';
import { ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import { eventSchema, eventInitialValues } from '@/schemas/event';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import { useEventStore } from '@/stores/event';
import { useToast } from 'primevue/usetoast';
import { parseISO } from 'date-fns';
import type { EventDetailDTO } from '@/types/events';
import type { AxiosError } from 'axios';

type PropTypes = {
    initialData?: EventDetailDTO;
    isEdit?: boolean;
};

type EmitTypes = {
    success: [data: EventDetailDTO];
    cancel: [];
};

const props = defineProps<PropTypes>();
const emit = defineEmits<EmitTypes>();

const eventStore = useEventStore();
const toast = useToast();
const loading = ref(false);

const { handleSubmit, errors, defineField, values } = useForm({
    validationSchema: eventSchema,
    initialValues: props.initialData
        ? {
              title: props.initialData.title,
              description: props.initialData.description,
              date: props.initialData.date ? parseISO(props.initialData.date) : (null as unknown as Date),
              locationName: props.initialData.address?.locationName || '',
              street: props.initialData.address?.street || '',
              city: props.initialData.address?.city || '',
              zipCode: props.initialData.address?.zipCode || '',
              country: props.initialData.address?.country || '',
          }
        : eventInitialValues,
});

const [title] = defineField('title');
const [description] = defineField('description');
const [date] = defineField('date');
const dateValue = computed({
    get: () => date.value as unknown as Date,
    set: (val: Date) => {
        date.value = val as unknown as string;
    },
});
const [locationName] = defineField('locationName');
const [street] = defineField('street');
const [city] = defineField('city');
const [zipCode] = defineField('zipCode');
const [country] = defineField('country');

const onSubmit = handleSubmit(async (formValues) => {
    loading.value = true;
    try {
        const formattedValues = {
            id: props.initialData?.id || '',
            title: formValues.title,
            description: formValues.description,
            date: new Date(formValues.date).toISOString(),
            locationName: formValues.locationName,
            street: formValues.street,
            city: formValues.city,
            zipCode: formValues.zipCode,
            country: formValues.country,
            participantCount: 0,
            taskCount: 0,
            hasUnfinishedTasks: false,
        };

        let result: EventDetailDTO;
        if (props.isEdit && props.initialData?.id) {
            result = (await eventStore.updateEvent(props.initialData.id, formattedValues)) as EventDetailDTO;
            toast.add({
                severity: ToastSeverity.SUCCESS,
                summary: 'Updated',
                detail: 'Event updated successfully',
                life: 3000,
            });
        } else {
            result = (await eventStore.createEvent(formattedValues)) as unknown as EventDetailDTO;
            toast.add({
                severity: ToastSeverity.SUCCESS,
                summary: 'Created',
                detail: 'Event created successfully',
                life: 3000,
            });
        }
        emit('success', result);
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.add({
            severity: ToastSeverity.ERROR,
            summary: 'Error',
            detail: axiosError.response?.data?.message || 'Failed to save event',
            life: 5000,
        });
    } finally {
        loading.value = false;
    }
});

const isStepOneValid = computed(() => {
    const stepOneFields = ['title', 'description', 'date', 'locationName'];
    return stepOneFields.every(
        (field) => !errors.value[field as keyof typeof errors.value] && values[field as keyof typeof values],
    );
});
</script>

<template>
    <div class="card">
        <Stepper value="1">
            <StepList>
                <Step value="1">General Info</Step>
                <Step value="2">Address Details</Step>
            </StepList>
            <StepPanels>
                <StepPanel
                    v-slot="{ activateCallback }"
                    value="1"
                >
                    <div class="flex flex-col gap-4 mt-4">
                        <div class="flex flex-col gap-2">
                            <label
                                for="title"
                                class="font-semibold text-surface-700 dark:text-surface-0/80"
                                >Event Title</label
                            >
                            <InputText
                                id="title"
                                v-model="title"
                                :class="{ 'p-invalid': errors.title }"
                                placeholder="e.g. Annual Tech Conference"
                            />
                            <div class="h-5">
                                <small
                                    v-if="errors.title"
                                    class="text-red-500"
                                    >{{ errors.title }}</small
                                >
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                for="description"
                                class="font-semibold text-surface-700 dark:text-surface-0/80"
                                >Description</label
                            >
                            <Textarea
                                id="description"
                                v-model="description"
                                :class="{ 'p-invalid': errors.description }"
                                rows="3"
                                placeholder="Tell us about the event..."
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
                                for="date"
                                class="font-semibold text-surface-700 dark:text-surface-0/80"
                                >Date & Time</label
                            >
                            <DatePicker
                                id="date"
                                v-model="dateValue"
                                showTime
                                hourFormat="24"
                                dateFormat="yy-mm-dd"
                                :class="{ 'p-invalid': errors.date }"
                                placeholder="Select date and time"
                            />
                            <div class="h-5">
                                <small
                                    v-if="errors.date"
                                    class="text-red-500"
                                    >{{ errors.date }}</small
                                >
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                for="locationName"
                                class="font-semibold text-surface-700 dark:text-surface-0/80"
                                >Venue Name</label
                            >
                            <InputText
                                id="locationName"
                                v-model="locationName"
                                :class="{ 'p-invalid': errors.locationName }"
                                placeholder="e.g. Grand Hotel"
                            />
                            <div class="h-5">
                                <small
                                    v-if="errors.locationName"
                                    class="text-red-500"
                                    >{{ errors.locationName }}</small
                                >
                            </div>
                        </div>

                        <div class="flex justify-end gap-2 pt-4">
                            <Button
                                variant="text"
                                @click.prevent="emit('cancel')"
                            >
                                <span>Cancel</span>
                            </Button>
                            <Button
                                @click.stop="activateCallback('2')"
                                :disabled="!isStepOneValid"
                            >
                                <span>Next</span>
                                <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
                            </Button>
                        </div>
                    </div>
                </StepPanel>

                <StepPanel
                    v-slot="{ activateCallback }"
                    value="2"
                >
                    <div class="flex flex-col gap-4 mt-4">
                        <div class="flex flex-col gap-2">
                            <label
                                for="street"
                                class="font-semibold text-surface-700 dark:text-surface-0/80"
                                >Street</label
                            >
                            <InputText
                                id="street"
                                v-model="street"
                                :class="{ 'p-invalid': errors.street }"
                                placeholder="e.g. Main St 1"
                            />
                            <div class="h-5">
                                <small
                                    v-if="errors.street"
                                    class="text-red-500"
                                    >{{ errors.street }}</small
                                >
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="flex flex-col gap-2">
                                <label
                                    for="city"
                                    class="font-semibold text-surface-700 dark:text-surface-0/80"
                                    >City</label
                                >
                                <InputText
                                    id="city"
                                    v-model="city"
                                    :class="{ 'p-invalid': errors.city }"
                                    placeholder="e.g. Gothenburg"
                                />
                                <div class="h-5">
                                    <small
                                        v-if="errors.city"
                                        class="text-red-500"
                                        >{{ errors.city }}</small
                                    >
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label
                                    for="zipCode"
                                    class="font-semibold text-surface-700 dark:text-surface-0/80"
                                    >Zip Code</label
                                >
                                <InputText
                                    id="zipCode"
                                    v-model="zipCode"
                                    :class="{ 'p-invalid': errors.zipCode }"
                                    placeholder="e.g. 412 51"
                                />
                                <div class="h-5">
                                    <small
                                        v-if="errors.zipCode"
                                        class="text-red-500"
                                        >{{ errors.zipCode }}</small
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                for="country"
                                class="font-semibold text-surface-700 dark:text-surface-0/80"
                                >Country</label
                            >
                            <InputText
                                id="country"
                                v-model="country"
                                :class="{ 'p-invalid': errors.country }"
                                placeholder="e.g. Sweden"
                            />
                            <div class="h-5">
                                <small
                                    v-if="errors.country"
                                    class="text-red-500"
                                    >{{ errors.country }}</small
                                >
                            </div>
                        </div>

                        <div class="flex justify-between gap-2 pt-4">
                            <Button
                                variant="text"
                                @click.stop="activateCallback('1')"
                            >
                                <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
                                <span>Back</span>
                            </Button>
                            <div class="flex gap-2">
                                <Button
                                    variant="text"
                                    @click.prevent.stop="emit('cancel')"
                                    :disabled="loading"
                                >
                                    <span>Cancel</span>
                                </Button>
                                <Button
                                    :loading="loading"
                                    @click.stop="onSubmit"
                                >
                                    <span>{{ isEdit ? 'Update Event' : 'Create Event' }}</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </StepPanel>
            </StepPanels>
        </Stepper>
    </div>
</template>
