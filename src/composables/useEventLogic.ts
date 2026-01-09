import { computed, type Ref } from 'vue';
import { addDays, isAfter, isBefore, parseISO, format, startOfDay } from 'date-fns';
import type { EventSummary } from '@/types/events';
import type { TaskSummary } from '@/types/tasks';
import type { UserDetail } from '@/types/users';
import type { EntityId } from '@/types/common';
import { getUrgencySeverity } from '@/utils/formatters';

export function useEventLogic(events: Ref<EventSummary[]>, tasks: Ref<TaskSummary[]>, user: Ref<UserDetail | null>) {
    const upcomingEvents = computed(() => {
        const today = startOfDay(new Date());
        return events.value
            .filter((e) => !isBefore(parseISO(e.date), today))
            .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
    });

    const passedEvents = computed(() => {
        const today = startOfDay(new Date());
        return events.value
            .filter((e) => isBefore(parseISO(e.date), today))
            .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    });

    const eventsInComingYear = computed(() => {
        const now = new Date();
        const nextYear = addDays(now, 365);
        return events.value
            .filter((e) => {
                const date = parseISO(e.date);
                return isAfter(date, now) && isBefore(date, nextYear);
            })
            .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
    });

    const eventsByMonth = computed(() => {
        const months: Record<string, number> = {};
        events.value.forEach((e) => {
            const date = parseISO(e.date);
            const key = format(date, 'yyyy-MM');
            months[key] = (months[key] || 0) + 1;
        });
        return months;
    });

    const nearingDueTasks = computed(() => {
        const now = new Date();
        const nextWeek = addDays(now, 7);

        const nearingTasks: { eventTitle: string; eventId: EntityId; task: TaskSummary }[] = [];

        tasks.value.forEach((t) => {
            if (!t.completed && t.dueDate) {
                const dueDate = parseISO(t.dueDate);
                if (isAfter(dueDate, now) && isBefore(dueDate, nextWeek)) {
                    const event = events.value.find((e) => String(e.id) === String(t.eventId));
                    nearingTasks.push({
                        eventTitle: event?.title || 'Unknown Event',
                        eventId: t.eventId!,
                        task: t,
                    });
                }
            }
        });

        return nearingTasks.sort((a, b) => {
            return parseISO(a.task.dueDate!).getTime() - parseISO(b.task.dueDate!).getTime();
        });
    });

    const stats = computed(() => {
        return {
            totalEvents: events.value.length,
            totalTasks: tasks.value.length,
            completedTasks: tasks.value.filter((t) => t.completed).length,
            participantsPerEvent: events.value.map((e) => ({
                title: e.title,
                count: e.participantCount ?? 0,
            })),
        };
    });

    const currentUserUnfinishedTaskCount = computed(() => {
        const userId = user.value?.id;
        if (!userId) return 0;

        return tasks.value.filter((t) => String(t.assignedToId) === String(userId) && !t.completed).length;
    });

    const currentUserTasksUrgencySeverity = computed(() => {
        const userId = user.value?.id;
        if (!userId) return 'secondary';

        const userTasks = tasks.value.filter((t) => String(t.assignedToId) === String(userId) && !t.completed);
        if (userTasks.length === 0) return 'secondary';

        const severities = userTasks.map((t) => getUrgencySeverity(t.dueDate));

        if (severities.includes('danger')) return 'danger';
        if (severities.includes('warn')) return 'warn';
        return 'info';
    });

    return {
        upcomingEvents,
        passedEvents,
        eventsInComingYear,
        eventsByMonth,
        nearingDueTasks,
        stats,
        currentUserUnfinishedTaskCount,
        currentUserTasksUrgencySeverity,
    };
}
