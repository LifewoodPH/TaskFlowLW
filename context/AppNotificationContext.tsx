import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';
import * as dataService from '../services/supabaseService';

export interface AppNotification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string;
    target_id: string | null;
    is_read: boolean;
    created_at: string;
}

interface AppNotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    loading: boolean;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const AppNotificationContext = createContext<AppNotificationContextType | undefined>(undefined);

export const AppNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const data = await dataService.getNotifications(user.employeeId);
            setNotifications(data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();

            // Set up real-time subscription
            const subscription = supabase
                .channel(`user_notifications_${user.employeeId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.employeeId}`,
                    },
                    (payload) => {
                        setNotifications((prev) => [payload.new as AppNotification, ...prev]);
                    }
                )
                .subscribe();

            return () => {
                subscription.unsubscribe();
            };
        } else {
            setNotifications([]);
            setLoading(false);
        }
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            await dataService.markNotificationAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.employeeId)
                .eq('is_read', false);

            if (error) throw error;

            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <AppNotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                markAsRead,
                markAllAsRead,
            }}
        >
            {children}
        </AppNotificationContext.Provider>
    );
};

export const useAppNotifications = () => {
    const context = useContext(AppNotificationContext);
    if (context === undefined) {
        throw new Error('useAppNotifications must be used within an AppNotificationProvider');
    }
    return context;
};
