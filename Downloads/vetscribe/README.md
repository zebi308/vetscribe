


















# VetScribe

Production-oriented MVP for an AI-assisted clinical documentation workflow for independent UK veterinary practices.

> AI drafts. The vet decides.

VetScribe does **not** claim RCVS/VMD approval or certification. It is designed around UK veterinary record-keeping guidance, and the veterinary professional remains responsible for reviewing and approving the clinical record.

## What is implemented

The core demo workflow is complete:

1. Sign in / demo access
2. Dashboard
3. Select a patient
4. Start a consultation
5. Explicitly start/stop microphone recording, or load the fictional demo consultation
6. Transcribe audio through an AI service abstraction
7. Generate a schema-constrained structured clinical draft
8. Review/edit all clinical sections and missing-information warnings
9. Vet-only Approve & Sign flow
10. Append-only version history + audit event
11. Generate a separate owner summary from the approved record
12. Edit/copy/export the owner summary
13. Export the approved clinical record as PDF or CSV

Additional MVP surfaces include patient/client records, medicine history, practice settings/branding, staff management UI, privacy/audit views and a super-admin route scaffold.

## Stack

- React + TypeScript + Vite
- Tailwind CSS and reusable shadcn-style UI primitives
- Lucide icons
- Supabase Auth, PostgreSQL, Storage and Row Level Security
- Vercel server functions for OpenAI calls
- jsPDF for client-side PDF export

## Run the fictional demo locally

Requirements: Node.js 20+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Keep:

```env
VITE_DEMO_MODE=true
```

Then open the local Vite URL and choose **Use demo practice**. The intended five-minute path is:

`Dashboard -> New Consultation -> Max -> Use demo consultation -> Generate Clinical Note -> Review/Edit -> Approve & Sign -> Owner Summary -> Export PDF`

All demo people, contact details and clinical records are fictional.

## Production configuration

### 1. Supabase

Create a Supabase project, then apply:

```text
supabase/migrations/001_initial_schema.sql
```

Optional fictional seed data:

```text
supabase/seed.sql
```

The seed deliberately does not create passwords. Create real Supabase Auth users separately and link `profiles.auth_user_id` to the corresponding `auth.users.id` values.

### 2. Environment variables

Client-side variables:

```env
VITE_DEMO_MODE=false
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_AI_API_BASE=/api
```

Server-only variables on Vercel:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
OPENAI_API_KEY=YOUR_OPENAI_KEY
OPENAI_CLINICAL_MODEL=gpt-4.1-mini
OPENAI_SUMMARY_MODEL=gpt-4.1-mini
OPENAI_TRANSCRIPTION_MODEL=gpt-4o-mini-transcribe
```

Never place the OpenAI key or a Supabase service-role key in a `VITE_` variable.

### 3. Deploy to Vercel

The repository contains `vercel.json` and `/api` server functions. Configure the environment variables above in the Vercel project, then deploy normally from Git or the Vercel CLI.

## Security architecture

The migration includes:

- RLS on tenant-scoped tables
- authenticated-user-to-practice resolution in PostgreSQL
- policies that prevent ordinary users from reading another practice
- `practice_id` mutation guards
- cross-table tenant-link validation
- role-aware write policies
- vet-only approval guard tied to the authenticated Supabase user
- atomic `approve_clinical_record(...)` RPC
- append-only clinical-note versions
- protection against silently changing an approved note
- audit entries for approval
- private consultation-audio Storage bucket policies scoped by practice prefix

The production AI endpoints require a valid Supabase bearer token. Owner-summary generation re-reads the approved record through Supabase/RLS rather than trusting clinical content supplied by the browser.

## AI architecture

`src/lib/ai/types.ts` defines the service contract. `mockAI.ts` implements the isolated fictional demo, while `httpAI.ts` talks to authenticated `/api` endpoints. This allows model/provider changes without rewriting the consultation UI.

The clinical-note endpoint uses strict structured JSON output and explicitly instructs the model not to invent diagnoses, medicines, doses, measurements, test results or history.

## Important MVP boundaries

Intentionally not implemented as autonomous/production clinical features:

- diagnosis or prescribing by AI
- always-on listening
- controlled-drug register
- direct ezyVet / Provet / RxWorks / Teleos / Merlin integrations
- automated emailing to owners
- full tenant provisioning/billing platform
- regulatory certification claims

Staff invitation and super-admin provisioning are UI/scaffold-level rather than a complete invitation/billing system.

## Verification commands

After dependencies are available:

```bash
npm run typecheck
npm run build
```

A source-level TypeScript validation was also run during generation. Dependency installation could not be completed in the generation sandbox because registry access timed out, so a full Vite bundle execution was not falsely claimed as completed.
