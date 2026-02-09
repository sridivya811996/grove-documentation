---
title: System Architecture
sidebar_position: 2
description: Comprehensive architecture documentation for the Grove community platform
---

# System Architecture

Grove is a mobile-first community platform built on a modern, scalable architecture. This document provides a comprehensive overview of the system design, component interactions, and architectural decisions.

## High-Level Architecture Overview

The Grove platform follows a layered architecture pattern with clear separation of concerns between the mobile client, backend services, and external integrations.

```mermaid
flowchart TB
    subgraph Client["Mobile Client (Expo/React Native)"]
        UI[UI Components]
        Nav[Navigation Layer]
        State[State Management]
        Cache[Local Cache]
    end

    subgraph Backend["Backend Services (Supabase)"]
        Auth[Authentication]
        DB[(PostgreSQL)]
        Storage[Media Storage]
        Realtime[Realtime Engine]
        Edge[Edge Functions]
    end

    subgraph External["External Services"]
        Google[Google OAuth]
        Apple[Apple Sign-In]
        Push[Push Notifications]
        Email[Email Service]
    end

    Client <--> Backend
    Backend <--> External

    UI --> Nav
    Nav --> State
    State --> Cache

    Auth --> DB
    Realtime --> DB
    Edge --> DB
    Storage --> DB
```

## Architecture Principles

### 1. Community-Centric Design
Every feature and data model revolves around the **Community** as the primary organizational unit. This design enables:
- **Data Isolation**: Each community's data is logically separated
- **Feature Scoping**: Features can be enabled/disabled per community
- **Access Control**: Permissions cascade from community membership

### 2. Mobile-First with Offline Resilience
- Optimistic updates for responsive UX
- Local caching via React Query
- Graceful degradation when offline
- Background sync when connectivity returns

### 3. Feature Flag Architecture
- Communities can toggle optional features (Finance, Polls, Meetings, Tasks)
- Enables gradual rollout and A/B testing
- Supports tiered subscription plans

### 4. Security by Default
- Row Level Security (RLS) on all database tables
- Scoped media access through signed URLs
- Authentication required for all data access

---

## Client Architecture

The mobile application is built with Expo and React Native, using a modular architecture for maintainability and scalability.

### Application Layer Structure

```mermaid
flowchart LR
    subgraph Presentation["Presentation Layer"]
        Screens[Screens]
        Components[UI Components]
        Navigation[Expo Router]
    end

    subgraph Business["Business Logic Layer"]
        Hooks[Custom Hooks]
        Stores[Zustand Stores]
        Queries[React Query]
    end

    subgraph Data["Data Layer"]
        Supabase[Supabase Client]
        Storage[Secure Storage]
        Cache[Query Cache]
    end

    Presentation --> Business
    Business --> Data
```

### Directory Structure

```
grove-community/
├── app/                    # Expo Router screens (file-based routing)
│   ├── (auth)/            # Authentication flow screens
│   ├── (tabs)/            # Main tab navigation
│   ├── chat/              # Chat conversation screens
│   ├── community/         # Community management
│   ├── event/             # Event management
│   ├── notifications/     # Notification center
│   ├── profile/           # User profile
│   ├── transaction/       # Finance transactions
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable UI components
│   └── ui/               # Core design system components
├── constants/             # App constants and configuration
├── features/              # Feature flag registry
├── hooks/                 # Custom React hooks (data fetching)
├── lib/                   # Utility libraries
├── stores/                # Zustand state stores
├── supabase/              # Database migrations
└── types/                 # TypeScript definitions
```

### State Management Strategy

Grove uses a **hybrid state management** approach:

```mermaid
flowchart TB
    subgraph ServerState["Server State (React Query)"]
        Communities[Communities]
        Events[Events]
        Messages[Messages]
        Transactions[Transactions]
        Profiles[Profiles]
    end

    subgraph ClientState["Client State (Zustand)"]
        AuthStore[Auth Store]
        NotificationStore[Notification Store]
    end

    subgraph UIState["UI State (React)"]
        Forms[Form State]
        Modals[Modal State]
        Selection[Selection State]
    end

    ServerState --> |"Cache + Sync"| QueryCache[(Query Cache)]
    ClientState --> |"Persist"| SecureStore[(Secure Store)]
```

