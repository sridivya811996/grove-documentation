---
title: Maintenance and Budgeting
---

# Maintenance and Budgeting

## Maintenance Cadence

- Weekly: error review, flag review, backlog triage
- Bi-weekly: migration hygiene, dependency review
- Monthly: performance and cost review, stale feature cleanup
- Quarterly: architecture and security review

## Cost Drivers

- Supabase database/storage usage
- Realtime traffic from chat activity
- Push/email notification volume
- Build and distribution pipeline usage

## Budget Guardrails

- Enforce plan and storage controls
- Keep heavy modules behind flags until usage justifies rollout
- Track top cost contributors by module
- Set monthly budget thresholds and alerting

## Reliability Controls

- Use staged flag rollout for risky changes
- Keep SQL-based kill switches documented
- Avoid direct destructive schema changes without migration fallback

## Product-Budget Alignment

Micro-community positioning supports predictable cost envelopes.
The strongest cost control remains intentional community size and controlled feature activation.
