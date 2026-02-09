# Feature Flags & Plugin Architecture

This document describes the current feature-flag system, how to enable/disable modules, and how subscription tiers are modeled for future use.

## Goals
- Allow community-specific modules (finance, polls, meetings, etc.) to be enabled/disabled.
- Keep UI and backend logic consistent via a single registry.
- Prepare for future subscription tiers without enabling billing yet.

## Core Concepts

### Feature Registry
Source of truth: `features/registry.ts`
- Each feature has:
  - `key`: unique id (e.g., `finance`, `polls`)
  - `label`, `description`, `icon`
  - `placements`: where it appears (`quick-actions`, `modules`, `settings`)
  - `flagField`: backing database flag (if it's a toggle)
  - `moduleRoute`: navigation target (optional)
  - `requiresPlan`: tier gating (currently all `free`)
  - `defaultSettings`: JSON defaults stored in DB (optional)

### Feature Flags (community-level)
Stored in `public.communities`:
- `feature_finance_enabled`
- `feature_polls_enabled`
- `feature_meetings_enabled`
- `feature_tasks_enabled`

Flags are toggled via Community Settings and drive feature visibility in the app.

### Feature Settings (per feature)
Stored in `public.community_feature_settings`:
- `community_id`
- `feature_key`
- `settings` (JSONB)

This is used for feature-specific configs (e.g., reminders enabled, default split behavior). Defaults are seeded on community creation from the registry.

Example task settings payload:
```json
{
  "reminders_enabled": true,
  "reminder_lead_hours": 24
}
```

### Subscription Tier (future-ready)
Stored in `public.communities.subscription_tier`:
- `free` (default)
- `pro`

Currently no billing is enforced. This only gates features when `requiresPlan: 'pro'` is set in the registry.

## How Feature Gating Works

### Enable/Disable (UI)
Community Settings uses the registry to render toggles. Updates are saved to the `communities` table.

### Runtime Check
Use `isFeatureEnabled(community, featureKey)` from `features/registry.ts`.
It checks:
1) Subscription entitlement (`requiresPlan` vs `community.subscription_tier`)
2) Flag field (if the feature is a toggle)

## Adding a New Feature

1) Add to registry (`features/registry.ts`):
   - `key`, `label`, `description`, `placements`
   - `flagField` if toggleable
   - `moduleRoute` if there's a screen
   - `defaultSettings` (optional)

2) Add DB flag (if required):
   - Add column to `communities`
   - Update migrations and `schema.sql`

3) Add UI route/screen and hook logic.

4) (Optional) Add settings:
   - Define defaults in registry
   - Read/update via `hooks/use-features.ts`

## Enabling/Disabling Features

### From UI
- Community Settings - Enable Features
- Toggle the module on/off
- Saved to the community record

### From SQL (manual)
```sql
update public.communities
set feature_finance_enabled = true
where id = '<community_id>';
```

## Subscription Policy (MVP)
- All features are currently available on `free`.
- `pro` is stored but not billed.
- To gate a feature in future:
  - Set `requiresPlan: 'pro'` in the registry
  - Add UI messaging in settings (upgrade CTA)

## Files
- `features/registry.ts`
- `hooks/use-features.ts`
- `app/community/[id]/settings.tsx`
- `app/community/[id]/index.tsx`
- `supabase/migrations/20260208183000_feature_settings_and_subscription.sql`
- `supabase/schema.sql`
