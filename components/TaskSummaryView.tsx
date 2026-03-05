import React from 'react';
import { Task, Employee, TaskStatus } from '../types';
import { isTaskOverdue } from '../utils/taskUtils';

interface TaskSummaryViewProps {
    tasks: Task[];
    employees: Employee[];
    onViewTask?: (task: Task) => void;
}

const TaskSummaryView: React.FC<TaskSummaryViewProps> = ({ tasks, employees, onViewTask }) => {
    // Group tasks by assigneeId, excluding completed tasks
    const tasksByUser = employees.map(emp => {
        const activeTasks = tasks.filter(t => (t.assigneeIds?.includes(emp.id) || t.assigneeId === emp.id) && t.status !== TaskStatus.DONE);
        return {
            employee: emp,
            userTasks: activeTasks
        };
    }).filter(group => group.userTasks.length > 0 || group.employee.id); // Keep all employees even if 0 tasks (based on existing logic, or you could filter them out)

    return (
        <div className="h-full flex flex-col bg-white/60 dark:bg-black/40 backdrop-blur-[40px] border border-white/40 dark:border-white/5 shadow-xl shadow-black/5 dark:shadow-none rounded-[32px] overflow-hidden animate-fade-in p-8">
            <div className="mb-6">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Task Summary</h2>
                <p className="text-sm font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Overview of all tasks by user</p>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 scrollbar-none pr-4 pb-4">
                {tasksByUser.map(({ employee, userTasks }) => (
                    <div key={employee.id} className="bg-white/50 dark:bg-white/5 rounded-[24px] p-6 border border-white/40 dark:border-white/5 shadow-sm flex flex-col">
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-black/5 dark:border-white/5 shrink-0">
                            <img src={employee.avatarUrl} alt={employee.name} className="w-12 h-12 rounded-2xl object-cover bg-neutral-200 dark:bg-neutral-800" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{employee.name}</h3>
                                <p className="text-xs font-semibold text-slate-500 dark:text-white/40 uppercase tracking-wider">{userTasks.length} {userTasks.length === 1 ? 'Task' : 'Tasks'}</p>
                            </div>
                        </div>

                        {userTasks.length > 0 ? (
                            <div className="space-y-2">
                                {userTasks.map(task => {
                                    const overdue = isTaskOverdue(task);
                                    return (
                                        <div
                                            key={task.id}
                                            onClick={() => onViewTask && onViewTask(task)}
                                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/10"
                                        >
                                            <div className="flex-1 pr-4 mb-2 sm:mb-0">
                                                <h4 className={`font-semibold text-sm ${overdue ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {task.title}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {overdue && (
                                                    <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/20 shadow-sm">
                                                        Overdue
                                                    </span>
                                                )}
                                                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${task.status === TaskStatus.DONE
                                                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                    : task.status === TaskStatus.IN_PROGRESS
                                                        ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400'
                                                        : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/40'
                                                    }`}>
                                                    {task.status === TaskStatus.DONE ? 'Completed' : task.status === TaskStatus.IN_PROGRESS ? 'In P.' : 'To Do'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm font-medium text-slate-400 dark:text-white/40 italic">No tasks assigned.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskSummaryView;
