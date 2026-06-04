# Content SEO AI helper app
This app's goal is to allow users from a company to upload their Blog's CMS and marketing data, identify improving points and run those by an LLM to generate a plan and a brief to implement them.


## Tech Stack
- ### Language: 
Typescript.

- ### Fullstack framework:
 Next.js (App Router) for a full-stack, unified deployment on Vercel.

- ### Authentication: 
Clerk. Quick and easy integration.

- ### Database & ORM: 
Neon (BaaS) + Prisma. For a quick set up and ORM for good DevX.

- ### LLM Integration: 
OpenRouter via Vercel AI SDK. This gives us the flexibility to swap models while cleanly enforcing Structured Outputs.

- ### Validation: 
Zod for strict runtime type-checking and enforcing the JSON schemas.

- ### Styling & UI:
Tailwind CSS + Shadcn/ui to quickly build a clean experience.


## Architecture layers

- ### Deterministic Signals
Only code (no AI). A directory (signals/) containing individual declarative files (like low-ctr.ts). It should indentify the potential improvements to later send for LLM processing.

- ### The Agents
A directory (agents/) containing the LLM logic and prompts. It should include a planner agent and a brief generator agent.

- ### Guardrails
Middleware to mitigate LLM business errors. Has schema validation and logic to check against the uploaded data.

- ### State Machine
Handles generation lifecycle and persistence of data via an action queue to create plans and briefs and later publish them (logging a dry run and publishing a markdown file)


## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed and set up:
- Node.js (v18.17 or higher) and pnpm
- Accounts for Clerk (Authentication), OpenRouter (LLM routing) and Neon (Database).

### Running the app

Set up all the environment variables. Check /env.example.

Set up the database:

```bash
pnpm exec prisma generate
pnpm exec prisma db push
```

Run the development server:

```bash
pnpm i
pnpm approve-builds
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.