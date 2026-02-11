---
title: Community Flow
---

# Community Flow

## Create Community

Creation uses `create_community_with_defaults(...)` and automatically:

- Creates the community row
- Adds creator as `owner`
- Seeds default feature settings per module
- Creates default `general` chat channel

## Discovery and Join

Supported paths:

- Invite code join
- Request-to-join flow with admin approval
- Public discovery for joinable communities

Join operations are executed via RPCs and validated server-side.

## Invite Management

- One-time email invites and reusable code invites
- Invite visibility and active-state controls
- Plan-aware active invite limits (when `plan_limits_v1` is enabled)

## Member and Role Management

- Owners/admins manage members
- Delegated permissions control what regular members can do
- Permissions are reflected in UI and enforced in RLS policy checks

## Privacy Modes

- `private`: invite only
- `request`: approval workflow
- `public`: open join behavior
