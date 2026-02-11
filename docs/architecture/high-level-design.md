---
title: High-Level Design
---

# High-Level Design

## Architecture Summary

Grove uses a mobile-first client backed by Supabase platform services with RLS-first access control.

```mermaid
flowchart TD
  A[Expo React Native App] --> B[Supabase Auth]
  A --> C[Supabase PostgREST RPC]
  A --> D[Supabase Realtime]
  A --> E[Supabase Storage]
  C --> F[(PostgreSQL + RLS)]
  F --> G[Triggers and Functions]
  G --> H[Notification Jobs]
  H --> I[Edge Function: notification-worker]
  I --> J[Email Provider: Resend]
```

## Client Layers

- Navigation and route orchestration (`app/`)
- Data hooks and mutations (`hooks/`)
- Service and utility layer (`lib/`)
- Auth and notification state stores (`stores/`)

## Backend Layers

- Authn/Authz: Supabase Auth + RLS
- Domain model: PostgreSQL tables, views, policies
- Orchestration: SQL functions and triggers
- Async processing: edge functions + notification jobs
