---
title: Subscription Plans
---

# Subscription Plans

## Plan Model (Configurable)

| Tier | Max Members | Max Admins | Max Active Invites | Storage |
| --- | ---: | ---: | ---: | ---: |
| Free | 50 | 1 | 3 | 1 GB |
| Pro | 150 | 3 | 25 | 10 GB |
| Business | 300 | 10 | 100 | 100 GB |

These values come from `community_plan_limits` and can be changed by SQL.

## Runtime Enforcement

Plan limits are enforced in the backend via:

- Trigger checks on `community_members` (member/admin limits)
- Trigger checks on `community_invites` (active invite limits)
- Join and discovery RPC checks (`search_joinable_communities`, `request_join_community`, `approve_join_request`, `join_community_by_invite_code`)

## Global Gate

Limit enforcement is globally controlled by app flag `plan_limits_v1` in `app_feature_flags`.

- `OFF`: limits are visible but not enforced
- `ON`: limits are enforced end-to-end

## Configuration Surface

- Defaults per tier: `community_plan_limits`
- Per-community overrides: `community_limit_overrides`
- Community tier: `communities.subscription_tier`

## Product Recommendation

- Keep Free strict (50 cap) to preserve micro-community quality
- Offer Pro/Business for growth and operational scale
- Use plan limits as quality control, not only as monetization
