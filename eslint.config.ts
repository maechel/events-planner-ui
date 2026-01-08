import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        ignores: ['dist/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            globals: globals.browser,
        },
    },
    tseslint.configs.recommended,
    pluginVue.configs['flat/essential'],
    {
        files: ['**/*.{ts,vue}'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {
            'no-undef': 'off',
            'vue/multi-word-component-names': 'off',
            'vue/no-reserved-component-names': 'off',
        },
    },
]);
