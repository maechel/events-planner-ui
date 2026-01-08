<script setup lang="ts">
import { API_ENDPOINTS } from '@/constants/api';
import { ToastSeverity } from '@/constants/ui';
import { ref, computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import api from '@/api/axios';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Message from 'primevue/message';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import { loginSchema, registerSchema, loginInitialValues, registerInitialValues } from '@/schemas/auth';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';
import type { AxiosError } from 'axios';

type PropTypes = {
    visible: boolean;
    initialMode?: 'login' | 'register';
};

type EmitTypes = {
    'update:visible': [value: boolean];
};

const props = withDefaults(defineProps<PropTypes>(), {
    initialMode: 'login',
});

const emit = defineEmits<EmitTypes>();

const toast = useToast();
const authStore = useAuthStore();
const mode = ref<'login' | 'register'>(props.initialMode);
const loading = ref(false);

const isVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value),
});

watch(isVisible, (newVal) => {
    if (newVal) {
        mode.value = props.initialMode;
    } else {
        resetLoginForm();
        resetRegisterForm();
    }
});

// Form for Login
const {
    errors: loginErrors,
    defineField: defineLoginField,
    resetForm: resetLoginForm,
    meta: loginMeta,
    validate: validateLogin,
} = useForm({
    validationSchema: loginSchema,
    initialValues: loginInitialValues,
});

const [username] = defineLoginField('username');
const [password] = defineLoginField('password');

// Form for Register
const {
    errors: registerErrors,
    defineField: defineRegisterField,
    handleSubmit: handleRegisterSubmit,
    resetForm: resetRegisterForm,
    meta: registerMeta,
} = useForm({
    validationSchema: registerSchema,
    initialValues: registerInitialValues,
});

const [regUsername] = defineRegisterField('username');
const [regEmail] = defineRegisterField('email');
const [regPassword] = defineRegisterField('password');
const [regConfirmPassword] = defineRegisterField('confirmPassword');

const toggleMode = () => {
    mode.value = mode.value === 'login' ? 'register' : 'login';
    resetLoginForm();
    resetRegisterForm();
};

const onLogin = async () => {
    const { valid } = await validateLogin();
    if (!valid) {
        return;
    }

    loading.value = true;
    try {
        console.log('Attempting login with:', username.value);
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
            username: username.value,
            password: password.value,
        });

        console.log('Server responded:', response.status, response.data);

        // If the server doesn't return a token in the login response,
        // it might be using HttpOnly cookies or session-based auth.
        // We'll proceed to fetch the user to confirm session validity.

        const { token } = response.data;
        if (token) {
            console.log('Token found in response, updating store...');
            authStore.setToken(token);
        } else {
            console.log('No token in login response, checking for session/cookies...');
        }

        // Always fetch a user profile after login to populate the store
        console.log('Fetching user profile...');
        await authStore.fetchUser();
        console.log('User profile loaded:', authStore.user);

        console.log('Closing modal and showing toast...');
        isVisible.value = false;
        toast.add({
            severity: ToastSeverity.SUCCESS,
            summary: 'Success',
            detail: 'Logged in successfully',
            life: 3000,
        });
    } catch (error) {
        console.error('Detailed Login Error:', error);
        const axiosError = error as AxiosError<{ message: string }>;

        let message = 'An unexpected error occurred. Please try again.';

        if (axiosError.response) {
            // Server responded with a status code outside the 2xx range
            switch (axiosError.response.status) {
                case 401:
                    message = 'Invalid username or password. Please check your credentials.';
                    break;
                case 403:
                    message = 'You do not have permission to access this resource.';
                    break;
                case 404:
                    message = 'Authentication service not found. Please contact support.';
                    break;
                case 500:
                    message = 'The server encountered an error. Please try again later.';
                    break;
                default:
                    message = axiosError.response.data?.message || 'Login failed. Please try again.';
            }
        } else if (axiosError.request) {
            // Request was made but no response was received
            message = 'Cannot connect to the server. Please check your internet connection.';
        } else {
            // Something happened in setting up the request that triggered an Error
            message = axiosError.message;
        }

        toast.add({
            severity: ToastSeverity.ERROR,
            summary: 'Login Failed',
            detail: message,
            life: 5000,
        });
    } finally {
        loading.value = false;
    }
};

