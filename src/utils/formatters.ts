import { differenceInDays, parseISO } from 'date-fns';
import { URGENCY_THRESHOLDS } from '@/constants/ui';

export const getUrgencySeverity = (dateString?: string): 'danger' | 'warn' | 'info' | 'secondary' => {
    if (!dateString) return 'secondary';

    const days = differenceInDays(parseISO(dateString), new Date());
    if (days < 0) return 'secondary'; // Past date
    if (days < URGENCY_THRESHOLDS.DANGER_DAYS) return 'danger';
    if (days < URGENCY_THRESHOLDS.WARN_DAYS) return 'warn';
    return 'info';
};
