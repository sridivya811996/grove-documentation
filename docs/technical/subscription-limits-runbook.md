---
title: Subscription and Limits Runbook
sidebar_position: 8
description: Technical implementation guide for plan limits, feature flags, and operations.
---

# Subscription and Limits Runbook

## Scope

This runbook defines how Grove implements and operates subscription-based community limits while keeping the capability feature-flagged until launch.

## Implementation Status

Repository:
- `C:\Naresh\ideas\community\grove-community-app\grove-community`

Primary migrations:
- `supabase/migrations/20260211093000_micro_community_plan_limits_phase1.sql`
- `supabase/migrations/20260211101500_plan_limits_feature_flag_gate.sql`

Core behavior:
- Plan limit infrastructure is deployed.
- Enforcement is gated by `plan_limits_v1`.
- Default is OFF for MVP.

## Data Model

### Plan defaults table
- `public.community_plan_limits`
- One row per tier: `free`, `pro`, `business`

Columns:
- `max_members`
- `max_admins`
- `max_active_invites`
- `max_storage_mb`

### Per-community overrides
- `public.community_limit_overrides`

Nullable override columns:
- `max_members`
- `max_admins`
- `max_active_invites`
- `max_storage_mb`

### Global feature flags
- `public.app_feature_flags`

Relevant key:
- `plan_limits_v1` (`boolean`)

## Server Functions and Triggers

### Limit resolution
- `public.community_limit_int(community_id, key)`
- Resolves effective value using override first, then tier default.

### Usage summary RPC
- `public.get_community_limits_usage(p_community_id uuid)`
- Returns current usage + caps for members, admins, invites, and storage quota.

### Enforcement triggers
- `public.enforce_community_member_limits()`
  - Enforces member cap on join/approval/manual add.
  - Enforces admin cap on role promotions.
- `public.enforce_active_invite_limit()`
  - Enforces active invite cap on invite creation/reactivation.

Both triggers short-circuit when feature flag is OFF.

### Join-path enforcement
The following functions apply cap checks only when `plan_limits_v1` is enabled:
- `public.search_joinable_communities`
- `public.request_join_community`
- `public.approve_join_request`
- `public.join_community_by_invite_code`

## App Integration

### Hook for global feature flag
- `hooks/use-features.ts`
- `useAppFeatureFlag(flagKey, defaultValue)`

### Community settings UI
- `app/community/[id]/settings.tsx`

Behavior:
- `Subscription` selector and `Usage & Limits` card render only when `plan_limits_v1 = true`.
- Invite creation button uses live cap data only when flag is enabled.

## Operational Commands

### Check current plan limits
```sql
select * from public.community_plan_limits order by tier;
```

### Update default limits
```sql
update public.community_plan_limits
set max_members = 50,
    max_admins = 1,
    max_active_invites = 3,
    max_storage_mb = 1024
where tier = 'free';
```

### Add/modify one community override
```sql
insert into public.community_limit_overrides
  (community_id, max_members, max_admins, max_active_invites, max_storage_mb, updated_by)
values
  ('<community_uuid>', 80, 2, 10, 2048, '<admin_or_owner_user_uuid>')
on conflict (community_id) do update
set max_members = excluded.max_members,
    max_admins = excluded.max_admins,
    max_active_invites = excluded.max_active_invites,
    max_storage_mb = excluded.max_storage_mb,
    updated_by = excluded.updated_by,
    updated_at = now();
```

### Enable plan limits globally
```sql
update public.app_feature_flags
set enabled = true,
    updated_at = now(),
    updated_by = '<admin_user_uuid>'
where key = 'plan_limits_v1';
```

### Disable plan limits globally
```sql
update public.app_feature_flags
set enabled = false,
    updated_at = now(),
    updated_by = '<admin_user_uuid>'
where key = 'plan_limits_v1';
```

## Launch Checklist

1. Data readiness
- Verify `community_plan_limits` has correct values for all three tiers.
- Verify no stale test overrides in production.

2. UX readiness
- Validate settings card text and upgrade messaging.
- Validate limit breach error messages are user-friendly.

3. Metrics readiness
- Dashboards for usage percentages (members/admins/invites).
- Alerting for cap-related error spikes.

4. Rollout safety
- Enable for pilot communities first.
- Observe join, invite, and role-change failure rates.
- Expand progressively.

## Product Guardrails

- Keep limits configurable in DB, not hardcoded.
- Prefer clear usage visibility over silent blocking.
- Keep enforcement authoritative on server; client checks are advisory.
- Launch monetization only after retention and activation metrics are healthy.
