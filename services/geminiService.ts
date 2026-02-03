
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, ProductionOutput } from "../types";

const SYSTEM_INSTRUCTION = `You are AI-GP, a specialized Production Agent for Google AI Studio developers. 
Your mission is to help users move their Gemini prototypes from local scripts to production-ready GCP/GitHub environments with a "Beta-First" mindset.

Core Philosophy: 
Every production step must include a Beta Testing/Feedback loop. You are not just building for code, you are building for user-validated reliability.

Context: 
- Day 1: Data Modeling & Schema Validation. (Firestore Schema, Pydantic, Developer Beta validation)
- Day 2: Hardened Backend & Internal Beta. (CRUD, Auth, Internal API stress testing)
- Day 3: CI/CD & Build Distribution Beta. (GitHub Actions, App Distribution, User Feedback loops)
- Day 4: Beta Launch & Observability. (VPS Scaling, Live Telemetry, Hallucination monitoring)
- Day 5: Final External Beta & Production Health Check. (External Sign-off, Pen Testing, Key Rotation)

When providing code or advice:
- Support Zero-Cost Beta strategies using Vercel (frontend), Render/Railway (API).
- For Google Cloud Run, generate a production-ready service.yaml including resource limits and ingress settings.
- For Vercel, generate a vercel.json that handles security headers and SPA routing.
- For OVHcloud VPS, provide a specialized docker-compose.yml including API, PostgreSQL, and Nginx reverse proxy.
- IMPORTANT: All generated code should include placeholders or logic for telemetry (e.g., structured logging for AI responses, feedback endpoint skeletons).
- Prioritize Vertex AI compatibility via Service Account JSONs.
- Always include security best practices and 'Launch Readiness' checks.
- Use Markdown for code blocks. Be technical, concise, and focused on production reliability.`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(message: string, history: ChatMessage[]) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      return response.text || "I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Error: Failed to connect to AI-GP engine. Check your API key or connection.";
    }
  }

  async productionize(prompt: string): Promise<ProductionOutput> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Transform this AI Studio System Instruction into production-ready artifacts for the AI-GP roadmap. 
      Generate specific hosting artifacts for Vercel, Render, Railway, OVHcloud, and Google Cloud Run.
      
      CRITICAL: Integrate 'Beta Testing' and 'Feedback Collection' mechanisms into the artifacts.
      Example: Include a '/feedback' Pydantic model or an Nginx log format for monitoring AI latency.
      
      Prompt: "${prompt}"`,
      config: {
        systemInstruction: "Extract logic into YAML, Pydantic, .env, Dockerfile, and structured Hosting artifacts. For OVH, provide a dedicated docker-compose.yml. Return a comprehensive manual in the 'guide' field with specific Beta-Testing milestones. Return ONLY valid JSON matching the specified schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            yaml: { type: Type.STRING, description: "Content for prompts/vibe.yaml" },
            pydantic: { type: Type.STRING, description: "Python code for Pydantic models (include feedback schemas)" },
            dotenv: { type: Type.STRING, description: "Env variable templates" },
            dockerfile: { type: Type.STRING, description: "Production Dockerfile" },
            hosting: {
              type: Type.OBJECT,
              properties: {
                vercel: { type: Type.STRING },
                render: { type: Type.STRING },
                railway: { type: Type.STRING },
                ovh: { type: Type.STRING, description: "General OVH deployment notes" },
                dockerCompose: { type: Type.STRING, description: "docker-compose.yml configuration for OVHcloud VPS" },
                cloudrun: { type: Type.STRING, description: "service.yaml for Google Cloud Run deployment" },
                guide: { type: Type.STRING, description: "A comprehensive step-by-step deployment guide including VPS, SSL, and specific Beta Testing Milestones." }
              },
              required: ["guide", "ovh", "vercel", "render", "railway", "cloudrun", "dockerCompose"]
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable next steps emphasizing the Beta Testing phase"
            }
          },
          required: ["yaml", "pydantic", "dotenv", "dockerfile", "hosting", "nextSteps"]
        }
      }
    });

    const text = response.text || '{}';
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse AI response:", text);
      throw e;
    }
  }
}

export const geminiService = new GeminiService();
