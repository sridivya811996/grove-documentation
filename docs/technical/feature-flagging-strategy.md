---
title: Feature Flagging Strategy
sidebar_position: 9
description: Backend-controlled runtime feature flag strategy for Grove, including operational SQL query cookbook.
---

# Feature Flagging Strategy

## Objective

Enable and disable app capabilities at runtime in production, without shipping a new mobile build.

Primary requirements:
- Backend-controlled toggles.
- Runtime-safe behavior.
- Strong rollback path.
- Server-authoritative enforcement for sensitive capabilities.

## Current Design (Implemented)

Source of truth is Supabase:
- Table: `public.app_feature_flags`
- Reader helper: `public.is_feature_enabled(p_key, p_default)`

Current production flags:
- `plan_limits_v1` (subscription limits rollout)
- `chat_module_v1` (chat module visibility/access)

## International Best-Practice Model

Use four flag classes:

1. `release_*`
- Progressive delivery of new features.
- Example: `release_event_agenda_v1`.

2. `ops_*`
- Emergency kill switches.
- Example: `ops_disable_push_notifications`.

3. `exp_*`
- A/B experiments with expiry dates.
- Example: `exp_new_onboarding_copy_v2`.

4. `entitlement_*`
- Plan/permission controls.
- Example: `entitlement_plan_limits_v1`.

Recommended defaults:
- New risky flags start `false`.
- All flags have owner + clear description + review date.

## Enforcement Rules

1. UI-level control
- Use flags to hide tabs/routes/buttons.
- Example: chat tab hidden when `chat_module_v1 = false`.

2. Server-level control
- For access-critical features, enforce flags in RPC/triggers/RLS.
- Never rely only on client-side visibility.

3. Rollback-first design
- Every flag must be reversible in one SQL update.

## Runtime Rollout Policy

Recommended sequence:
1. Internal only
2. Pilot communities
3. 5% rollout
4. 25% rollout
5. 100% rollout

If anomalies appear:
- Roll back immediately by setting `enabled = false`.

## SQL Query Cookbook

### 1) List all flags

```sql
select key, enabled, description, updated_at, updated_by
from public.app_feature_flags
order by key;
```

### 2) Check one flag quickly

```sql
select key, enabled, updated_at
from public.app_feature_flags
where key = 'chat_module_v1';
```

### 3) Evaluate through helper function

```sql
select public.is_feature_enabled('chat_module_v1', false) as chat_enabled;
select public.is_feature_enabled('plan_limits_v1', false) as plan_limits_enabled;
```

### 4) Create or update (idempotent upsert)

```sql
insert into public.app_feature_flags (key, enabled, description, updated_by)
values (
  'release_new_feed_card_v1',
  false,
  'Controls new feed card layout rollout',
  '<admin_user_uuid>'
)
on conflict (key) do update
set enabled = excluded.enabled,
    description = excluded.description,
    updated_by = excluded.updated_by,
    updated_at = now();
```

### 5) Enable a flag

```sql
update public.app_feature_flags
set enabled = true,
    updated_by = '<admin_user_uuid>',
    updated_at = now()
where key = 'chat_module_v1';
```

### 6) Disable a flag (kill switch)

```sql
update public.app_feature_flags
set enabled = false,
    updated_by = '<admin_user_uuid>',
    updated_at = now()
where key = 'chat_module_v1';
```

### 7) Bulk disable all release flags

```sql
update public.app_feature_flags
set enabled = false,
    updated_by = '<admin_user_uuid>',
    updated_at = now()
where key like 'release_%';
```

### 8) Enable all ops flags (rare, controlled)

```sql
update public.app_feature_flags
set enabled = true,
    updated_by = '<admin_user_uuid>',
    updated_at = now()
where key like 'ops_%';
```

### 9) Delete a deprecated flag (after cleanup)

```sql
delete from public.app_feature_flags
where key = 'exp_old_copy_test_v1';
```

## Chat Module Control

Flag:
- `chat_module_v1`

Expected behavior when `false`:
- Chat tab hidden.
- Chat screens show unavailable state.
- No new release required to turn on later.

Enable chat in production:

```sql
update public.app_feature_flags
set enabled = true,
    updated_by = '<admin_user_uuid>',
    updated_at = now()
where key = 'chat_module_v1';
```

Disable chat in production:

```sql
update public.app_feature_flags
set enabled = false,
    updated_by = '<admin_user_uuid>',
    updated_at = now()
where key = 'chat_module_v1';
```

## Governance Checklist

Before turning a flag on:
- Owner identified.
- Rollback query prepared.
- Metrics/dashboard ready.
- User-visible copy reviewed.

After full rollout:
- Remove stale release/experiment flags.
- Keep only long-lived operational and entitlement flags.

## Future Upgrade (Recommended)

Add two backend tables:

1. `app_feature_flag_overrides`
- Scope: tier/community/user/platform/version
- Purpose: targeted rollouts without global toggle.

2. `app_feature_flag_audit_log`
- Store who changed what and why.
- Improves compliance and incident debugging.

Until then, `app_feature_flags` + strict SQL workflows is sufficient for MVP and early production.
