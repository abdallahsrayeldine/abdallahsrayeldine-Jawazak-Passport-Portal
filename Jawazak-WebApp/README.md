# Jawazak Web App

## Requirements

- Node.js (v14+ recommended)

## Quick Start

1. Install Node.js from https://nodejs.org/ if it's not already installed.
2. From the project root, install dependencies and start the development server:

```powershell
npm install
npm run dev
```

The dev server runs using Vite — visit the URL shown in the terminal (usually `http://localhost:5173`).

## Environment variables

Create a `.env` or `.env.local` file in the project root and define the following Vite environment variables (examples shown):

```env
VITE_SUPABASE_URL=https://your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_FACETEC_SERVER_URL=https://your-facetec-server
VITE_FACETEC_SIGNUP=mode=signup
VITE_FACETEC_SIGNIN=mode=signin
VITE_EDGE_FUNCTION_UPLOAD_PASSPORT_APPLICATION=https://your-edge-fn/upload
VITE_EDGE_FUNCTION_LOG_SIGNUP=https://your-edge-fn/log-signup
VITE_EDGE_FUNCTION_CREATE_CHECKOUT_SESSION=https://your-edge-fn/create-checkout
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

Notes:

- Run commands from the project root directory.
- Keep secrets out of version control. Use a secure secret store for production.
