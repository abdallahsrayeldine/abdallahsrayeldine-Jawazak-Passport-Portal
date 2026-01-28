# Jawazak Admin Dashboard

This admin dashboard provides a simple interface for reviewing and managing user registrations and passport applications. Administrators can approve or reject new user registrations, and verify or reject submitted passport applications.

## Features

- Approve or reject new user registrations.
- Verify, approve, or reject passport applications.
- List and view details for profiles and applications.

## Installation

Install the application dependencies:

```sh
npm install
```

## Development

Start the application in development mode:

```sh
npm run dev
```

## Production

Build the application for production:

```sh
npm run build
```

## Development Setup

Create or update the `.env` file with your Supabase and edge function settings (replace values with your project's keys/URLs):

```sh
VITE_SUPABASE_URL=
VITE_SUPABASE_API_KEY=
VITE_EDGE_FUNCTION_GET_PENDING_PROFILES=
VITE_EDGE_FUNCTION_APPROVE_REJECT_NEW_USER=
VITE_EDGE_FUNCTION_APPROVE_REJECT_PASSPORT_APPLICATION=
```
