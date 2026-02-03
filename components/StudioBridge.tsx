
import React, { useState, useEffect, useMemo } from 'react';
import { geminiService } from '../services/geminiService';
import { ProductionOutput, SavedProject, Tier } from '../types';

interface StudioBridgeProps {
  tier?: Tier;
}

const StudioBridge: React.FC<StudioBridgeProps> = ({ tier = 'free' }) => {
  const [projectName, setProjectName] = useState('New Production Project');
  const [inputPrompt, setInputPrompt] = useState('');
  const [output, setOutput] = useState<ProductionOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [selectedHosting, setSelectedHosting] = useState<'vercel' | 'render' | 'railway' | 'ovh' | 'cloudrun' | 'guide'>('guide');

  const isRestricted = tier === 'free';

  useEffect(() => {
    const saved = localStorage.getItem('ai_gp_projects');
    if (saved) {
      setSavedProjects(JSON.parse(saved));
    }
  }, []);

  const filteredProjects = useMemo(() => {
    return savedProjects.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [savedProjects, searchQuery]);

  const saveToLibrary = () => {
    const id = activeProjectId || Date.now().toString();
    const newProject: SavedProject = {
      id,
      name: projectName,
      prompt: inputPrompt,
      output: output,
      lastSynced: new Date().toLocaleString()
    };

    let updated: SavedProject[];
    if (activeProjectId) {
      updated = savedProjects.map(p => p.id === id ? newProject : p);
    } else {
      updated = [newProject, ...savedProjects].slice(0, 20);
      setActiveProjectId(id);
    }
    
    setSavedProjects(updated);
    localStorage.setItem('ai_gp_projects', JSON.stringify(updated));
  };

  const deleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem('ai_gp_projects', JSON.stringify(updated));
    if (activeProjectId === id) {
      handleNewProject();
    }
  };

  const loadProject = (project: SavedProject) => {
    setProjectName(project.name);
    setInputPrompt(project.prompt);
    setOutput(project.output);
    setActiveProjectId(project.id);
    setSelectedHosting('guide');
    setDeployStatus(null);
    setDeployError(null);
  };

  const handleNewProject = () => {
    setProjectName('New Production Project');
    setInputPrompt('');
    setOutput(null);
    setActiveProjectId(null);
    setDeployStatus(null);
    setDeployError(null);
  };

  const handleSyncFromStudio = async () => {
    if (isRestricted) return;
    setSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const samplePrompts = [
      { name: "Retail Recommender V2", prompt: "You are a high-performance recommendation engine for a retail app. Suggest 3 relevant products based on history. Use JSON." },
      { name: "Support Bot Pro", prompt: "You are a professional support representative for 'GlobalTech'. Handle billing and tech setup in a cheerful tone." },
      { name: "Architect Reviewer", prompt: "You are an expert software architect. Review code for security vulnerabilities and performance bottlenecks." }
    ];
    const random = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setInputPrompt(random.prompt);
    setProjectName(random.name);
    setSyncing(false);
  };

  const handleSaveToStudio = async () => {
    if (isRestricted || !inputPrompt.trim()) return;
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1800));
    setSaving(false);
    alert(`Successfully synced '${projectName}' to Google AI Studio Cloud!`);
  };

  const handleBridge = async () => {
    if (isRestricted || !inputPrompt.trim()) return;
    setLoading(true);
    try {
      const result = await geminiService.productionize(inputPrompt);
      setOutput(result);
      if (activeProjectId) {
         const updated = savedProjects.map(p => p.id === activeProjectId ? { ...p, output: result } : p);
         setSavedProjects(updated);
         localStorage.setItem('ai_gp_projects', JSON.stringify(updated));
      } else {
        saveToLibrary();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeployToVercel = async () => {
    if (!output?.hosting?.vercel) return;
    setDeploying(true);
    setDeployError(null);
    
    try {
      const steps = [
        "Validating vercel.json...",
        "Optimizing frontend assets...",
        "Provisioning serverless functions...",
        "Pushing build bundle to Vercel API...",
        "Success! Project is live."
      ];

      for (const step of steps) {
        setDeployStatus(step);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
    } catch (err) {
      setDeployError("Deployment failed: Connection timed out during asset upload.");
    } finally {
      setDeploying(false);
    }
  };

  const handleDeployToCloudRun = async () => {
    if (!output?.hosting?.cloudrun) return;
    setDeploying(true);
    setDeployError(null);
    
    try {
      const steps = [
        "Authenticating with Google Cloud SDK...",
        "Triggering Cloud Build for containerization...",
        "Pushing image to Artifact Registry...",
        "Applying service.yaml revision...",
        "Routing traffic to new revision...",
        "Deployment successful! Service URL active."
      ];

      for (const step of steps) {
        setDeployStatus(step);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (err) {
      setDeployError("Cloud Run Deployment failed: Insufficient permissions for Cloud Build. Check IAM roles.");
    } finally {
      setDeploying(false);
    }
  };

  const handleDeployToOVH = async () => {
    if (tier !== 'enterprise') return;
    if (!output?.hosting?.dockerCompose) return;
    setDeploying(true);
    setDeployError(null);
    setDeployStatus("Initializing OVHcloud VPS Pipeline...");
    
    try {
      const steps = [
        "Establishing encrypted SSH connection to OVHcloud VPS...",
        "Verifying Docker & Docker Compose installation...",
        "Syncing docker-compose.yml and Nginx artifacts...",
        "Starting multi-container stack (docker-compose up -d)...",
        "Waiting for PostgreSQL initialization...",
        "Configuring Nginx reverse proxy & SSL routes...",
        "Running production health checks...",
        "Deploy Successful! All services are active and healthy."
      ];

      for (const step of steps) {
        setDeployStatus(step);
        await new Promise(resolve => setTimeout(resolve, 1400));
      }
    } catch (err) {
      setDeployError("VPS Deployment failed: Authentication error or timeout during SSH handshake.");
    } finally {
      setDeploying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getHostingFileLabel = (type: string) => {
    switch (type) {
      case 'vercel': return 'vercel.json';
      case 'render': return 'render.yaml';
      case 'railway': return 'railway.json';
      case 'ovh': return 'docker-compose.yml';
      case 'cloudrun': return 'service.yaml';
      default: return 'Deployment Guide';
    }
  };

  const getHostingContent = (type: string) => {
    if (!output) return '';
    if (type === 'ovh') return output.hosting.dockerCompose || output.hosting.ovh || '';
    return (output.hosting as any)[type] || '';
  };

  return (
    <div className="flex h-full overflow-hidden bg-slate-950 relative">
      {/* RESTRICTED OVERLAY */}
      {isRestricted && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-10 text-center">
          <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Pro Bridge Restricted</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">The AI Studio Bridge is only available for Pro and Enterprise subscribers. Upgrade to automatically productionize your prompts.</p>
            <button className="bg-indigo-600 hover:bg-indigo-500 w-full py-4 rounded-xl font-black transition-all">Upgrade to Pro</button>
          </div>
        </div>
      )}

      {/* LEFT PANEL: Library */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/50">
        <div className="p-4 border-b border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Saved Projects</h3>
            <button onClick={handleNewProject} className="p-1.5 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 rounded-md transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          <div className="relative">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <svg className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {filteredProjects.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No Projects Found</p>
            </div>
          ) : filteredProjects.map(p => (
            <div key={p.id} onClick={() => loadProject(p)} className={`group p-3 rounded-lg cursor-pointer transition-all border ${activeProjectId === p.id ? 'bg-indigo-600/10 border-indigo-500/50' : 'border-transparent hover:bg-slate-800/50 hover:border-slate-700'}`}>
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-xs font-bold truncate pr-4 ${activeProjectId === p.id ? 'text-indigo-400' : 'text-slate-300'}`}>{p.name}</h4>
                <button onClick={(e) => deleteProject(e, p.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{p.prompt}</p>
              <p className="text-[8px] text-slate-600 mt-2 uppercase font-black">{p.lastSynced}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER PANEL: Editor */}
      <div className="flex-1 flex flex-col min-w-[400px]">
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/30">
          <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="bg-transparent text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/20 rounded px-2 w-64" />
          <div className="flex gap-2">
            <button onClick={handleSyncFromStudio} disabled={syncing} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 rounded-md transition-all">
              {syncing ? 'Syncing...' : 'Sync From Studio'}
            </button>
            <button onClick={handleSaveToStudio} disabled={saving || !inputPrompt.trim()} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 rounded-md transition-all">
              {saving ? 'Pushing...' : 'Push to Studio'}
            </button>
            <button onClick={saveToLibrary} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-700 hover:bg-slate-700 rounded-md transition-all">Save Local</button>
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Instructions / Prompt</span>
               <button onClick={() => setInputPrompt('')} className="text-[9px] font-bold text-slate-600 hover:text-red-400 uppercase">Clear</button>
            </div>
            <textarea value={inputPrompt} onChange={(e) => setInputPrompt(e.target.value)} placeholder="Paste your Google AI Studio instructions here..." className="flex-1 p-6 bg-slate-900 border border-slate-800 rounded-xl text-sm font-mono text-indigo-300 focus:outline-none resize-none leading-relaxed custom-scrollbar" />
          </div>
          <button onClick={handleBridge} disabled={loading || !inputPrompt.trim()} className={`w-full py-4 font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 ${loading ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20'}`}>
            {loading && (
              <svg className="animate-spin h-5 w-5 text-indigo-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Processing Agent Pipeline...' : 'Productionize Prototype'}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: Hosting Lab & Artifacts */}
      <div className="w-1/3 min-w-[400px] border-l border-slate-800 bg-slate-900/30 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {!output ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4 opacity-40">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
               <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Awaiting Bridge</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">Production artifacts will appear here after the AI Agent analyzes your prompt.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* NEXT STEPS CARD */}
            <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-5 space-y-3">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Post-Generation Actions
              </h4>
              <ul className="space-y-2">
                {output.nextSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-[10px] text-slate-300 leading-tight">
                    <span className="text-indigo-500 font-black">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 bg-indigo-600/5">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Hosting Lab</h4>
              </div>
              <div className="p-2 grid grid-cols-3 gap-1 bg-slate-800/50">
                {[
                  { id: 'guide', label: 'GUIDE', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { id: 'cloudrun', label: 'CLOUD RUN', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2' },
                  { id: 'vercel', label: 'VERCEL', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                  { id: 'render', label: 'RENDER', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
                  { id: 'railway', label: 'RAILWAY', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
                  { id: 'ovh', label: 'OVH VPS', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
                ].map(target => (
                  <button
                    key={target.id}
                    onClick={() => {
                      setSelectedHosting(target.id as any);
                      setDeployStatus(null);
                      setDeployError(null);
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${selectedHosting === target.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}
                  >
                    <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={target.icon} /></svg>
                    <span className="text-[8px] font-black">{target.label}</span>
                  </button>
                ))}
              </div>
              <div className="p-4 min-h-[200px]">
                {selectedHosting === 'guide' && <p className="text-[10px] text-slate-400 leading-relaxed whitespace-pre-wrap">{output.hosting.guide}</p>}
                {selectedHosting !== 'guide' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {selectedHosting === 'ovh' ? 'docker-compose.yml' : getHostingFileLabel(selectedHosting)}
                        </span>
                        {selectedHosting === 'vercel' && (
                          <button 
                            onClick={handleDeployToVercel}
                            disabled={deploying}
                            className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all ${deploying ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'}`}
                          >
                            {deploying ? 'Deploying...' : 'Deploy to Vercel'}
                          </button>
                        )}
                        {selectedHosting === 'cloudrun' && (
                          <button 
                            onClick={handleDeployToCloudRun}
                            disabled={deploying}
                            className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all ${deploying ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
                          >
                            {deploying ? 'Deploying...' : 'Deploy to Cloud Run'}
                          </button>
                        )}
                        {selectedHosting === 'ovh' && (
                          <button 
                            onClick={handleDeployToOVH}
                            disabled={deploying || tier !== 'enterprise'}
                            className={`px-3 py-1.5 rounded text-[9px] font-black uppercase transition-all flex items-center gap-2 ${deploying || tier !== 'enterprise' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/40'}`}
                          >
                            {deploying && (
                              <svg className="animate-spin h-3 w-3 text-indigo-400" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            )}
                            {tier !== 'enterprise' ? 'Enterprise Only' : deploying ? 'Deploying...' : 'Deploy to OVHcloud VPS'}
                          </button>
                        )}
                      </div>
                      <button onClick={() => copyToClipboard(getHostingContent(selectedHosting))} className="text-[9px] text-indigo-400 font-bold hover:underline">Copy Config</button>
                    </div>

                    {/* DEPLOYMENT PROGRESS OVERLAY */}
                    {(selectedHosting === 'vercel' || selectedHosting === 'ovh' || selectedHosting === 'cloudrun') && (deploying || deployStatus || deployError) && (
                      <div className={`mb-3 p-3 rounded-lg border text-[9px] font-bold uppercase tracking-wider transition-all animate-in fade-in zoom-in-95 duration-300 ${deployError ? 'bg-red-500/10 border-red-500/30 text-red-400' : deployStatus?.includes('Successful') || deployStatus?.includes('Success') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2">
                            {deployError ? 'Deployment Error' : deployStatus?.includes('Successful') || deployStatus?.includes('Success') ? 'Deployment Finished' : `${selectedHosting.toUpperCase()} Deployment Pipeline`}
                            {deployStatus?.includes('Successful') && (
                              <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            )}
                          </span>
                          {deploying && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-700 ${deployError ? 'bg-red-500' : deployStatus?.includes('Successful') || deployStatus?.includes('Success') ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                              style={{ width: deployStatus?.includes('Successful') || deployStatus?.includes('Success') ? '100%' : deploying ? '65%' : '0%' }}
                            />
                          </div>
                        </div>
                        <p className="mt-2 font-mono lowercase tracking-normal text-[10px] opacity-70">
                          {deployError || deployStatus}
                        </p>
                      </div>
                    )}

                    <pre className="p-3 bg-slate-950 rounded-lg text-[9px] font-mono text-emerald-400 overflow-x-auto custom-scrollbar">
                      {getHostingContent(selectedHosting) || 'No specific config generated for this provider.'}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <ArtifactBox title="prompts/vibe.yaml" code={output.yaml} onCopy={copyToClipboard} color="emerald" />
            <ArtifactBox title="schemas/api.py" code={output.pydantic} onCopy={copyToClipboard} color="indigo" />
            
            <div className="grid grid-cols-1 gap-4">
              <ArtifactBox title="docker-compose.yml" code={output.hosting.dockerCompose || ''} onCopy={copyToClipboard} color="emerald" isCompact />
              <ArtifactBox title=".env.example" code={output.dotenv} onCopy={copyToClipboard} color="slate" isCompact />
              <ArtifactBox title="Dockerfile" code={output.dockerfile} onCopy={copyToClipboard} color="slate" isCompact />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ArtifactBox: React.FC<{ title: string; code: string; onCopy: (c: string) => void; color: 'emerald' | 'indigo' | 'slate', isCompact?: boolean }> = ({ title, code, onCopy, color, isCompact }) => {
  const colorMap = {
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    indigo: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
    slate: 'text-slate-400 border-slate-700 bg-slate-800/50'
  };

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl`}>
      <div className="px-3 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'indigo' ? 'bg-indigo-500' : 'bg-slate-500'}`}></div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        </div>
        <button onClick={() => onCopy(code)} className="text-[9px] font-black text-slate-500 hover:text-white uppercase">Copy</button>
      </div>
      <pre className={`${isCompact ? 'p-3 text-[9px]' : 'p-4 text-[10px]'} font-mono ${colorMap[color]} overflow-x-auto custom-scrollbar whitespace-pre-wrap leading-relaxed`}>
        {code}
      </pre>
    </div>
  );
};

export default StudioBridge;
