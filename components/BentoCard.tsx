import React from 'react';
import { usePreferences } from './hooks/usePreferences';

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const BentoCard: React.FC<BentoCardProps> = ({ children, className = '', onClick }) => {
    const [preferences] = usePreferences();
    return (
        <div
            onClick={onClick}
            className={`bg-white/60 dark:bg-black/40 ${preferences.performanceMode ? 'backdrop-blur-none' : 'backdrop-blur-[40px]'} border border-white/40 dark:border-white/5 rounded-[32px] overflow-hidden transition-all duration-300 hover:border-white/60 dark:hover:border-white/20 shadow-xl shadow-black/5 dark:shadow-none ${className}`}
        >
            {children}
        </div>
    );
};

export default BentoCard;
