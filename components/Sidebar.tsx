
import React from 'react';
import { AppView, User } from '../types';

interface SidebarProps {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  view: AppView;
  setView: (view: AppView) => void;
  completedTasksCount: number;
  totalTasksCount: number;
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentDay, 
  setCurrentDay, 
  view, 
  setView, 
  completedTasksCount, 
  totalTasksCount,
  user,
  onLogout
}) => {
  const days = [1, 2, 3, 4, 5];
  const progressPercentage = (completedTasksCount / totalTasksCount) * 100;

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 h-screen flex flex-col p-6 sticky top-0">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
            GP
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">AI-GP</h1>
            <p className="text-xs text-slate-400">Studio to Production</p>
          </div>
        </div>
      </div>

      <div className="flex p-1 bg-slate-800 rounded-xl mb-8">
        <button 
          onClick={() => setView('roadmap')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${view === 'roadmap' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          ROADMAP
        </button>
        <button 
          onClick={() => setView('bridge')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${view === 'bridge' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
        >
          BRIDGE
        </button>
      </div>

      <nav className={`flex-1 space-y-2 transition-opacity ${view === 'bridge' ? 'opacity-30 pointer-events-none' : ''}`}>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Production Steps</p>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setCurrentDay(day)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
              currentDay === day
                ? 'bg-indigo-600/10 border border-indigo-500/50 text-indigo-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              currentDay === day ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-700 bg-slate-800'
            }`}>
              {day}
            </div>
            <div className="text-left">
              <p className="font-medium">Day {day}</p>
            </div>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-6">
        <div className="pt-6 border-t border-slate-800">
          <div className="mb-2 flex justify-between items-end">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Milestones</span>
            <span className="text-sm font-bold text-indigo-400">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {user && (
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                {user.name[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate">{user.name}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded leading-none ${
                    user.tier === 'pro' ? 'bg-indigo-500/20 text-indigo-400' : 
                    user.tier === 'enterprise' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {user.tier}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full py-2 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:text-red-400 hover:bg-red-400/5 border border-transparent hover:border-red-400/20 transition-all"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
