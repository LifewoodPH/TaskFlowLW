import React from 'react';
import { Task, TaskStatus } from '../../types';

interface Props {
    tasks: Task[];
}

const statusConfig = {
    [TaskStatus.TODO]: { bg: 'bg-orange-500', name: 'To Do' },
    [TaskStatus.IN_PROGRESS]: { bg: 'bg-indigo-500', name: 'In Progress' },
    [TaskStatus.DONE]: { bg: 'bg-emerald-500', name: 'Done' },
};

export default function TaskStatusStackedBar({ tasks }: Props) {
    const totalTasks = tasks.length || 1;

    const counts = {
        [TaskStatus.TODO]: tasks.filter((t) => t.status === TaskStatus.TODO).length,
        [TaskStatus.IN_PROGRESS]: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
        [TaskStatus.DONE]: tasks.filter((t) => t.status === TaskStatus.DONE).length,
    };

    return (
        <div className="flex flex-col justify-center h-full gap-8 px-4">
            {/* The Legend */}
            <div className="grid grid-cols-3 gap-2 text-center">
                {Object.keys(statusConfig).map((status) => {
                    const count = counts[status as TaskStatus];
                    const cfg = statusConfig[status as TaskStatus];
                    return (
                        <div key={status} className="flex flex-col items-center">
                            <span className="text-[10px] items-center gap-1.5 font-bold text-slate-400 uppercase tracking-widest mb-1 flex">
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.bg}`} />
                                {cfg.name}
                            </span>
                            <span className="text-4xl font-black text-slate-800 dark:text-white">{count}</span>
                        </div>
                    );
                })}
            </div>

            {/* The Stacked Bar */}
            <div className="w-full h-3 rounded-full flex overflow-hidden bg-slate-100 dark:bg-white/5 shadow-inner">
                {Object.keys(statusConfig).map((status) => {
                    const count = counts[status as TaskStatus];
                    const percentage = (count / totalTasks) * 100;
                    if (percentage === 0) return null;
                    const cfg = statusConfig[status as TaskStatus];
                    return (
                        <div
                            key={status}
                            className={`h-full ${cfg.bg} transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
