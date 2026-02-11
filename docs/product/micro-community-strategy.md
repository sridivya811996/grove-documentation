---
title: Micro Community Strategy
sidebar_position: 8
description: Product strategy, positioning, plan architecture, and rollout model for Grove as a micro-community platform.
---

# Micro Community Strategy

## Summary

Grove should be positioned as a **micro-community platform**: small, trusted circles that stay useful and organized.

The goal is not to become another mass social feed. The goal is to become the default operating system for intentional groups: apartments, alumni circles, hobby clubs, parent groups, and local organizations.

Core direction:
- Optimize for trust, clarity, and participation quality.
- Keep communities intentionally bounded by plan.
- Use limits as a product strength, not a weakness.

Recommended brand line:
- **Small by design, strong by nature.**

Alternate lines:
- Your people, your place.
- Where every voice matters.

## Why This Positioning Works

Market and behavior signals indicate users are overloaded by broad social networks and increasingly value focused, meaningful community spaces.

Practical implications for Grove:
- Competing with WhatsApp/Discord/Facebook on scale is low leverage.
- Competing on **signal quality** and **group health** is high leverage.
- Hard and visible limits can increase clarity and reduce spam/noise.

## Product Pillars

1. Intentional membership
- Join flow is invite-first or request-based.
- Admins control growth and trust boundaries.

2. Bounded scale
- Community size is capped by plan.
- Admin and invite caps avoid uncontrolled expansion.

3. Action-oriented collaboration
- Events, tasks, finance, and announcements are first-class.
- Utility over passive feed consumption.

4. Configurable governance
- Delegated permissions for members (event creation, feed posting, finance entry, invites, tasks).
- Admins always retain full control.

## Plan Model

### Tier Targets

| Tier | Member Cap | Admin Cap | Active Invite Cap | Storage Cap |
| --- | ---: | ---: | ---: | ---: |
| Free | 50 | 1 | 3 | 1 GB |
| Pro | 150 | 3 | 25 | 10 GB |
| Business | 300 | 10 | 100 | 100 GB |

Notes:
- `Admin cap` here means admin-role users, excluding owner.
- Larger organizations can use Business or multiple communities.

### Suggested Pricing Envelope

| Tier | Monthly | Annual |
| --- | ---: | ---: |
| Free | $0 | $0 |
| Pro | $15 | $150 |
| Business | $39 | $390 |

This pricing should be validated with pilot communities before public launch.

## Control Surface to Keep Configurable

1. Growth controls
- Max members
- Max admins
- Max active invites

2. Activity controls
- Event creation permissions
- Feed posting permissions
- Task creation permissions
- Finance entry permissions

3. Cost controls
- Storage quota
- Per-file upload size and file count (already implemented for events)

4. Access controls
- Join mode (private/request/public)
- Invite policy (admin-only or delegated)

## MVP and Rollout

### Current state
Plan-limit infrastructure exists in app + DB, but it is gated with a global feature flag and should remain OFF for MVP.

Flag key:
- `plan_limits_v1`

Default:
- `false` (OFF)

### Rollout phases

1. MVP (current)
- Keep `plan_limits_v1 = false`.
- No customer-facing subscription controls in app.
- Continue validating core workflows and retention.

2. Soft launch
- Enable `plan_limits_v1` for internal/pilot communities.
- Measure conversion triggers and friction points.

3. Public launch
- Turn on plan limits broadly.
- Add billing integration and upgrade UX.

## Risks and Mitigations

1. Growth ceiling concern
- Mitigation: allow users to create and manage multiple communities.

2. Empty-room effect
- Mitigation: onboarding templates, first-week checklist, starter prompts.

3. Perceived exclusivity
- Mitigation: support request-to-join mode and transparent acceptance criteria.

4. Premature monetization friction
- Mitigation: keep limits behind feature flag until core engagement metrics are healthy.

## KPI Framework

Track these before scaling paid plans:
- Day-7 and Day-30 community retention
- Weekly active members per community
- RSVP completion rate for events
- Task completion rate
- Invite acceptance rate
- Upgrade intent signals at 80% and 95% usage

## Positioning Guardrails

What Grove should become:
- The best app for running small, high-trust communities.

What Grove should avoid:
- Infinite-scroll, ad-driven, broad-interest social feed dynamics.
- Feature bloat that weakens the core operations experience.
