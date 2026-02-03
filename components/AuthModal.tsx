
import React, { useState } from 'react';
import { Tier, User } from '../types';

interface AuthModalProps {
  onAuth: (user: User) => void;
  onClose: () => void;
  defaultTier: Tier;
}

const AuthModal: React.FC<AuthModalProps> = ({ onAuth, onClose, defaultTier }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    // Simulate auth
    onAuth({
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      tier: defaultTier
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black">{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="John Doe" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="john@example.com" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-black text-white shadow-xl shadow-indigo-500/20 transition-all mt-4">
              {isLogin ? 'Sign In' : 'Create Production Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
        
        <div className="bg-slate-800/50 px-8 py-4 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Selected Tier:</span>
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
            defaultTier === 'pro' ? 'bg-indigo-500 text-white' : 
            defaultTier === 'enterprise' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-400'
          }`}>
            {defaultTier}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
