<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push('/');
};
</script>

<template>
    <div class="flex items-center justify-center min-h-[80vh] px-6">
        <div class="text-center">
            <p class="text-6xl font-semibold text-primary">404</p>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-0 sm:text-5xl">
                Page not found
            </h1>
            <p class="mt-6 text-base leading-7 text-surface-600 dark:text-surface-400">
                Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
                <Button
                    label="Go back home"
                    @click="goHome"
                    size="large"
                />
                <Button
                    label="Contact support"
                    variant="text"
                    size="large"
                />
            </div>
        </div>
    </div>
</template>
