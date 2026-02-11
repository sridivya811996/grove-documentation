---
title: Implementation Inventory
---

# Implementation Inventory

## Mobile App Structure

- Routes: `app/`
- Data hooks: `hooks/`
- Shared libs: `lib/`
- Auth and notifications store: `stores/`
- Feature registry: `features/registry.ts`

## Backend Structure

- Migrations: `supabase/migrations/`
- Edge functions: `supabase/functions/`
- Local platform config: `supabase/config.toml`

## Key Migrations by Capability

- Poll anonymous voting: `20260210160000_poll_anonymous_voting.sql`
- Event agenda and files: `20260210173000_event_agenda_and_files.sql`
- Task updates and notifications: `20260210223000_task_updates_and_notifications.sql`
- Member delegation permissions: `20260210260000_member_permissions_and_rls.sql`
- Plan limits model: `20260211093000_micro_community_plan_limits_phase1.sql`
- Plan limits flag gate: `20260211101500_plan_limits_feature_flag_gate.sql`
- Chat module flag: `20260211113000_add_chat_module_feature_flag.sql`

## Key Runtime Hooks

- Feature flags: `hooks/use-features.ts`
- Communities and invites: `hooks/use-communities.ts`
- Events and RSVP: `hooks/use-events.ts`
- Event files: `hooks/use-event-files.ts`
- Tasks: `hooks/use-tasks.ts`
- Polls: `hooks/use-polls.ts`
- Notifications: `hooks/use-notifications.ts`
- Chat: `hooks/use-chat.ts`