const onRegister = handleRegisterSubmit(async (values) => {
    loading.value = true;
    try {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, values);
        toast.add({
            severity: ToastSeverity.SUCCESS,
            summary: 'Success',
            detail: 'Account created successfully! You can now log in.',
            life: 5000,
        });
        mode.value = 'login';
        resetLoginForm();
        console.log('Register success:', response.data);
    } catch (error) {
        console.error('Register error:', error);
        const axiosError = error as AxiosError<{ message: string }>;

        let message = 'Could not create account. Please try again.';

        if (axiosError.response) {
            switch (axiosError.response.status) {
                case 409:
                    message = 'This username or email is already taken.';
                    break;
                case 400:
                    message = 'Please check the information you provided and try again.';
                    break;
                case 500:
                    message = 'The server encountered an error. Please try again later.';
                    break;
                default:
                    message = axiosError.response.data?.message || 'Registration failed.';
            }
        } else if (axiosError.request) {
            message = 'Cannot connect to the server. Please check your internet connection.';
        }

        toast.add({ severity: ToastSeverity.ERROR, summary: 'Registration Failed', detail: message, life: 5000 });
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <Dialog
        v-model:visible="isVisible"
        modal
        :header="mode === 'login' ? 'Login' : 'Register'"
        :style="{ width: '40rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
        <form
            v-if="mode === 'login'"
            @submit.prevent="onLogin"
            class="flex flex-col gap-2 mt-4"
        >
            <div class="flex flex-col gap-1 min-h-22">
                <label
                    for="username"
                    class="font-semibold text-sm text-surface-600 dark:text-surface-400"
                    >Username</label
                >
                <IconField>
                    <InputIcon>
                        <FontAwesomeIcon icon="fa-solid fa-user" />
                    </InputIcon>
                    <InputText
                        id="username"
                        v-model="username"
                        :invalid="!!loginErrors.username"
                        autocomplete="username"
                        class="w-full h-11"
                        placeholder="Enter your username"
                    />
                </IconField>
                <div class="h-5">
                    <Message
                        v-if="loginErrors.username"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ loginErrors.username }}
                    </Message>
                </div>
            </div>

            <div class="flex flex-col gap-1 min-h-22">
                <label
                    for="password"
                    class="font-semibold text-sm text-surface-600 dark:text-surface-400"
                    >Password</label
                >
                <IconField>
                    <InputIcon>
                        <FontAwesomeIcon icon="fa-solid fa-lock" />
                    </InputIcon>
                    <Password
                        id="password"
                        v-model="password"
                        :invalid="!!loginErrors.password"
                        :feedback="false"
                        toggleMask
                        autocomplete="current-password"
                        class="w-full"
                        :dt="{
                            pcInputText: {
                                root: 'w-full h-11',
                            },
                        }"
                        input-class="w-full"
                        placeholder="Enter your password"
                    />
                </IconField>
                <div class="h-5">
                    <Message
                        v-if="loginErrors.password"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ loginErrors.password }}
                    </Message>
                </div>
            </div>

            <Button
                type="submit"
                :label="loading ? 'Logging in...' : 'Login'"
                :loading="loading"
                :disabled="!loginMeta.valid"
                class="mt-4 w-full h-11 bg-primary border-primary hover:bg-primary-emphasis text-white"
            />

            <div class="text-center text-sm text-surface-500 mt-2">
                Don't have an account?
                <Button
                    type="button"
                    @click="toggleMode"
                    variant="text"
                    class="p-0 font-bold ml-1 text-primary hover:underline"
                    >Register
                </Button>
            </div>
        </form>

        <form
            v-else
            @submit.prevent="onRegister"
            class="flex flex-col gap-2 mt-4"
        >
            <div class="flex flex-col gap-1 min-h-22">
                <label
                    for="reg-username"
                    class="font-semibold text-sm text-surface-600 dark:text-surface-400"
                    >Username</label
                >
                <IconField>
                    <InputIcon>
                        <FontAwesomeIcon icon="fa-solid fa-user" />
                    </InputIcon>
                    <InputText
                        id="reg-username"
                        v-model="regUsername"
                        :invalid="!!registerErrors.username"
                        autocomplete="username"
                        class="w-full h-11"
                        placeholder="Choose a username"
                    />
                </IconField>
                <div class="h-5">
                    <Message
                        v-if="registerErrors.username"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ registerErrors.username }}
                    </Message>
                </div>
            </div>

            <div class="flex flex-col gap-1 min-h-22">
                <label
                    for="reg-email"
                    class="font-semibold text-sm text-surface-600 dark:text-surface-400"
                    >Email</label
                >
                <IconField>
                    <InputIcon>
                        <FontAwesomeIcon icon="fa-solid fa-envelope" />
                    </InputIcon>
                    <InputText
                        id="reg-email"
                        v-model="regEmail"
                        :invalid="!!registerErrors.email"
                        autocomplete="email"
                        class="w-full h-11"
                        placeholder="Enter your email"
                    />
                </IconField>
                <div class="h-5">
                    <Message
                        v-if="registerErrors.email"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ registerErrors.email }}
                    </Message>
                </div>
            </div>

            <div class="flex flex-col gap-1 min-h-22">
                <label
                    for="reg-password"
                    class="font-semibold text-sm text-surface-600 dark:text-surface-400"
                    >Password</label
                >
                <IconField>
                    <InputIcon>
                        <FontAwesomeIcon icon="fa-solid fa-lock" />
                    </InputIcon>
                    <Password
                        id="reg-password"
                        v-model="regPassword"
                        :invalid="!!registerErrors.password"
                        toggleMask
                        autocomplete="new-password"
                        class="w-full"
                        :dt="{
                            pcInputText: {
                                root: 'w-full h-11',
                            },
                        }"
                        input-class="w-full"
                        placeholder="Create a password"
                    />
                </IconField>
                <div class="h-5">
                    <Message
                        v-if="registerErrors.password"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ registerErrors.password }}
                    </Message>
                </div>
            </div>

            <div class="flex flex-col gap-1 min-h-22">
                <label
                    for="reg-confirm-password"
                    class="font-semibold text-sm text-surface-600 dark:text-surface-400"
                    >Confirm Password</label
                >
                <IconField>
                    <InputIcon>
                        <FontAwesomeIcon icon="fa-solid fa-check-double" />
                    </InputIcon>
                    <Password
                        id="reg-confirm-password"
                        v-model="regConfirmPassword"
                        :invalid="!!registerErrors.confirmPassword"
                        :feedback="false"
                        toggleMask
                        autocomplete="new-password"
                        class="w-full"
                        :dt="{
                            pcInputText: {
                                root: 'w-full h-11',
                            },
                        }"
                        input-class="w-full"
                        placeholder="Confirm your password"
                    />
                </IconField>
                <div class="h-5">
                    <Message
                        v-if="registerErrors.confirmPassword"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ registerErrors.confirmPassword }}
                    </Message>
                </div>
            </div>

            <Button
                type="submit"
                :label="loading ? 'Registering...' : 'Register'"
                :loading="loading"
                :disabled="!registerMeta.valid"
                class="mt-4 w-full h-11 bg-primary border-primary hover:bg-primary-emphasis text-white"
            />

            <div class="text-center text-sm text-surface-500 mt-2">
                Already have an account?
                <Button
                    type="button"
                    @click="toggleMode"
                    variant="text"
                    class="p-0 font-bold ml-1 text-primary hover:underline"
                    >Login
                </Button>
            </div>
        </form>
    </Dialog>
</template>

<style scoped>
:deep(.p-password input) {
    width: 100%;
}
</style>
