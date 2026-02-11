---
title: Feed and Chat Flow
---

# Feed and Chat Flow

## Feed

Feed supports:

- Community posts
- Comments and threaded context
- Mentions and notification creation

Posting rights are controlled by delegated member permission `feed_post`.

## Chat

Chat supports:

- Community channels
- Channel messages
- Realtime message updates

Runtime availability is gated by global feature flag `chat_module_v1`.

## Flag-Aware UX

When chat is disabled:

- Chat tab is hidden from navigation
- Chat routes show an unavailable state

This prevents partial exposure during staged rollout.

## Moderation Baseline

Current baseline is role and membership constrained access.
Advanced moderation workflows can be layered later without schema break.
