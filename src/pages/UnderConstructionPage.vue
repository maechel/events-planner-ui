<script setup lang="ts">
import UnderConstruction from '@/components/common/UnderConstruction.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const featureInfo = computed(() => {
    return {
        title: route.meta.title as string | undefined,
        description: route.meta.description as string | undefined,
        quarter: route.meta.quarter as string | undefined,
    };
});
</script>

<template>
    <div class="min-h-[80vh] flex items-center justify-center">
        <UnderConstruction
            :title="featureInfo.title"
            :description="featureInfo.description"
            :quarter="featureInfo.quarter"
        />
    </div>
</template>
