---
title: Functional Specification
sidebar_position: 4
description: Comprehensive functional specification for the Grove community platform
---

# Functional Specification

This document provides a complete functional specification for the Grove community platform, detailing features, user flows, and acceptance criteria for MVP and future phases.

## Executive Summary

Grove is a mobile-first platform that helps local communities coordinate their activities through a unified app experience. The platform replaces fragmented tools (WhatsApp groups, spreadsheets, email chains) with a purpose-built solution for community management.

### Key Value Propositions

```mermaid
mindmap
  root((Grove))
    For Community Leaders
      Single Dashboard
      Member Management
      Event Coordination
      Finance Tracking
    For Members
      One App for All Communities
      Easy RSVPs
      Clear Communication
      Contribution Tracking
    Versus Alternatives
      Simpler than Enterprise Tools
      More Organized than WhatsApp
      Purpose-Built for Communities
```

---

## MVP Scope (Phase 1)

### Core Features Overview

```mermaid
flowchart TB
    subgraph Auth["Authentication"]
        SignIn[Sign In/Sign Up]
        OAuth[Google/Apple OAuth]
        Session[Session Management]
    end

    subgraph Community["Community Management"]
        Create[Create Community]
        Join[Join Community]
        Manage[Manage Members]
        Settings[Community Settings]
    end

    subgraph Events["Events & Meetings"]
        CreateEvent[Create Events]
        RSVP[RSVP System]
        Recurring[Recurring Events]
        Reminders[Event Reminders]
    end

    subgraph Engagement["Engagement"]
        Feed[Community Feed]
        Chat[Real-time Chat]
        Notifications[Push Notifications]
    end

    subgraph Operations["Operations"]
        Finance[Finance Tracking]
        Contributions[Contribution Requests]
        Tasks[Task Management]
    end

    Auth --> Community
    Community --> Events
    Community --> Engagement
    Community --> Operations
```

---

## Feature Specifications

### 1. Authentication

#### 1.1 Email Authentication

**User Flow:**

```mermaid
flowchart TB
    Start[App Launch] --> Check{Has Session?}
    Check -->|Yes| Home[Home Screen]
    Check -->|No| Login[Login Screen]

    Login --> Method{Auth Method}
    Method -->|Email| EmailFlow[Enter Email]
    Method -->|Google| GoogleOAuth[Google Sign-In]
    Method -->|Apple| AppleAuth[Apple Sign-In]

    EmailFlow --> HasAccount{Existing Account?}
    HasAccount -->|Yes| Password[Enter Password]
    HasAccount -->|No| SignUp[Create Account]

    Password --> Verify[Verify Credentials]
    SignUp --> SetPassword[Set Password]
    SetPassword --> CreateProfile[Create Profile]

    Verify --> Home
    CreateProfile --> Home
    GoogleOAuth --> Home
    AppleAuth --> Home
```

**Acceptance Criteria:**

| Scenario | Expected Behavior |
|----------|-------------------|
| Valid email + password | User logged in, redirected to home |
| Invalid password | Error message, retry allowed |
| New email | Prompt to create account |
| Weak password | Show password requirements |
| Network error | Offline message with retry |

#### 1.2 OAuth Sign-In

**Supported Providers:**
- Google Sign-In (iOS, Android)
- Apple Sign-In (iOS only, required by Apple)

**Flow Diagram:**

```mermaid
sequenceDiagram
    participant User
    participant App
    participant OAuth as OAuth Provider
    participant Backend as Supabase

    User->>App: Tap "Sign in with Google/Apple"
    App->>OAuth: Initiate OAuth flow
    OAuth->>User: Show consent screen
    User->>OAuth: Grant permission
    OAuth->>App: Return tokens
    App->>Backend: Exchange for session
    Backend->>Backend: Create/update user
    Backend->>App: Session tokens
    App->>User: Navigate to home
```

#### 1.3 Password Recovery

**Flow:**
1. User taps "Forgot Password"
2. Enter registered email
3. Receive reset link via email
4. Click link to open app
5. Enter new password
6. Password updated, redirected to login

---

### 2. Community Management

#### 2.1 Create Community

**Form Fields:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | Text | Yes | 3-50 characters |
| Description | Textarea | No | Max 500 characters |
| Category | Select | No | Predefined list |
| Location | Text | No | City/Region |
| Image | Image | No | Max 5MB, JPEG/PNG |
| Join Mode | Radio | Yes | Private/Request/Public |

**Flow Diagram:**

```mermaid
flowchart TB
    Start[Create Community] --> Form[Fill Form]
    Form --> Image{Add Image?}
    Image -->|Yes| Upload[Upload Image]
    Image -->|No| Save
    Upload --> Save[Save Community]
    Save --> Generate[Generate Invite Code]
    Generate --> Navigate[Open Community]
    Navigate --> Invite[Prompt to Invite Members]
```

#### 2.2 Join Community

**Three Join Methods:**

