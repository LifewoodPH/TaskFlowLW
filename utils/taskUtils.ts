import { Task, TaskStatus } from '../types';

/**
 * Checks if a task is overdue based on its due date and due time.
 * A task is overdue if:
 * 1. It has a due date.
 * 2. It is not DONE.
 * 3. The current time is past the due date + due time (or 23:59:59 if no time is specified).
 */
export const isTaskOverdue = (task: Task): boolean => {
    if (!task.dueDate) return false;
    if (task.status === TaskStatus.DONE) return false;

    const now = new Date();

    // Create a date object for the deadline
    const deadline = new Date(task.dueDate);

    if (task.dueTime) {
        // If there's a specific time, parse it and set it
        const [hours, minutes] = task.dueTime.split(':').map(Number);
        deadline.setHours(hours, minutes, 0, 0);
    } else {
        // If there's no specific time, the deadline is the very end of that day (23:59:59.999)
        deadline.setHours(23, 59, 59, 999);
    }

    return now.getTime() > deadline.getTime();
};
