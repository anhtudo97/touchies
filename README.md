# Polaris

Polaris is a Next.js 16 workspace for an AI-assisted code editing experience, built with React 19, Tailwind CSS 4, Convex backend functions, and Inngest workflows.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Convex
- Inngest
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
convex/                    # Backend schema and server functions (auth, files, projects)
public/                    # Static assets
src/
	app/                     # App Router pages, layouts, route handlers, and global styles
		api/                   # API route handlers (inngest, quick-edit, suggestion)
		projects/[projectId]/  # Project workspace routes
	components/
		ui/                    # Reusable UI primitives
	features/                # Domain features (auth, editor, projects)
	hooks/                   # Shared React hooks
	inngest/                 # Inngest client and functions wiring
	lib/                     # Shared utilities and integrations
	instrumentation*.ts      # Monitoring/instrumentation setup
	proxy.ts                 # Proxy/runtime middleware entry
```

## Development Notes

- App entry page: `src/app/page.tsx`
- Root layout: `src/app/layout.tsx`
- Global styles: `src/app/globals.css`
- Editor feature lives in: `src/features/editor`
- Convex schema entry: `convex/schema.ts`

## Learn More

- Next.js docs: https://nextjs.org/docs
- React docs: https://react.dev
- Convex docs: https://docs.convex.dev
- Inngest docs: https://www.inngest.com/docs
