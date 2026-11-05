<!-- GSD:project-start source:PROJECT.md -->

## Project

**Portfolio Support Platform (working title)**

A clean, public, portfolio-grade derivative of the Apache-licensed parts of Atrium: a multi-tenant support platform with an AI service, shared inbox, CRM workflows, knowledge retrieval, background workers, admin console, and embeddable widget. It is being rebuilt as an honest applied-AI/full-stack engineering showcase for Marwane Elhour, with upstream attribution preserved and proprietary enterprise code excluded.

The first milestone is not a feature expansion. It establishes a legally publishable baseline, truthful automated quality gates, behavior-preserving refactors, a distinct brand, and documentation that lets employers understand and run the system.

**Core Value:** Recruiters and engineers can inspect a legally clean, reproducible codebase that demonstrates reliable full-stack and applied-AI engineering rather than cosmetic rebranding.

### Constraints

- **Licensing**: Never publish or copy proprietary `ee/` implementation; preserve root copyright and license notices.
- **Behavior**: Refactoring does not alter external behavior; behavior changes require separate documented approval and tests.
- **Verification**: A failing baseline is recorded before changes; every refactor needs a focused passing check or explicit stop.
- **Compatibility**: Routes, JSON shapes, MongoDB fields, environment keys, queues, widget tags and persisted storage names are contracts until migrated deliberately.
- **Security**: Never commit credentials or real user/client data; public fixtures remain synthetic.
- **Accessibility**: Visual rebranding preserves keyboard, focus, contrast and semantic behavior.
- **Dependencies**: Reuse installed dependencies and existing house components before adding packages.
- **Publication**: GitHub visibility remains private until all automated and manual release gates pass.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Runtime and workspace

- Node.js 20+ monorepo managed with pnpm 9.15 and Turborepo (`package.json`, `pnpm-workspace.yaml`, `turbo.json`).
- TypeScript 5.8 is the primary language; the repository contains roughly 480 `.ts` and 123 `.tsx` files.
- Workspace packages are limited to `apps/*` and `packages/*`; `ee/` is loaded dynamically and is not a pnpm workspace package.

## Applications

- `apps/gateway`: Express, Socket.IO, Mongoose, Redis/BullMQ, Joi/express-validator, Winston, Swagger, Vitest.
- `apps/agent`: BullMQ AI workers with OpenAI, Gemini, Bedrock, Hugging Face and Ollama provider adapters; Qdrant retrieval and MinIO-compatible object storage.
- `apps/console`: React 19, Vite, React Router, TanStack Query, Zustand, Tailwind CSS and Radix UI.
- `apps/launcher`: framework-light TypeScript/Vite embeddable widget and iframe client.
- `apps/worker`: BullMQ background jobs for email, analytics and lead-source ingestion.

## Shared configuration

- `packages/typescript-config` and `packages/eslint-config` are intended as shared tooling packages, though application configs are not fully uniform.
- Gateway TypeScript uses strict mode and aliases `@shared`, `@modules` and `@sockets` (`apps/gateway/tsconfig.json`).
- Root scripts delegate `build`, `lint`, `check-types` and `dev` to Turborepo (`package.json`).
- Docker Compose supplies MongoDB, Redis, Qdrant, object storage and local mail services (`docker/docker-compose.dev.yml`).

## Build and verification

- Install: `pnpm install --frozen-lockfile`.
- Build: `pnpm build`.
- Lint: `pnpm lint` (not every workspace currently exposes a lint task).
- Type check: `pnpm check-types` (not every workspace currently exposes a matching script).
- Tests: `pnpm --filter @atrium/gateway test`.
- CI currently runs only gateway tests and makes lint failures non-blocking (`.github/workflows/ci.yaml`).

## Licensing boundary

- Files outside `ee/` are offered under the root Apache-based community license (`LICENSE`).
- `ee/` is proprietary and explicitly forbids copying, modification and redistribution (`ee/LICENSE`).
- A public derivative must exclude `ee/` and must preserve required copyright/license notices for retained OSS files.

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## TypeScript

