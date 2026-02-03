
import React from 'react';
import { Tier } from '../types';

interface LandingPageProps {
  onGetStarted: (tier: Tier) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
            GP
          </div>
          <span className="font-bold text-xl tracking-tight">AI-GP</span>
        </div>
        <div className="flex gap-6">
          <button onClick={() => onGetStarted('free')} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Login</button>
          <button onClick={() => onGetStarted('pro')} className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-500/30">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-8 max-w-7xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 mb-6 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-black uppercase tracking-widest animate-fade-in">
          The GitHub-to-Production Roadmap
        </div>
        <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-none bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent">
          Move your AI Studio <br /> prototypes to Production.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          The first AI Agent designed to scrub "vibe" logic, harden FastAPI backends, automate CI/CD, and deploy to OVHcloud VPS or Google Cloud.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button onClick={() => onGetStarted('pro')} className="bg-indigo-600 hover:bg-indigo-500 px-10 py-5 rounded-2xl text-lg font-black transition-all shadow-2xl shadow-indigo-500/40 hover:-translate-y-1">
            Start Free 5-Day Roadmap
          </button>
          <button className="flex items-center gap-3 px-8 py-5 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-all font-bold">
            <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            View GitHub Repo
          </button>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Flexible Subscription Tiers</h2>
            <p className="text-slate-400">Scale your AI agency with professional production tools.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/30 transition-all flex flex-col">
              <h3 className="text-xl font-bold mb-2">Free Learner</h3>
              <p className="text-slate-500 text-sm mb-6">Master the roadmap basics.</p>
              <div className="text-4xl font-black mb-8">$0<span className="text-sm font-normal text-slate-500"> / forever</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                {['5-Day Roadmap Access', 'Community Guides', 'Static Code Templates', 'Basic Beta Checklists'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => onGetStarted('free')} className="w-full py-4 rounded-xl border border-slate-700 font-bold hover:bg-slate-800 transition-all">Select Plan</button>
            </div>

            {/* Pro Tier */}
            <div className="bg-indigo-600 p-8 rounded-3xl shadow-2xl shadow-indigo-500/20 flex flex-col relative overflow-hidden transform scale-105">
              <div className="absolute top-0 right-0 bg-white text-indigo-600 text-[10px] font-black px-4 py-1 rotate-45 translate-x-4 translate-y-2 uppercase">Popular</div>
              <h3 className="text-xl font-bold mb-2">Pro Builder</h3>
              <p className="text-indigo-100/70 text-sm mb-6">Automated bridging for active developers.</p>
              <div className="text-4xl font-black mb-8">$29<span className="text-sm font-normal text-indigo-100/70"> / month</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Full AI Studio Bridge', 'Vertex AI Logic Generators', 'Pydantic Model Extraction', 'Vercel & Render Configs', 'Beta Telemetry Hooks'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white font-medium">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => onGetStarted('pro')} className="w-full py-4 rounded-xl bg-white text-indigo-600 font-black hover:bg-slate-100 transition-all">Get Started Pro</button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/30 transition-all flex flex-col">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-slate-500 text-sm mb-6">Custom infrastructure & scale.</p>
              <div className="text-4xl font-black mb-8">$199<span className="text-sm font-normal text-slate-500"> / month</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                {['OVHcloud VPS Orchestration', 'Custom Nginx Reverse Proxy', 'Managed CI/CD Support', 'SSO & Multi-user Access', 'Priority API Support'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => onGetStarted('enterprise')} className="w-full py-4 rounded-xl border border-slate-700 font-bold hover:bg-slate-800 transition-all">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 max-w-7xl mx-auto border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2025 AI-GP Production Agent. All rights reserved. Designed for Google AI Studio developers.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
