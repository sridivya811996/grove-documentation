---
title: Event Flow
---

# Event Flow

## Event Lifecycle

- Create event with date/time, location, and metadata
- Edit and delete by creator/admin
- RSVP statuses: `going`, `maybe`, `not_going`
- Event reminder scheduling for attendees

## Agenda and Files

Implemented event collaboration features:

- `events.agenda`: free-form summary
- `events.agenda_items`: structured agenda JSON
- Event file attachments with hard limits:
- Max file size: 5MB
- Max file count: 5 files per event

Server-side enforcement exists in DB checks, triggers, and storage policies.

## Integrated Event Operations

- Event-linked task creation and assignment
- Event-linked expense tracking and summary
- Attendee management and RSVP counters

## Access and Control

- Event management: creator or community admin
- File upload/delete: organizer or uploader policy paths
- Task creation: permission and role dependent
