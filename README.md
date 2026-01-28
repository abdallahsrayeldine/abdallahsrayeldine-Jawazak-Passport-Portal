# Jawzak System Setup Guide

This guide explains how to set up the full **Jawzak** system, which consists of four interconnected modules:

1. **Jawzak-WebApp** – the user-facing web application for online passport renewal.
2. **Jawzak-Dashboard** – the admin dashboard used by internal staff.
3. **Facetec-Server** – handles the FaceTec 3D Liveness and Identity Verification integrations.
4. **Supabase Backend** – provides authentication, database, storage, and serverless functions.

Each module includes its own README file with detailed installation steps. This document explains how they fit together and the order in which you should set them up.

---

## 1. Supabase Backend Setup

The Supabase backend is the foundation of the system. Both the WebApp and Dashboard depend on it, and the Facetec-Server communicates with it for verification logic.

You first need to:

- Create a Supabase project
- Importing or applying the database schema (check attached file: DATABASE.sql)
- Configure authentication providers
- Setting environment variables for API keys
- Deploying Edge Functions (used for verification logic and callbacks)

Once setup is complete, make sure you save:

- **Supabase URL**
- **Supabase anon key**
- **Supabase service role key**

These will be used by the other modules.

---

## 2. Facetec-Server Setup

The Facetec-Server is responsible for all interactions with FaceTec’s 3D Liveness technology. Both the WebApp and Dashboard send verification requests to this server.

Inside the Facetec-Server ZIP file, follow the included README steps. These usually include:

- Installing dependencies
- Adding FaceTec license keys and your Supabase service key to the environment variables
- Running the server locally or deploying it to your preferred environment

After running the server, note the **Facetec-Server base URL** — the WebApp and Dashboard will need it.

---

## 3. Jawzak-WebApp Setup

This is the public application used by citizens to submit passport renewal applications.

Follow the README inside the Jawzak-WebApp ZIP file. Typical setup steps include:

- Installing Node.js
- Running `npm install`
- Creating an `.env` file and setting:

  - Supabase URL and anon key
  - Facetec-Server URL
  - Any additional environment variables required for the flow

- Running the development server using the provided command

After setup, the WebApp should be able to:

- Register and authenticate users through Supabase
- Upload documents to Supabase Storage
- Perform FaceTec liveness checks via the Facetec-Server

---

## 4. Jawzak-Dashboard Setup

The Dashboard is an internal admin interface used to review applications.

Follow the README inside the Jawzak-Dashboard ZIP file. Steps are similar to the WebApp setup:

- Install Node.js
- Run `npm install`
- Configure environment variables for:

  - Supabase URL and service role key (or restricted service key)
  - Facetec-Server URL

- Start the development or production server

The Dashboard should then allow staff to:

- Log in securely
- View and filter applications
- Review identity verification results
- Update application statuses

---

## Order of Setup (Recommended)

1. **Supabase Backend** – foundation for auth, storage, and database.
2. **Facetec-Server** – needs access to Supabase before it can function.
3. **Jawzak-WebApp** – depends on backend + Facetec verification.
4. **Jawzak-Dashboard** – final module, depends on everything being online.
