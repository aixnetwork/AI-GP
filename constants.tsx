
import { RoadmapDay } from './types';

export const ROADMAP_DATA: RoadmapDay[] = [
  {
    day: 1,
    title: "Data Modeling & Logic Migration",
    subtitle: "From Vibe to Structure",
    description: "Transition from a stateless 'Vibe' to a structured, persistent system. Establish your data foundation and logic hierarchy.",
    tasks: [
      {
        id: "database-setup",
        title: "Database Setup",
        description: "Initialize Firestore in GCP. Define your three-tier schema: Users → Conversations → Messages.",
        completed: false,
        category: "Data",
        aiPrompt: "How do I structure a Firestore database for a chat app with Users, Conversations, and Messages using the three-tier hierarchy in Python?"
      },
      {
        id: "fastapi-restructure",
        title: "FastAPI Restructure",
        description: "Create models.py using Pydantic to define data structures. Ensure AI output fits the database schema.",
        completed: false,
        category: "Logic",
        aiPrompt: "Show me how to define Pydantic models in FastAPI for a ChatMessage and ChatSession that align with Firestore documents."
      },
      {
        id: "day1-beta-validation",
        title: "Schema Validation Workshop",
        description: "BETA: Present your Firestore schema to 2-3 technical peers to verify scalability and edge-case handling before locking in the logic.",
        completed: false,
        category: "Beta Testing",
        aiPrompt: "What are the common pitfalls in Firestore schemas for chat applications that lead to high read/write costs during scaling?"
      }
    ]
  },
  {
    day: 2,
    title: "The Hardened Backend & Containerization",
    subtitle: "Security & Portability",
    description: "Build a secure, portable API that handles data and AI logic independently of the Studio interface.",
    tasks: [
      {
        id: "crud-implementation",
        title: "CRUD Implementation",
        description: "Write FastAPI endpoints to Create, Read, and Update chat sessions in Firestore.",
        completed: false,
        category: "API",
        aiPrompt: "Provide FastAPI endpoint examples for GET /sessions, POST /sessions/new, and POST /sessions/{id}/message using Firestore."
      },
      {
        id: "auth-integration",
        title: "Auth Integration",
        description: "Add a middleware layer to verify users using Firebase Auth ID tokens.",
        completed: false,
        category: "Security",
        aiPrompt: "Create a FastAPI security dependency that validates a Firebase Auth ID token from the Authorization header."
      },
      {
        id: "day2-internal-beta",
        title: "Internal API Beta",
        description: "BETA: Deploy the Docker container to a local network and have 3 internal 'power users' test endpoint latency and response quality.",
        completed: false,
        category: "Beta Testing",
        aiPrompt: "How do I set up a local load testing script using Locust to simulate 10 concurrent users hitting my FastAPI AI endpoints?"
      }
    ]
  },
  {
    day: 3,
    title: "CI/CD & The Flutter Connection",
    subtitle: "Automating the Pipeline",
    description: "Automate your deployment pipeline and link your mobile frontend to the new production API.",
    tasks: [
      {
        id: "gh-actions-deploy",
        title: "GitHub Actions",
        description: "Create a deploy.yml that runs tests and builds the Docker image on every push to main.",
        completed: false,
        category: "Automation",
        aiPrompt: "Write a GitHub Actions YAML to run pytest and then build/push a Docker image to Google Artifact Registry."
      },
      {
        id: "flutter-integration",
        title: "Flutter Integration",
        description: "Update Flutter app to point to your new FastAPI endpoints instead of calling AI services directly.",
        completed: false,
        category: "Mobile",
        aiPrompt: "How do I update a Flutter app to use a custom FastAPI backend instead of the 'google_generative_ai' package directly?"
      },
      {
        id: "day3-usability-beta",
        title: "Build Distribution Beta",
        description: "BETA: Use Firebase App Distribution to send the first production-linked build to testers. Monitor the feedback loop.",
        completed: false,
        category: "Beta Testing",
        aiPrompt: "How do I automate Flutter app distribution to Firebase App Distribution using GitHub Actions?"
      }
    ]
  },
  {
    day: 4,
    title: "Beta Launch & Hosting",
    subtitle: "Go Live and Scale",
    description: "Deploy for beta testing using free tiers and reliable VPS options like OVHcloud before full production scaling.",
    tasks: [
      {
        id: "ovh-vps-beta",
        title: "OVHcloud VPS Integration",
        description: "Set up an OVHcloud VPS for robust, cost-effective beta testing with a fixed IP and Docker Compose.",
        completed: false,
        category: "Deployment",
        aiPrompt: "Show me a Docker Compose file and Nginx configuration for hosting a FastAPI backend and a Postgres/Redis stack on an OVHcloud Ubuntu VPS."
      },
      {
        id: "day4-live-observability",
        title: "Real-time Telemetry Beta",
        description: "BETA: Enable Sentry and Cloud Logging. Monitor the first 50 live conversations for 'AI hallucination' or 'timeout' patterns.",
        completed: false,
        category: "Beta Testing",
        aiPrompt: "How can I implement custom Sentry tags in FastAPI to track specific AI model versions and user feedback per request?"
      }
    ]
  },
  {
    day: 5,
    title: "Beta User Testing & Final Polish",
    subtitle: "Production Launch Readiness",
    description: "Conduct thorough verification, invite external testers, and finalize security configurations before the public release.",
    tasks: [
      {
        id: "external-beta-program",
        title: "Final Beta Sign-off",
        description: "BETA: Recruit 10+ external users. Conduct a final 48-hour 'Stress Test' and collect quantitative usability metrics.",
        completed: false,
        category: "Beta Testing",
        aiPrompt: "What quantitative metrics should I track during a final beta launch (e.g., Latency, P99 response, Token efficiency)?"
      },
      {
        id: "production-health-check",
        title: "Launch Readiness Review",
        description: "Establish a status page and perform a final check on all security groups, key rotations, and budget alerts.",
        completed: false,
        category: "Launch",
        aiPrompt: "Create a checklist for a production launch on Google Cloud for an AI-powered application."
      }
    ]
  }
];
