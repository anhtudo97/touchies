# Polaris

Polaris is a Next.js 16 UI workspace using React 19, Tailwind CSS 4, and a reusable UI component set in `src/components/ui`.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint + Prettier
- Husky + Commitlint

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run development server:

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

```bash
pnpm dev         # Start development server
pnpm build       # Build production bundle
pnpm start       # Start production server
pnpm lint        # Run ESLint
pnpm format      # Format codebase with Prettier
pnpm commitlint  # Validate commit message format
```

## Project Structure

```text
src/
	app/            # App Router pages, layout, and global styles
	components/ui/  # Reusable UI primitives
	hooks/          # Shared React hooks
	lib/            # Utilities
public/           # Static assets
```

## Development Notes

- Main page entry: `src/app/page.tsx`
- Root layout and metadata: `src/app/layout.tsx`
- Global styles: `src/app/globals.css`

## Learn More

- Next.js docs: https://nextjs.org/docs
- React docs: https://react.dev
