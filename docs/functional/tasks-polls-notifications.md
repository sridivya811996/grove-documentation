---
title: Tasks, Polls, and Notifications
---

# Tasks, Polls, and Notifications

## Tasks and Activities

Implemented behavior:

- Admin/permitted members create tasks linked to events/meetings
- Assign tasks to members
- Assignees or admins update status via `assignee_update_task(...)`
- Optional update note captured as audit feedback

Statuses:

- `open`
- `in_progress`
- `blocked`
- `done`

## Task Audit and Alerts

- `task_updates` stores status history and notes
- `task_notifications` stores in-app task alert records
- Task assignment and status transitions trigger notifications

## Polls

- Poll creation with close window support
- Vote upsert per user
- Poll-level `allow_anonymous_votes` switch
- Vote row `is_anonymous` enforced by policy

## Notifications

Two classes are active:

- Local/push notifications (Expo)
- In-app notifications (task/post tables)

Push token registration and notification channels are platform-aware and best-effort resilient.
