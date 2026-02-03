
export type Tier = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  tier: Tier;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  aiPrompt: string;
}

export interface RoadmapDay {
  day: number;
  title: string;
  subtitle: string;
  description: string;
  tasks: Task[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface HostingArtifacts {
  vercel?: string;
  render?: string;
  railway?: string;
  ovh?: string;
  cloudrun?: string;
  dockerCompose?: string; 
  guide: string;
}

export interface ProductionOutput {
  yaml: string;
  pydantic: string;
  dotenv: string;
  dockerfile: string;
  hosting: HostingArtifacts;
  nextSteps: string[];
}

export interface SavedProject {
  id: string;
  name: string;
  prompt: string;
  output: ProductionOutput | null;
  lastSynced: string;
}

export type AppView = 'roadmap' | 'bridge';

export interface ProjectState {
  currentDay: number;
  completedTasks: string[];
  view: AppView;
}
