---
title: Data model (conceptual)
---

The data model is community-centric and keeps identity separate from community roles.

Core entities
- User: the account identity
- Profile: name, photo, and preferences
- Community: group container
- Membership: role and status within a community

Planning entities
- Event and meeting records
- Tasks and activities linked to events or meetings
- Attendance and RSVP status

Engagement entities
- Feed posts and comments
- Notifications tied to invites, tasks, and events

Operations entities
- Finance requests and settlements
- Media files tied to profiles, communities, and events

This model supports strong data isolation per community and scales as modules expand.
