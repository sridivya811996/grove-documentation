---
title: Feature Flagging and Rollout
---

# Feature Flagging and Rollout

## Strategy

Use **backend-owned runtime flags** in Supabase for production-safe activation and deactivation without app redeploy.

## Current Implementation

- Flag table: `public.app_feature_flags`
- Read function: `public.is_feature_enabled(key, default)`
- App hook: `useAppFeatureFlag(...)`
- Active flags include:
- `chat_module_v1`
- `plan_limits_v1`

## Rollout Rules

- Ship code behind OFF flag
- Enable in controlled phase
- Monitor for regression
- Keep kill switch available

## Flag Naming Convention

`<domain>_<feature>_v<version>`

Examples:

- `chat_module_v1`
- `plan_limits_v1`

## SQL Cookbook

```sql
-- List flags
select key, enabled, description, updated_at
from public.app_feature_flags
order by key;

-- Enable a flag
update public.app_feature_flags
set enabled = true, updated_at = now()
where key = 'chat_module_v1';

-- Disable a flag (kill switch)
update public.app_feature_flags
set enabled = false, updated_at = now()
where key = 'chat_module_v1';

-- Upsert flag
insert into public.app_feature_flags (key, enabled, description)
values ('my_feature_v1', false, 'Short purpose')
on conflict (key)
do update set enabled = excluded.enabled, description = excluded.description, updated_at = now();
```

## Governance Recommendation

- Assign owner for every flag
- Define expected rollback behavior before enablement
- Remove stale flags after feature stabilization
