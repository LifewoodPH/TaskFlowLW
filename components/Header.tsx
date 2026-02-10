
import React from 'react';
import { User } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ViewColumnsIcon } from './icons/ViewColumnsIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeSpace: string;
  currentView: string;
  onViewChange: (view: any) => void;
  onGenerateTasks: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  user: User;
}

const Header: React.FC<HeaderProps> = ({
  activeSpace,
  currentView,
  onViewChange,
  onGenerateTasks,
  searchTerm,
  onSearchChange,
  user
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-24 flex items-center justify-between px-8 sticky top-0 z-40 transition-all duration-500">
      <div className="absolute inset-x-8 top-4 bottom-4 bg-white/10 dark:bg-black/20 backdrop-blur-[40px] border border-white/20 dark:border-white/5 rounded-[24px] shadow-2xl shadow-black/5 dark:shadow-black/20"></div>

      {/* Left: Breadcrumbs & Views */}
      <div className="flex items-center gap-8 relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest mb-0.5">Workspace</span>
          <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">{activeSpace}</span>
        </div>

        <div className="h-10 w-px bg-white/10 mx-2 hidden md:block"></div>

        <nav className="flex items-center gap-1.5 p-1 bg-black/10 dark:bg-black/20 backdrop-blur-md border border-white/5 rounded-[18px]">
          {user.role === 'admin' && (
            <button
              onClick={() => onViewChange('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${currentView === 'dashboard' ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg shadow-slate-200 dark:shadow-white/10' : 'text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              <div className="w-4 h-4"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></div>
              <span className="hidden sm:inline">Overview</span>
            </button>
          )}

          <button
            onClick={() => onViewChange('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${currentView === 'list' ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg shadow-slate-200 dark:shadow-white/10' : 'text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <ListBulletIcon className="w-4 h-4 stroke-[2.5px]" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => onViewChange('board')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${currentView === 'board' ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg shadow-slate-200 dark:shadow-white/10' : 'text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <ViewColumnsIcon className="w-4 h-4 stroke-[2.5px]" />
            <span className="hidden sm:inline">Board</span>
          </button>
          <button
            onClick={() => onViewChange('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${currentView === 'calendar' ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg shadow-slate-200 dark:shadow-white/10' : 'text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            <CalendarIcon className="w-4 h-4 stroke-[2.5px]" />
            <span className="hidden sm:inline">Calendar</span>
          </button>
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 relative z-10">
        {/* Search - Only show in workspace views */}
        {['list', 'board', 'calendar'].includes(currentView) && (
          <div className="relative group hidden lg:block">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-white/30 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-white/10 w-64 transition-all duration-300"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 text-slate-400 dark:text-white/30 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all duration-300 border border-transparent hover:border-black/5 dark:hover:border-white/10"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>

          {/* AI Action - Only show in workspace views */}
          {['list', 'board', 'calendar'].includes(currentView) && (
            <button
              onClick={onGenerateTasks}
              className="p-3 text-slate-400 dark:text-white/30 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-all duration-300 border border-transparent hover:border-black/5 dark:hover:border-white/10"
              title="AI Generate Tasks"
            >
              <SparklesIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
