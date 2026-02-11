---
title: Supabase Service Map
---

# Supabase Service Map

## Service Usage Matrix

| Supabase Service | How Grove Uses It |
| --- | --- |
| Auth | Email/password, OAuth, session management, callback exchange |
| Postgres | Core domain data: communities, events, tasks, feed, finance, polls |
| Row Level Security | Role/member/ownership enforcement and permission boundaries |
| RPC Functions | Join flows, profile completion, task status updates, feature flag reads |
| Realtime | Live chat message updates |
| Storage | Avatars, community images, chat images, event files |
| Edge Functions | Notification worker and account deletion workflows |

## Buckets and Purpose

- `avatars`: profile photos
- `community-images`: community image assets
- `chat-images`: chat media
- `event-files`: event documents (private)

## Notification Pipeline

- Tables: `notification_jobs`, `task_notifications`, `post_notifications`
- Worker: `supabase/functions/notification-worker`
- Provider: Resend (email)
