<script setup lang="ts">
import pkg from '../../../package.json';

defineOptions({
    inheritAttrs: false,
});

const version = pkg.version;
</script>

<template>
    <slot
        name="version"
        :version="version"
    >
        <span
            v-bind="$attrs"
            class="font-mono text-sm inline-block px-1"
            >v{{ version }}</span
        >
    </slot>
</template>