| State Type | Tool | Use Case |
|------------|------|----------|
| **Server State** | TanStack React Query | All data from Supabase (communities, events, messages, etc.) |
| **Auth State** | Zustand + Persist | User session, authentication status |
| **Notification State** | Zustand | Push token, unread counts |
| **UI State** | React useState/useReducer | Forms, modals, selections |

### Navigation Architecture

Grove uses **Expo Router** for file-based navigation with the following structure:

```mermaid
flowchart TB
    Root["/"] --> AuthCheck{Authenticated?}
    AuthCheck -->|No| AuthGroup["/(auth)"]
    AuthCheck -->|Yes| TabsGroup["/(tabs)"]

    subgraph AuthGroup["Authentication Flow"]
        Login["/login"]
        ForgotPwd["/forgot-password"]
        ResetPwd["/reset-password"]
        VerifyOTP["/verify-otp"]
        Callback["/callback"]
    end

    subgraph TabsGroup["Main App"]
        Home["/home"]
        Events["/events"]
        Feed["/feed"]
        Finance["/finance"]
        Profile["/profile"]
    end

    TabsGroup --> Modals["Modal Screens"]

    subgraph Modals["Overlay Screens"]
        CommunityCreate["/community/create"]
        EventCreate["/event/create"]
        Chat["/chat/[channelId]"]
        TransactionAdd["/transaction/add"]
    end
```

---

## Backend Architecture

Grove's backend is powered by **Supabase**, providing a fully managed PostgreSQL database with authentication, real-time subscriptions, and file storage.

### Backend Service Components

```mermaid
flowchart TB
    subgraph Supabase["Supabase Platform"]
        subgraph Auth["Authentication"]
            EmailAuth[Email/Password]
            OAuthProviders[OAuth Providers]
            SessionMgmt[Session Management]
        end

        subgraph Database["PostgreSQL"]
            Tables[(Data Tables)]
            RLS[Row Level Security]
            Functions[Database Functions]
            Triggers[Triggers]
        end

        subgraph Storage["File Storage"]
            Avatars[avatars/]
            CommunityImages[community-images/]
            ChatImages[chat-images/]
        end

        subgraph Realtime["Realtime Engine"]
            Subscriptions[Channel Subscriptions]
            Broadcast[Broadcast Events]
        end
    end

    Client[Mobile App] <-->|REST/WS| Supabase
```

### Database Schema Overview

The database is organized around the community-centric model with clear entity relationships:

```mermaid
erDiagram
    USERS ||--o{ PROFILES : has
    PROFILES ||--o{ COMMUNITY_MEMBERS : joins
    COMMUNITIES ||--o{ COMMUNITY_MEMBERS : has
    COMMUNITIES ||--o{ EVENTS : contains
    COMMUNITIES ||--o{ CHANNELS : has
    COMMUNITIES ||--o{ TRANSACTIONS : tracks
    COMMUNITIES ||--o{ POLLS : creates
    COMMUNITIES ||--o{ MEETINGS : schedules
    COMMUNITIES ||--o{ TASKS : manages

    CHANNELS ||--o{ MESSAGES : contains
    EVENTS ||--o{ EVENT_ATTENDEES : has
    POLLS ||--o{ POLL_VOTES : receives
    MEETINGS ||--o{ MEETING_ACTION_ITEMS : generates
    TASKS ||--o{ TASK_ASSIGNEES : assigned_to

    PROFILES {
        uuid id PK
        string email
        string full_name
        string avatar_url
        string phone
        string bio
    }

    COMMUNITIES {
        uuid id PK
        string name
        string description
        string invite_code
        enum join_mode
        boolean feature_finance_enabled
        boolean feature_polls_enabled
        enum subscription_tier
    }

    COMMUNITY_MEMBERS {
        uuid id PK
        uuid community_id FK
        uuid user_id FK
        enum role
        timestamp joined_at
    }

    EVENTS {
        uuid id PK
        uuid community_id FK
        string title
        timestamp start_time
        boolean is_recurring
        enum recurrence_type
    }

    MESSAGES {
        uuid id PK
        uuid channel_id FK
        uuid user_id FK
        text content
        array media_urls
        timestamp created_at
    }
```

### Row Level Security (RLS) Patterns

