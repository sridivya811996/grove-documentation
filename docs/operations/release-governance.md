---
title: Release Governance
---

# Release Governance

## Environments and Change Control

- Local development with Supabase CLI
- Remote Supabase linked environment for integration
- Build and release via Expo/EAS

## Release Checklist

1. Confirm migrations are idempotent and reviewed.
2. Verify feature flags for release scope.
3. Run typecheck and lint.
4. Run smoke tests on core flows.
5. Validate notification and auth behavior.
6. Publish with release notes and rollback plan.

## Runtime Safety Controls

- Global flags for high-risk modules
- Plan limits can be toggled independently
- Chat visibility controlled without redeploy

## Operational Ownership

- Product owner: scope and rollout decision
- Engineering owner: technical validation and migration safety
- Operations owner: incident response and post-release monitoring
