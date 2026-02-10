import React from 'react';
import { useAppNotifications, AppNotification } from '../context/AppNotificationContext';
import { XMarkIcon } from './icons/XMarkIcon';
import { BellIcon } from './icons/BellIcon';
import { formatDistanceToNow } from 'date-fns';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
    const { notifications, markAsRead, markAllAsRead } = useAppNotifications();

    if (!isOpen) return null;

    const groupNotifications = () => {
        const today: AppNotification[] = [];
        const yesterday: AppNotification[] = [];
        const older: AppNotification[] = [];

        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;

        notifications.forEach(n => {
            const date = new Date(n.created_at);
            const diff = now.getTime() - date.getTime();

            if (diff < oneDay) today.push(n);
            else if (diff < 2 * oneDay) yesterday.push(n);
            else older.push(n);
        });

        return { today, yesterday, older };
    };

    const sections = groupNotifications();

    const renderNotification = (n: AppNotification) => (
        <div
            key={n.id}
            onClick={() => !n.is_read && markAsRead(n.id)}
            className={`p-4 border-b border-black/5 dark:border-white/5 transition-all cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 ${!n.is_read ? 'bg-lime-500/5 dark:bg-[#CEFD4A]/5' : ''}`}
        >
            <div className="flex items-start gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.is_read ? 'bg-lime-500 dark:bg-[#CEFD4A]' : 'bg-transparent'}`}></div>
                <div className="flex-1">
                    <h4 className={`text-sm font-bold ${!n.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/40'}`}>
                        {n.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5 line-clamp-2">
                        {n.message}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-tighter mt-1 block">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] z-[90] transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            <div className="fixed inset-y-0 right-0 w-[400px] bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-2xl shadow-2xl z-[100] border-l border-black/10 dark:border-white/10 flex flex-col transform transition-transform duration-500 ease-out animate-in slide-in-from-right pointer-events-auto">
                {/* Header */}
                <div className="p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Notifications</h2>
                        <p className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mt-0.5">Your Activity Feed</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all"
                    >
                        <XMarkIcon className="w-6 h-6 text-slate-500 dark:text-white/60" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {notifications.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-40">
                            <BellIcon className="w-16 h-16 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">All caught up!</h3>
                            <p className="text-sm">No new notifications for you right now.</p>
                        </div>
                    ) : (
                        <>
                            {sections.today.length > 0 && (
                                <div>
                                    <div className="px-6 py-3 bg-slate-50/50 dark:bg-white/5 border-b border-black/5 dark:border-white/5 text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Today</div>
                                    {sections.today.map(renderNotification)}
                                </div>
                            )}
                            {sections.yesterday.length > 0 && (
                                <div>
                                    <div className="px-6 py-3 bg-slate-50/50 dark:bg-white/5 border-b border-black/5 dark:border-white/5 text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Yesterday</div>
                                    {sections.yesterday.map(renderNotification)}
                                </div>
                            )}
                            {sections.older.length > 0 && (
                                <div>
                                    <div className="px-6 py-3 bg-slate-50/50 dark:bg-white/5 border-b border-black/5 dark:border-white/5 text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Older</div>
                                    {sections.older.map(renderNotification)}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {notifications.some(n => !n.is_read) && (
                    <div className="p-6 border-t border-black/10 dark:border-white/10">
                        <button
                            onClick={markAllAsRead}
                            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
                        >
                            Mark All as Read
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationPanel;
