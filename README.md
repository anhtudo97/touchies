# Polaris

Polaris is a Next.js 16 workspace for an AI-assisted code editing experience, built with React 19, Tailwind CSS 4, Convex backend functions, and Inngest workflows. It ships an in-browser code editor (CodeMirror + WebContainer preview), an AI chat/agent pipeline for editing project files, and GitHub import/export.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4 + shadcn/Radix UI
- Convex (database + server functions)
- Inngest (background jobs, AI agent workflows)
- Clerk (authentication)
- CodeMirror 6 (code editor)
- WebContainer API (in-browser preview/terminal)
- AI SDK (Anthropic + Google providers) + Inngest Agent Kit
- Octokit (GitHub import/export)
- Sentry (error monitoring)
- ESLint + Prettier
- Husky + Commitlint

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run app in development mode:

```bash
pnpm dev
```

Optional: run local Inngest dev server:

```bash
pnpm inngest:dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Build production bundle
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format codebase with Prettier
pnpm commitlint   # Validate commit message format
pnpm inngest:dev  # Start Inngest local dev server
```

## Project Structure

```text
convex/                        # Convex backend
	schema.ts                    # Database schema
	auth.ts, auth.config.ts      # Auth wiring (Clerk <-> Convex)
	projects.ts, files.ts        # Project & file queries/mutations
	conversations.ts             # Chat/conversation queries/mutations
	system.ts                    # System-level functions
public/                         # Static assets
src/
	app/                          # App Router pages, layouts, route handlers, global styles
		api/
			github/import/, github/export/  # GitHub import/export route handlers
			inngest/                # Inngest serve endpoint
			messages/, messages/cancel/      # Chat message route handlers
			quick-edit/, suggestion/         # AI editor route handlers
		projects/[projectId]/     # Project workspace route (layout + page)
	components/
		ai-elements/                # AI chat/message UI building blocks
		ui/                         # shadcn/Radix UI primitives
		provider.tsx, theme-provider.tsx
	features/                    # Domain features
		auth/                       # Auth loading/unauthenticated views
		conversations/              # Chat sidebar, hooks, Inngest agent + tools
			inngest/tools/            # Agent tools (create/read/update/rename/delete files, scrape urls, list files)
				create-validated-tool.ts  # Shared Zod-validated tool wrapper
				get-file-by-id.ts         # Shared Convex file lookup
				resolve-parent-folder.ts  # Shared parent-folder validation
		editor/                     # CodeMirror editor, extensions (quick-edit, suggestion, minimap, theme), store
		preview/                    # WebContainer preview, terminal, hooks, file-tree utils
		projects/                   # Project list/view, navbar, file-explorer, GitHub import dialog, export popover
	hooks/                       # Shared React hooks
	inngest/                     # Inngest client, functions wiring, shared onFailure/internal-key helpers
	lib/                         # Shared utilities (Convex client, Firecrawl, API-route auth helpers, message cancellation)
	instrumentation*.ts          # Monitoring/instrumentation setup
	proxy.ts                     # Proxy/runtime middleware entry
```

## Development Notes

- App entry page: `src/app/page.tsx`
- Root layout: `src/app/layout.tsx`
- Global styles: `src/app/globals.css`
- Project workspace route: `src/app/projects/[projectId]`
- Editor feature: `src/features/editor`
- Conversations/AI agent feature: `src/features/conversations`
- Preview (WebContainer) feature: `src/features/preview`
- Convex schema entry: `convex/schema.ts`
- Shared internal-key checks: `src/inngest/require-internal-key.ts` (Inngest functions), `src/lib/api-route-auth-helpers.ts` (API routes)

## Learn More

- Next.js docs: https://nextjs.org/docs
- React docs: https://react.dev
- Convex docs: https://docs.convex.dev
- Inngest docs: https://www.inngest.com/docs