```mermaid
flowchart TB
    JoinCommunity[Join Community] --> Method{Method}

    Method -->|Invite Code| EnterCode[Enter Invite Code]
    EnterCode --> Validate{Valid?}
    Validate -->|Yes| JoinDirect[Join Immediately]
    Validate -->|No| Error1[Invalid Code Error]

    Method -->|QR Code| ScanQR[Scan QR Code]
    ScanQR --> JoinDirect

    Method -->|Discovery| Browse[Browse Communities]
    Browse --> Select[Select Community]
    Select --> JoinMode{Join Mode?}
    JoinMode -->|Public| JoinDirect
    JoinMode -->|Request| SendRequest[Send Join Request]
    SendRequest --> Pending[Await Approval]
    Pending --> Approved{Approved?}
    Approved -->|Yes| JoinDirect
    Approved -->|No| Declined[Request Declined]

    JoinDirect --> Member[Now a Member]
```

#### 2.3 Member Management

**Admin Capabilities:**

| Action | Owner | Admin | Member |
|--------|-------|-------|--------|
| View members | Yes | Yes | Yes |
| Invite members | Yes | Yes | No |
| Approve requests | Yes | Yes | No |
| Remove members | Yes | Yes (not owner) | No |
| Change roles | Yes | No | No |
| Transfer ownership | Yes | No | No |

**Member List Screen:**
- Display name and avatar
- Show role badge (Owner/Admin/Member)
- Join date
- Admin actions menu

---

### 3. Events & Meetings

#### 3.1 Create Event

**Event Creation Flow:**

```mermaid
flowchart TB
    Start[Create Event] --> Basic[Basic Details]
    Basic --> Timing[Date & Time]
    Timing --> Location[Location Optional]
    Location --> Recurring{Recurring?}

    Recurring -->|No| Review[Review & Create]
    Recurring -->|Yes| Pattern[Set Pattern]
    Pattern --> EndDate[End Date Optional]
    EndDate --> Review

    Review --> Notify[Notify Members]
    Notify --> Created[Event Created]
```

**Event Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Title | Text | Yes | Max 100 characters |
| Description | Textarea | No | Max 1000 characters |
| Start Date/Time | DateTime | Yes | Must be future |
| End Date/Time | DateTime | No | After start time |
| Location | Text | No | Free text |
| Agenda | Textarea | No | Meeting agenda |
| Is Recurring | Toggle | No | Default: No |
| Recurrence Type | Select | If recurring | Daily/Weekly/Biweekly/Monthly/Yearly |
| Recurrence Days | Multi-select | If weekly | Sunday-Saturday |
| Recurrence End | Date | If recurring | Optional end date |

#### 3.2 Recurring Events

**Recurrence Patterns:**

```mermaid
gantt
    title Recurring Event Examples
    dateFormat  YYYY-MM-DD
    section Weekly (Mon, Wed)
    Meeting    :2024-01-01, 1d
    Meeting    :2024-01-03, 1d
    Meeting    :2024-01-08, 1d
    Meeting    :2024-01-10, 1d

    section Biweekly
    Standup    :2024-01-01, 1d
    Standup    :2024-01-15, 1d
    Standup    :2024-01-29, 1d

    section Monthly
    Review     :2024-01-15, 1d
    Review     :2024-02-15, 1d
    Review     :2024-03-15, 1d
```

#### 3.3 RSVP System

**RSVP States:**

```mermaid
stateDiagram-v2
    [*] --> NoResponse
    NoResponse --> Going: Mark Going
    NoResponse --> Maybe: Mark Maybe
    NoResponse --> NotGoing: Mark Not Going
    Going --> Maybe: Change
    Going --> NotGoing: Change
    Maybe --> Going: Change
    Maybe --> NotGoing: Change
    NotGoing --> Going: Change
    NotGoing --> Maybe: Change
```

**RSVP Display:**
- Going count with member avatars
- Maybe count
- Not Going count
- No Response count
- Quick actions to change status

---

### 4. Communication

#### 4.1 Community Feed

**Post Types:**
- Text post
- Image post (up to 4 images)
- Mixed text and images

**Feed Features:**
- Chronological display
- Pull to refresh
- Infinite scroll pagination
- Post author with avatar
- Timestamp (relative)
- Comment count
- Quick comment access

**Post Actions:**
- Add comment
- Edit (own posts only)
- Delete (own posts or admin)

#### 4.2 Real-time Chat

**Chat Flow:**

```mermaid
sequenceDiagram
    participant User1 as Sender
    participant App1 as Sender App
    participant Backend as Supabase Realtime
    participant App2 as Receiver App
    participant User2 as Receiver

    User1->>App1: Type message
    App1->>App1: Show optimistically
    App1->>Backend: Send message
    Backend->>Backend: Store message
    Backend->>App2: Broadcast
    App2->>User2: Show notification
    App2->>App2: Update chat list
```

**Message Features:**
- Text messages
- Image attachments (up to 4)
- Delivery status indicators
- Typing indicators (future)
- Read receipts (future)

#### 4.3 Notifications

**Notification Types:**

| Type | Trigger | Sound | Badge |
|------|---------|-------|-------|
| Event Reminder | 1 hour before | Yes | Yes |
| New Message | Message in channel | Yes | Yes |
| Task Assigned | Task assignment | Yes | Yes |
| Join Request | User requests | Yes | Yes |
| Request Approved | Admin approves | Yes | Yes |
| Contribution Due | Payment reminder | Yes | Yes |