All tables implement RLS policies to ensure data isolation and proper authorization:

```mermaid
flowchart LR
    Request[API Request] --> Auth{Authenticated?}
    Auth -->|No| Denied[403 Forbidden]
    Auth -->|Yes| Member{Community Member?}
    Member -->|No| Denied
    Member -->|Yes| Role{Check Role}
    Role -->|Owner/Admin| FullAccess[Read/Write/Delete]
    Role -->|Member| LimitedAccess[Read + Own Writes]
```

**Common RLS Policy Patterns:**
1. **Community Membership**: Users can only access data for communities they belong to
2. **Role-Based Access**: Admins and owners have elevated permissions
3. **Ownership**: Users can modify their own content (posts, messages, profiles)
4. **Feature Flags**: Data access respects community feature toggles

---

## Module Architecture

Grove features are organized into logical modules, each with clear boundaries and responsibilities.

### Module Dependency Diagram

```mermaid
flowchart TB
    subgraph Core["Core Module"]
        Auth[Authentication]
        Profile[Profile Management]
        Community[Community Management]
        Membership[Membership & Roles]
    end

    subgraph Planning["Planning Module"]
        Events[Events & Meetings]
        Tasks[Task Management]
        Calendar[Calendar Views]
    end

    subgraph Engagement["Engagement Module"]
        Feed[Community Feed]
        Chat[Real-time Chat]
        Notifications[Notifications]
    end

    subgraph Operations["Operations Module"]
        Finance[Finance & Contributions]
        Polls[Polls & Voting]
        Reports[Reporting]
    end

    Core --> Planning
    Core --> Engagement
    Core --> Operations

    Planning --> Engagement
    Operations --> Engagement
```

### Feature Module Details

| Module | Components | Status |
|--------|------------|--------|
| **Core** | Auth, Profiles, Communities, Membership | Always enabled |
| **Planning** | Events, Meetings, Tasks | Events always on; others toggleable |
| **Engagement** | Feed, Chat, Notifications | Always enabled |
| **Operations** | Finance, Polls | Toggleable per community |

---

## Integration Architecture

### Authentication Flow

Grove supports multiple authentication methods, all managed through Supabase Auth:

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Supabase
    participant OAuth as OAuth Provider

    alt Email/Password
        User->>App: Enter credentials
        App->>Supabase: signInWithPassword()
        Supabase->>App: Session + Tokens
    else Google OAuth
        User->>App: Tap "Sign in with Google"
        App->>OAuth: Redirect to Google
        OAuth->>User: Consent screen
        User->>OAuth: Grant permission
        OAuth->>App: Auth code
        App->>Supabase: exchangeCodeForSession()
        Supabase->>App: Session + Tokens
    else Apple Sign-In
        User->>App: Tap "Sign in with Apple"
        App->>OAuth: Native Apple auth
        OAuth->>App: Identity token
        App->>Supabase: signInWithIdToken()
        Supabase->>App: Session + Tokens
    end

    App->>App: Store session securely
    App->>User: Navigate to home
```

### Real-time Messaging Architecture

Chat messages use Supabase Realtime for instant delivery:

```mermaid
sequenceDiagram
    participant Sender
    participant App1 as Sender App
    participant Supabase
    participant App2 as Receiver App
    participant Receiver

    Sender->>App1: Type message
    App1->>App1: Optimistic update (show immediately)
    App1->>Supabase: INSERT message
    Supabase->>Supabase: Validate & store
    Supabase-->>App1: Confirm insert
    Supabase->>App2: Realtime broadcast
    App2->>App2: Update message list
    App2->>Receiver: Show new message

    Note over App1,App2: Retry with exponential backoff on failure
```

### Push Notification Flow

```mermaid
sequenceDiagram
    participant Trigger as Event Trigger
    participant Edge as Edge Function
    participant DB as Database
    participant Expo as Expo Push Service
    participant Device as User Device

    Trigger->>Edge: Event occurred (new event, task assigned)
    Edge->>DB: Query affected users
    DB->>Edge: User list with push tokens
    Edge->>Expo: Send push notifications
    Expo->>Device: Deliver notification
    Device->>Device: Show notification
