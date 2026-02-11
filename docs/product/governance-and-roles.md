---
title: Governance and Roles
---

# Governance and Roles

## Role Model

- `owner`: full control, including destructive actions
- `admin`: operational management rights
- `member`: default participation rights, configurable

## Member Delegation Model

Per-community member permissions are stored as JSON in `communities.member_permissions` and enforced by `community_member_can(...)`.

Supported permission keys:

- `create_events`
- `invite_members`
- `feed_post`
- `finance_add_transactions`
- `create_tasks`

Admins and owners are always allowed.

## Join Governance

Community join modes:

- `private`: invite only
- `request`: join requests with admin approval
- `public`: direct join path

Invite governance includes:

- Active invite caps (plan-aware)
- Optional invitee email locking
- Expiry and usage counters

## Governance Recommendation

- Keep member delegation explicit and reversible
- Default to conservative rights in new communities
- Audit delegation changes in ops reviews
- Use feature flags for high-impact module rollout
