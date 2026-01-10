# Chord Shift

A modern web application for scraping chords from Ultimate Guitar, transposing them, and arranging chord progressions.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime & package manager
- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **UI**: [React 19](https://react.dev) + [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs)
- **Database**: Firebase Firestore
- **Testing**: Bun Test Runner (39 tests)
- **Deployment**: [Vercel](https://vercel.com) with Bun Runtime

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.0 or later

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
bun run build
```

### Testing

```bash
bun test
```

### Linting

```bash
bun run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API route handlers
│   ├── chords/            # Chords workspace page
│   ├── layout.tsx         # Root layout with fonts & toast
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── features/              # Business logic utilities
├── lib/                   # Shared utilities
├── services/              # External service integrations
├── store/                 # Zustand state management
├── styles/                # Global CSS
└── types/                 # TypeScript type definitions
```

## Features

- Import chords from Ultimate Guitar URLs
- Build custom chord progressions
- View chord notes and labels (with music theory)
- Save and share workspaces via Firebase
- Modern glassmorphism UI design
- Dark mode by default

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

## AI Agent Guidelines

See [AGENTS.md](AGENTS.md) for coding conventions and LLM instructions.

## Deployment

This project is configured for deployment on Vercel with the Bun runtime:

```json
{
  "bunVersion": "1.x"
}
```

## License

MIT