- Gateway uses `strict: true`, CommonJS output and path aliases (`apps/gateway/tsconfig.json`).
- Console uses Vite/React ESM with `@/*` aliases (`apps/console/tsconfig.json`).
- Formatting is double quotes, semicolons and trailing commas in most current code, but no repository-wide enforced check exists.
- Avoid adding dependencies where platform or existing helpers suffice.

## Backend patterns

- Express routes validate/authenticate then delegate to controllers and services.
- Services return structured success/message/status data in some modules and throw typed/generic errors in others; preserve the existing contract per call path.
- Central middleware adds request IDs, rate limits and normalized error responses (`apps/gateway/src/index.ts`, `apps/gateway/src/shared/security/middleware`).
- Mongoose models are imported directly from `apps/gateway/src/shared/models`.
- Winston loggers are preferred over console output for operational paths.

## Frontend patterns

- Domain-specific API clients and TanStack Query hooks sit beside pages/components under `apps/console/src/domains`.
- Shared UI primitives live in `apps/console/src/shared/ui`; reuse them before introducing new components.
- Zustand is used for client state; server state belongs in TanStack Query.
- Styling uses Tailwind classes and CSS variables; accessibility semantics must be preserved during visual rebranding.

## Refactoring rules

- Map every caller before renaming exported symbols, serialized fields, routes, queue names or widget protocol tags.
- Keep behavior-preserving refactors separate from rebranding and feature changes.
- For architecture moves: introduce new location, redirect callers, then remove old code; test after every step.
- Files over 500 lines are read by target function/class and immediate context, not wholesale.
- New non-trivial logic requires one focused runnable check.

## Current inconsistencies

- Numerous `any` casts exist at provider, middleware and Mongoose boundaries.
- Filename and hook naming are inconsistent between older and newer domains.
- Root Turbo task names do not match all workspace scripts.
- Some large pages/services mix orchestration, persistence and presentation responsibilities.

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System shape

## Entry points

- `apps/gateway/src/index.ts` constructs the Express app, middleware, routers, Socket.IO, infrastructure connections and background consumers.
- `apps/agent/src/index.ts` starts chat, ingestion, analysis, assist and observability workers plus a health server.
- `apps/worker/src/index.ts` starts email, analytics and lead-source workers.
- `apps/console/src/main.tsx` loads remote mode configuration, then mounts providers and the router.
- `apps/launcher/src/index.ts` and `apps/launcher/src/iframe/main.ts` bootstrap the host script and iframe UI.

## Backend layering

- Gateway feature modules generally follow routes → controller → service → Mongoose model/infra under `apps/gateway/src/modules/<feature>`.
- Cross-cutting security, configuration, queues, logging and persistence live under `apps/gateway/src/shared`.
- Socket event middleware and handlers live under `apps/gateway/src/sockets` and call shared services/models.
- The service layer is inconsistent: some controllers and services directly manipulate Mongoose types, and several files exceed 1,000 lines.

## AI data flow

## Frontend layering

- `apps/console/src/domains` groups pages, hooks, API clients, components and types by business domain.
- `apps/console/src/shared` owns the API client, query client, theme, common UI and layouts.
- React Router is defined in `apps/console/src/router/index.tsx`.
- Several page components contain thousands of lines and mix data orchestration, forms, tables and presentation.

## Enterprise boundary

- OSS loaders/contracts under `apps/gateway/src/shared/ee` dynamically resolve proprietary modules from `ee/`.
- Console feature gates and worker startup also consult EE state (`apps/console/src/shared/ee`, `apps/worker/src/config/index.ts`).
- The public portfolio version must replace these integration seams with an explicit OSS-only mode before deleting proprietary `ee/`; proprietary implementation code must not be copied.

## Refactoring constraint

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
