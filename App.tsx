
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import StudioBridge from './components/StudioBridge';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import { ROADMAP_DATA } from './constants';
import { AppView, User, Tier } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Tier>('free');
  
  const [view, setView] = useState<AppView>('roadmap');
  const [currentDay, setCurrentDay] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [activePrompt, setActivePrompt] = useState<string | undefined>(undefined);

  // Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('ai_gp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setShowLanding(false);
    }
    const savedTasks = localStorage.getItem('ai_gp_completed_tasks');
    if (savedTasks) {
      setCompletedTasks(JSON.parse(savedTasks));
    }
  }, []);

  const handleAuth = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('ai_gp_user', JSON.stringify(newUser));
    setShowAuthModal(false);
    setShowLanding(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ai_gp_user');
    setShowLanding(true);
  };

  const openAuth = (tier: Tier) => {
    setSelectedTier(tier);
    setShowAuthModal(true);
  };

  const toggleTask = (taskId: string) => {
    const newTasks = completedTasks.includes(taskId) 
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];
    
    setCompletedTasks(newTasks);
    localStorage.setItem('ai_gp_completed_tasks', JSON.stringify(newTasks));
  };

  const totalTasks = ROADMAP_DATA.reduce((acc, day) => acc + day.tasks.length, 0);

  if (showLanding) {
    return (
      <>
        <LandingPage onGetStarted={openAuth} />
        {showAuthModal && (
          <AuthModal 
            onAuth={handleAuth} 
            onClose={() => setShowAuthModal(false)} 
            defaultTier={selectedTier} 
          />
        )}
      </>
    );
  }

  const dayData = ROADMAP_DATA.find(d => d.day === currentDay)!;

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-100 selection:bg-indigo-500/30">
      <Sidebar 
        currentDay={currentDay} 
        setCurrentDay={setCurrentDay} 
        view={view}
        setView={setView}
        completedTasksCount={completedTasks.length}
        totalTasksCount={totalTasks}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {view === 'roadmap' ? (
            <div className="p-8">
              <header className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-widest">
                    Day {dayData.day} / 5
                  </div>
                  <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                    Beta Feedback Integrated
                  </div>
                </div>
                <h2 className="text-4xl font-extrabold mb-2 tracking-tight">{dayData.title}</h2>
                <p className="text-xl text-slate-400 font-medium mb-4">{dayData.subtitle}</p>
                <div className="p-4 bg-indigo-500/5 border-l-4 border-indigo-500 text-slate-300 rounded-r-lg max-w-2xl">
                  {dayData.description}
                </div>
              </header>

              <div className="grid gap-6 max-w-4xl">
                {dayData.tasks.map((task) => {
                  const isBetaTask = task.category === "Beta Testing";
                  return (
                    <div 
                      key={task.id}
                      className={`group p-6 rounded-2xl border transition-all duration-300 ${
                        completedTasks.includes(task.id) 
                          ? 'bg-slate-800/40 border-emerald-500/30 opacity-80 shadow-inner' 
                          : isBetaTask 
                            ? 'bg-amber-900/5 border-amber-500/30 hover:border-amber-500/60 shadow-xl'
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500 shadow-xl'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                              completedTasks.includes(task.id) 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : isBetaTask
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-slate-700 text-slate-400'
                            }`}>
                              {task.category}
                            </span>
                          </div>
                          <h4 className={`text-lg font-bold mb-1 ${completedTasks.includes(task.id) ? 'text-slate-400 line-through' : ''}`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            {task.description}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => toggleTask(task.id)}
                              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                                completedTasks.includes(task.id)
                                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                  : isBetaTask
                                    ? 'bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-600/20'
                                    : 'bg-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white'
                              }`}
                            >
                              {completedTasks.includes(task.id) ? '✓ Completed' : 'Mark Done'}
                            </button>
                            <button 
                              onClick={() => setActivePrompt(task.aiPrompt)}
                              className={`text-sm font-semibold flex items-center gap-2 ${
                                isBetaTask ? 'text-amber-400 hover:text-amber-300' : 'text-indigo-400 hover:text-indigo-300'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Generate Code
                            </button>
                          </div>
                        </div>
                        <div className={`p-3 rounded-full border ${
                          completedTasks.includes(task.id) 
                            ? 'bg-slate-900 border-emerald-500/30' 
                            : isBetaTask 
                              ? 'bg-amber-950 border-amber-500/30'
                              : 'bg-slate-900 border-slate-700'
                        }`}>
                          {completedTasks.includes(task.id) ? (
                              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                          ) : (
                              <svg className={`w-6 h-6 ${isBetaTask ? 'text-amber-500' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <StudioBridge tier={user?.tier} />
          )}
        </div>

        {/* AI Assistant Panel */}
        <aside className="w-full md:w-96 lg:w-[450px] p-4 md:p-6 bg-slate-900/50 h-[50vh] md:h-full border-l border-slate-800">
          <ChatInterface 
            initialPrompt={activePrompt} 
            onPromptClear={() => setActivePrompt(undefined)} 
          />
        </aside>
      </main>
    </div>
  );
};

export default App;
