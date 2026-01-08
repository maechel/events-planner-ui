export const DATE_FORMATS = {
    DEFAULT: 'yyyy-MM-dd HH:mm',
    ISO_MONTH: 'yyyy-MM',
} as const;

export const URGENCY_THRESHOLDS = {
    DANGER_DAYS: 2,
    WARN_DAYS: 5,
} as const;

export const ToastSeverity = {
    SUCCESS: 'success',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    SECONDARY: 'secondary',
    CONTRAST: 'contrast',
} as const;

export type ToastSeverity = (typeof ToastSeverity)[keyof typeof ToastSeverity];
