import React, { useState, useEffect } from 'react';
import { Task, Priority } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface DailyStandupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveConfig: (tasks: Partial<Task>[]) => void;
    departmentName: string;
}

const DailyStandupModal: React.FC<DailyStandupModalProps> = ({ isOpen, onClose, onSaveConfig, departmentName }) => {
    const [tasks, setTasks] = useState<{ title: string, priority: Priority }[]>([
        { title: '', priority: Priority.HIGH },
        { title: '', priority: Priority.MEDIUM },
        { title: '', priority: Priority.MEDIUM }
    ]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShow(true), 10);
        } else {
            setShow(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleTaskChange = (index: number, field: 'title' | 'priority', value: string) => {
        const newTasks = [...tasks];
        newTasks[index] = { ...newTasks[index], [field]: value };
        setTasks(newTasks);
    };

    const handleAddTaskRow = () => {
        setTasks([...tasks, { title: '', priority: Priority.MEDIUM }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validTasks = tasks.filter(t => t.title.trim() !== '').map(t => ({
            title: t.title,
            priority: t.priority,
            status: 'To Do',
            description: 'Added via Daily Standup',
            subtasks: [],
            tags: ['daily-planning'],
            dueDate: new Date().toISOString()
        }));

        if (validTasks.length > 0) {
            onSaveConfig(validTasks as any);
        } else {
            onClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-all duration-300 ${show ? 'visible' : 'invisible'}`}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${show ? 'opacity-70' : 'opacity-0'}`}
            // Prevent closing by clicking outside to enforce flow? Or allow skip?
            // Let's allow skip for UX but user requested "Welcome with a task"
            />

            <div
                className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl p-8 transition-all duration-500 relative z-10 transform ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <SparklesIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Welcome to {departmentName}
                    </h2>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-8 ml-11">
                    Let's start your day. What are your main priorities?
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {tasks.map((task, idx) => (
                        <div key={idx} className="flex gap-3 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => handleTaskChange(idx, 'title', e.target.value)}
                                    placeholder={`Priority Task #${idx + 1}`}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 placeholder-slate-400 dark:text-white transition-all shadow-inner"
                                    autoFocus={idx === 0}
                                />
                            </div>
                            <div className="w-32">
                                <select
                                    value={task.priority}
                                    onChange={(e) => handleTaskChange(idx, 'priority', e.target.value as Priority)}
                                    className="w-full h-full px-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 dark:text-white cursor-pointer"
                                >
                                    <option value={Priority.HIGH}>High</option>
                                    <option value={Priority.MEDIUM}>Medium</option>
                                    <option value={Priority.LOW}>Low</option>
                                </select>
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={handleAddTaskRow} className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline pl-1">
                        + Add another task
                    </button>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Skip
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:transform hover:scale-105 transition-all duration-200"
                        >
                            Start My Day
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DailyStandupModal;
