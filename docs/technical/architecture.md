---
title: Architecture
---

Grove is organized around communities as the primary unit of data, access, and features.

Client layers
- Authentication and session handling
- Community context and membership
- Feature modules (events, tasks, feed, finance)
- Local caching for responsiveness

Backend layers
- Authentication and identity management
- Data access with row-level security
- Background jobs for notifications
- Media storage with scoped permissions

Module boundaries
- Community core: memberships, roles, settings, join requests
- Planning: events, meetings, tasks
- Engagement: feed posts and comments
- Operations: finance and contributions

Integration points
- Sign-in providers
- Notification delivery and email
- Media processing pipeline (future)

This structure keeps concerns separated, supports feature flags, and enables future paid modules without redesigning the core.