---

### 5. Finance & Contributions

#### 5.1 Transaction Tracking

**Transaction Types:**

```mermaid
flowchart LR
    subgraph Income
        Dues[Member Dues]
        Donations[Donations]
        Sales[Event Sales]
        Other1[Other Income]
    end

    subgraph Expenses
        Venue[Venue Costs]
        Supplies[Supplies]
        Services[Services]
        Other2[Other Expenses]
    end

    Income --> Balance[(Community Balance)]
    Balance --> Expenses
```

**Transaction Fields:**

| Field | Type | Required |
|-------|------|----------|
| Type | Select | Yes (Income/Expense) |
| Amount | Number | Yes |
| Currency | Select | Yes (default from settings) |
| Description | Text | Yes |
| Category | Select | No |
| Date | Date | Yes (default today) |
| Receipt | Image | No |

#### 5.2 Contribution Requests

**Contribution Flow:**

```mermaid
flowchart TB
    Admin[Admin Creates Request] --> Details[Set Amount & Description]
    Details --> Split[Auto-split Among Members]
    Split --> Notify[Notify All Members]

    Notify --> MemberView[Member Views Request]
    MemberView --> Pay[Mark as Paid]
    Pay --> AdminVerify[Admin Verifies]
    AdminVerify --> Settled[Mark as Settled]

    Settled --> Complete{All Settled?}
    Complete -->|Yes| Close[Close Request]
    Complete -->|No| Remind[Send Reminders]
    Remind --> MemberView
```

**Request Features:**
- Total amount and per-member split
- Due date
- Settlement tracking per member
- Payment confirmation
- Outstanding balance view

---

### 6. User Profile

#### 6.1 Profile Fields

| Field | Editable | Visibility |
|-------|----------|------------|
| Full Name | Yes | Community members |
| Avatar | Yes | Community members |
| Email | No (from auth) | Settings only |
| Phone | Yes | Optional |
| Bio | Yes | Community members |
| Preferred Currency | Yes | Self only |

#### 6.2 Profile Actions

- Edit profile
- Change password
- Notification settings
- Community list
- Leave community
- Sign out
- Delete account

---

## Phase 2 Enhancements

### Planned Features

```mermaid
timeline
    title Phase 2 Feature Roadmap
    section Q2 2024
        Public Community Pages : Richer descriptions
        Admin Analytics : Engagement metrics
        Reminder Customization : Per-event settings
    section Q3 2024
        Document Management : File uploads
        Granular Permissions : Custom roles
        Meeting Notes : Collaborative editing
```

**Feature Details:**

| Feature | Description | Priority |
|---------|-------------|----------|
| Public Pages | SEO-friendly community pages | High |
| Analytics Dashboard | Event attendance, engagement trends | High |
| Custom Reminders | Configure reminder timing per event | Medium |
| Document Storage | Upload and share files | Medium |
| Custom Roles | Define custom permission sets | Low |
| Meeting Notes | Collaborative note-taking | Medium |

---

## Phase 3 Long-term

### Future Capabilities

```mermaid
mindmap
  root((Phase 3))
    Payments
      Stripe Connect
      Automated Dues
      Payment History
    Integrations
      Google Calendar
      Apple Calendar
      Email Digests
    Premium
      Subscription Tiers
      Advanced Analytics
      White-label Options
    Scale
      Multi-language
      Advanced Search
      Data Export
```

---

## Out of Scope (MVP)

The following features are explicitly excluded from MVP:

| Feature | Reason | Future Phase |
|---------|--------|--------------|
| Real-time video | Complexity, infrastructure | Phase 3+ |
| Payment processing | Regulatory, complexity | Phase 2 |
| Advanced moderation | Manual review sufficient | Phase 2 |
| Public discovery | Focus on invited communities | Phase 2 |
| Desktop/web app | Mobile-first priority | Phase 3 |
| API for integrations | Internal use only | Phase 3 |

---

## Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| App launch | < 2 seconds |
| Screen navigation | < 300ms |
| API response (p95) | < 500ms |
| Image upload | < 5 seconds |
| Push delivery | < 10 seconds |

### Reliability

| Metric | Target |
|--------|--------|
| App crash rate | < 0.1% |
| API availability | 99.9% |
| Data durability | 99.99% |

### Security

See [Security & Privacy](/docs/technical/security-privacy) documentation.

### Accessibility

- VoiceOver/TalkBack support
- Minimum touch targets (44pt)
- Color contrast compliance (WCAG AA)
- Screen reader labels

---

## Success Metrics

### MVP Launch Criteria

- [ ] All P0 features functional
- [ ] < 1% crash rate
- [ ] < 500ms p95 API latency
- [ ] Passing security review
- [ ] Privacy policy published
- [ ] App store compliance

### Key Performance Indicators

| Metric | Target (Launch +30d) |
|--------|---------------------|
| Daily Active Users | 100+ |
| Communities Created | 20+ |
| Events Created | 50+ |
| User Retention (D7) | > 30% |
| App Store Rating | > 4.0 |