```

---

## Data Flow Patterns

### Community Join Flow

```mermaid
flowchart TB
    Start([User wants to join]) --> JoinMode{Join Mode?}

    JoinMode -->|Public| DirectJoin[Join immediately]
    JoinMode -->|Request| SubmitRequest[Submit join request]
    JoinMode -->|Private| EnterCode[Enter invite code]

    SubmitRequest --> PendingApproval[Wait for admin approval]
    PendingApproval --> AdminAction{Admin decision}
    AdminAction -->|Approve| AddMember[Add as member]
    AdminAction -->|Decline| Rejected[Request declined]

    EnterCode --> ValidateCode{Code valid?}
    ValidateCode -->|Yes| AddMember
    ValidateCode -->|No| InvalidCode[Show error]

    DirectJoin --> AddMember
    AddMember --> RefreshData[Refresh community data]
    RefreshData --> Success([Joined successfully])
```

### Event Creation Flow

```mermaid
flowchart TB
    Start([Create Event]) --> FillForm[Fill event details]
    FillForm --> Recurring{Recurring event?}

    Recurring -->|No| SingleEvent[Create single event]
    Recurring -->|Yes| SetRecurrence[Set recurrence pattern]
    SetRecurrence --> GenerateInstances[Generate recurring instances]
    GenerateInstances --> SaveInstances[Save all instances]

    SingleEvent --> SaveEvent[Save event]
    SaveInstances --> SaveEvent

    SaveEvent --> NotifyMembers[Notify community members]
    NotifyMembers --> Success([Event created])
```

---

## Scalability Considerations

### Current Architecture Limits

| Resource | Free Tier Limit | Notes |
|----------|-----------------|-------|
| Database Size | 500 MB | Sufficient for MVP |
| Storage | 1 GB | Images compressed client-side |
| API Requests | 2M/month | Rate limited per user |
| Realtime Connections | 200 concurrent | Per project |
| Edge Function Invocations | 500K/month | For notifications |

### Scaling Path

1. **Phase 1 (MVP)**: Supabase Free Tier
2. **Phase 2 (Growth)**: Supabase Pro ($25/month)
3. **Phase 3 (Scale)**: Custom PostgreSQL + dedicated services

---

## Security Architecture

### Defense Layers

```mermaid
flowchart TB
    subgraph Layer1["Transport Security"]
        TLS[TLS 1.3 Encryption]
    end

    subgraph Layer2["Authentication"]
        JWT[JWT Tokens]
        OAuth[OAuth 2.0]
        Session[Secure Sessions]
    end

    subgraph Layer3["Authorization"]
        RLS[Row Level Security]
        Roles[Role-Based Access]
        Community[Community Scoping]
    end

    subgraph Layer4["Data Protection"]
        Encryption[Encryption at Rest]
        Backups[Automated Backups]
        Audit[Audit Logging]
    end

    Layer1 --> Layer2 --> Layer3 --> Layer4
```

### Security Checklist

- [x] All API calls over HTTPS
- [x] JWT tokens stored in secure storage (Keychain/Keystore)
- [x] Row Level Security on all tables
- [x] Input validation on client and server
- [x] Parameterized queries (no SQL injection)
- [x] Media URLs signed with expiration
- [x] Rate limiting on authentication endpoints

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Mobile Framework** | Expo SDK 54 | Cross-platform development |
| **UI Framework** | React Native 0.81 | Native mobile UI |
| **Navigation** | Expo Router 6 | File-based routing |
| **Styling** | NativeWind (Tailwind) | Utility-first CSS |
| **Server State** | TanStack React Query 5 | Caching and sync |
| **Client State** | Zustand 5 | Lightweight stores |
| **Backend** | Supabase | PostgreSQL + Auth + Storage |
| **Realtime** | Supabase Realtime | WebSocket subscriptions |
| **Push Notifications** | Expo Notifications | Cross-platform push |
| **Animations** | React Native Reanimated 4 | Performant animations |

---

## Future Architecture Evolution

### Planned Enhancements

1. **Offline-First Sync**: Implement local SQLite with sync engine
2. **Edge Computing**: Move notification logic to edge functions
3. **CDN Integration**: Serve static assets from global CDN
4. **Analytics Pipeline**: Event streaming for product analytics
5. **Payment Integration**: Stripe Connect for community payments
