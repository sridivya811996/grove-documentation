---
title: Module Capabilities
---

# Module Capabilities

## Module Matrix

| Module | Key Capabilities | Control Model |
| --- | --- | --- |
| Authentication | Email/password, username login, Google, Apple, callback handling | Supabase Auth + app onboarding checks |
| Community | Create, discover, join, invite, member roles, delegated permissions | RLS + RPC + role checks |
| Events | Create/edit/delete, RSVP, reminders, attendees | Role + permission-gated actions |
| Event Agenda and Files | Agenda overview + structured agenda items, files up to 5MB, max 5 files/event | DB checks + storage policies |
| Tasks | Assign tasks in event/meeting context, status updates with notes, audit trail | RLS + `assignee_update_task` RPC |
| Feed | Posts, comments, mention notifications | Community membership + posting permission |
| Finance | Transactions, event expenses, contribution requests/settlements | Role/permission and feature toggle gating |
| Polls | Community polls with optional anonymous voting | Poll-level setting + vote policy enforcement |
| Chat | Channels and real-time messages | Global flag `chat_module_v1` + membership |
| Notifications | Push tokens, local reminders, in-app task and post notifications | Expo Notifications + Supabase tables/RPC |
| Profile | User profile editing, onboarding completeness checks | Authenticated self-service + profile policies |

## Feature Toggle Surfaces

- Community module toggles: finance, polls, meetings, tasks
- Global app flags: plan limits, chat module, future staged features

## Implementation Source

See `hooks/`, `app/`, and `supabase/migrations` for executable behavior.
