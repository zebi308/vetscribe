# VetScribe MVP — Implementation Status

## Core vertical slice

- [x] Patient selection
- [x] Consultation creation
- [x] Explicit microphone start / pause / stop
- [x] Fictional demo consultation
- [x] Transcript display
- [x] AI service abstraction
- [x] Structured clinical JSON draft
- [x] Editable Subjective / Objective / Assessment / Plan fields
- [x] Missing-information review panel
- [x] Save draft
- [x] Vet-only approval confirmation
- [x] Authenticated-vet database approval guard
- [x] Signed record metadata
- [x] Append-only versions
- [x] Amendment reason + reapproval flow
- [x] Owner summary generated separately after approval
- [x] Owner summary edit/copy/PDF
- [x] Clinical PDF and CSV export

## Tenant/security layer

- [x] Supabase Auth integration
- [x] `practice_id` on tenant data
- [x] RLS enabled
- [x] tenant-scoped SELECT policies
- [x] role-scoped write policies
- [x] `practice_id` mutation protection
- [x] cross-tenant foreign-link guards
- [x] authenticated signer must equal approval user
- [x] approved-note mutation protection
- [x] private audio bucket policies
- [x] authenticated AI API routes
- [x] owner-summary API verifies approved DB record

## Product surfaces

- [x] Login / forgot password
- [x] Dashboard
- [x] Consultations list/search/tabs
- [x] Patient list/detail/history/medicines
- [x] Client list/detail
- [x] Owner summaries list
- [x] Practice settings/branding UI
- [x] Staff table/role controls UI
- [x] Templates page
- [x] Privacy page
- [x] Audit page
- [x] Super-admin routes/scaffold
- [x] responsive app shell
- [x] empty/loading/error states
- [x] UK terminology and DD/MM/YYYY formatting

## Deliberate MVP limitations

- Staff invitation delivery is not wired to transactional email.
- Super-admin practice provisioning is scaffolded rather than a complete operational console.
- PIMS integrations are intentionally V2+.
- Controlled-drug register is intentionally excluded.
- No autonomous diagnosis, prescribing or always-on audio.
- Production credentials are not bundled; real Supabase Auth users must be created and linked to profiles.

## Validation performed in generation environment

- Source tree created and inspected.
- Frontend TypeScript source passed a local no-emit structural/type validation using installed global TypeScript and temporary dependency declarations.
- `npm install` was attempted, but package registry access timed out in the sandbox; therefore a dependency-backed Vite production build was not available to execute here.
- SQL migration received manual structural/security review; no live PostgreSQL/Supabase instance was available in the sandbox for execution testing.
