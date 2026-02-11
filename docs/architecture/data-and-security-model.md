---
title: Data and Security Model
---

# Data and Security Model

## Core Entity Domains

- Identity: `profiles`, `push_tokens`
- Community: `communities`, `community_members`, `community_invites`, `community_join_requests`
- Event: `events`, `event_attendees`, `event_files`
- Task: `tasks`, `task_assignees`, `task_updates`, `task_notifications`
- Feed: `posts`, `post_comments`, mention and notification tables
- Finance: `transactions`, contribution request and settlement tables
- Polls: `polls`, `poll_votes`
- Flags and plans: `app_feature_flags`, `community_plan_limits`, `community_limit_overrides`

## Security Principles

- Deny-by-default RLS with explicit policy allow rules
- Sensitive writes done via RPC for atomic validation and side effects
- Membership is foundational to all community data visibility
- Role escalation paths are controlled by membership role and policy checks

## Permission Enforcement Patterns

- Direct RLS checks for simple ownership/membership
- Helper function checks (e.g., `community_member_can`) for delegated rights
- Trigger enforcement for limit controls and guardrails

## Auditability

- Task status changes are recorded in `task_updates`
- Notification tables preserve user-level delivery state
- Invite usage and join request statuses preserve community governance history
