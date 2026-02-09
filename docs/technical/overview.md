---
title: Technical Overview
sidebar_position: 1
description: High-level technical overview of the Grove community platform
---

# Technical Overview

Grove is a **mobile-first community platform** designed to help local groups, clubs, and organizations coordinate their activities without the complexity of enterprise software. This document provides a comprehensive technical overview of the platform's design philosophy, core capabilities, and technology choices.

## Platform Vision

```mermaid
mindmap
  root((Grove Platform))
    Mobile First
      iOS Native Feel
      Android Native Feel
      Offline Resilient
      Push Notifications
    Community Centric
      Membership Management
      Role-Based Access
      Feature Toggles
      Join Workflows
    Coordination
      Events & Meetings
      Tasks & Activities
      Finance Tracking
      Polls & Voting
    Engagement
      Real-time Chat
      Community Feed
      Notifications
```

## Guiding Principles

### 1. Ship Quickly Without Sacrificing Reliability

Grove uses managed services (Supabase, Expo) to minimize infrastructure overhead while maintaining enterprise-grade reliability:

| Aspect | Approach |
|--------|----------|
| **Database** | Managed PostgreSQL with automatic backups |
| **Authentication** | Supabase Auth with OAuth providers |
| **Storage** | Supabase Storage with CDN |
| **Builds** | EAS Build for iOS and Android |
| **Updates** | OTA updates via EAS Update |

### 2. Keep the Data Model Simple and Extensible

The database schema follows a **community-centric** design where:
- Communities are the top-level organizing entity
- All features are scoped to communities
- Users can belong to multiple communities with different roles
- New features can be added without schema redesign

```mermaid
flowchart LR
    subgraph Community["Community Boundary"]
        Members[Members]
        Events[Events]
        Chat[Chat]
        Feed[Feed]
        Finance[Finance]
        Polls[Polls]
        Tasks[Tasks]
    end

    User1[User A] -->|Member| Community
    User2[User B] -->|Admin| Community
    User3[User C] -->|Owner| Community
```

### 3. Support Feature Flags for Optional Modules

Not all communities need all features. Grove implements **toggleable feature modules**:

| Feature | Default | Toggleable |
|---------|---------|------------|
| Events | Enabled | No |
| Chat | Enabled | No |
| Feed | Enabled | No |
| Finance | Disabled | Yes |
| Polls | Disabled | Yes |
| Meetings | Disabled | Yes |
| Tasks | Disabled | Yes |

```mermaid
flowchart TB
    Community[Community Created] --> Core[Core Features<br/>Events, Chat, Feed]
    Core --> Toggle{Enable Optional?}
    Toggle -->|Yes| Finance[Finance Module]
    Toggle -->|Yes| Polls[Polls Module]
    Toggle -->|Yes| Meetings[Meetings Module]
    Toggle -->|Yes| Tasks[Tasks Module]
    Toggle -->|No| Ready[Ready to Use]
    Finance --> Ready
    Polls --> Ready
    Meetings --> Ready
    Tasks --> Ready
```

### 4. Treat Privacy and Trust as First-Class Requirements

Security is built into every layer:

```mermaid
flowchart TB
    subgraph Security["Security Layers"]
        direction TB
        Transport["Transport Security<br/>TLS 1.3, Certificate Pinning"]
        Auth["Authentication<br/>JWT, OAuth 2.0, Secure Sessions"]
        Authorization["Authorization<br/>Row Level Security, Role-Based Access"]
        Data["Data Protection<br/>Encryption at Rest, Signed URLs"]
    end

    Transport --> Auth --> Authorization --> Data
```

---

## Core Components

### Mobile Client

The mobile application is the primary interface for Grove users.

```mermaid
block-beta
    columns 3

    block:presentation["Presentation"]:3
        screens["Screens"]
        components["Components"]
        navigation["Navigation"]
    end

    block:business["Business Logic"]:3
        hooks["Custom Hooks"]
        state["State Management"]
        validation["Validation"]
    end

    block:data["Data Layer"]:3
        supabase["Supabase Client"]
        cache["Query Cache"]
        storage["Secure Storage"]
    end
```

**Key Technologies:**
- **Expo SDK 54**: Managed workflow for rapid development
- **React Native 0.81**: Cross-platform native UI
- **Expo Router 6**: File-based navigation
- **NativeWind**: Tailwind CSS for React Native
- **React Query**: Server state management
- **Zustand**: Client state management

### Backend Services

Supabase provides a complete backend infrastructure:

```mermaid
flowchart LR
    subgraph Client
        App[Mobile App]
    end

    subgraph Supabase["Supabase Platform"]
        Auth[Auth Service]
        API[REST API]
        Realtime[Realtime WS]
        Storage[File Storage]
        DB[(PostgreSQL)]
    end

    App <-->|HTTPS| Auth
    App <-->|HTTPS| API
    App <-->|WSS| Realtime
    App <-->|HTTPS| Storage

    Auth --> DB
    API --> DB
    Realtime --> DB
```

**Backend Capabilities:**
- **PostgreSQL Database**: Full SQL with RLS
- **Authentication**: Email, OAuth, Magic Links
- **Real-time**: WebSocket subscriptions
- **Storage**: File uploads with access control
- **Edge Functions**: Serverless compute

### Notification Delivery

Push notifications keep users engaged:

```mermaid
sequenceDiagram
    participant Trigger as Event Trigger
    participant Backend as Supabase
    participant Expo as Expo Push
    participant Device as User Device

    Trigger->>Backend: Event occurred
    Backend->>Backend: Identify affected users
    Backend->>Expo: Send push batch
    Expo->>Device: Deliver notification
    Device->>Device: Display notification
```

---

## Application Architecture

### Layer Diagram

```mermaid
flowchart TB
    subgraph UI["UI Layer"]
        Screens[Screen Components]
        UIComponents[UI Components]
        Styling[NativeWind Styles]
    end

    subgraph Logic["Business Logic Layer"]
        Hooks[Data Hooks]
        Stores[Zustand Stores]
        Utils[Utilities]
    end

    subgraph Data["Data Layer"]
        QueryClient[React Query Client]
        SupabaseClient[Supabase Client]
        SecureStorage[Secure Storage]
    end

    subgraph External["External Services"]
        Supabase[Supabase Platform]
        OAuth[OAuth Providers]
        Push[Push Services]
    end

    UI --> Logic
    Logic --> Data
    Data <--> External
```

### Feature Module Organization

Each major feature follows a consistent structure:

```
features/
├── events/
│   ├── hooks/          # useEvents, useEvent, useEventMutations
│   ├── components/     # EventCard, EventList, EventForm
│   ├── screens/        # EventListScreen, EventDetailScreen
│   └── types/          # TypeScript interfaces
├── chat/
│   ├── hooks/          # useMessages, useSendMessage
│   ├── components/     # MessageList, MessageInput
│   └── screens/        # ChatScreen
└── finance/
    ├── hooks/          # useTransactions, useContributions
    ├── components/     # TransactionCard, ContributionCard
    └── screens/        # FinanceScreen, AddTransactionScreen
```

---

## Data Flow Patterns

### Read Operations (Queries)

```mermaid
sequenceDiagram
    participant UI as Screen
    participant Hook as useQuery Hook
    participant Cache as Query Cache
    participant API as Supabase API
    participant DB as PostgreSQL

    UI->>Hook: Request data
    Hook->>Cache: Check cache
    alt Cache hit
        Cache->>UI: Return cached data
    else Cache miss
        Hook->>API: Fetch from API
        API->>DB: Execute query
        DB->>API: Return rows
        API->>Hook: JSON response
        Hook->>Cache: Update cache
        Hook->>UI: Return data
    end
```

### Write Operations (Mutations)

```mermaid
sequenceDiagram
    participant UI as Screen
    participant Hook as useMutation Hook
    participant Cache as Query Cache
    participant API as Supabase API
    participant DB as PostgreSQL

    UI->>Hook: Submit mutation
    Hook->>UI: Optimistic update (immediate)
    Hook->>API: Send request
    API->>DB: Execute mutation
    DB->>API: Confirm
    API->>Hook: Success response
    Hook->>Cache: Invalidate related queries
    Hook->>UI: Confirm success

    alt Failure
        Hook->>Cache: Rollback optimistic update
        Hook->>UI: Show error
    end
```

### Real-time Subscriptions

```mermaid
sequenceDiagram
    participant UI as Chat Screen
    participant Hook as useRealtime
    participant WS as WebSocket
    participant DB as PostgreSQL

    UI->>Hook: Subscribe to channel
    Hook->>WS: Open connection
    WS->>DB: Subscribe to changes

    loop Message received
        DB->>WS: Broadcast change
        WS->>Hook: Receive message
        Hook->>UI: Update message list
    end

    UI->>Hook: Leave screen
    Hook->>WS: Close connection
```

---

## Authentication System

### Supported Authentication Methods

```mermaid
flowchart LR
    subgraph Methods["Auth Methods"]
        Email[Email + Password]
        Magic[Magic Link]
        Google[Google OAuth]
        Apple[Apple Sign-In]
    end

    subgraph Supabase["Supabase Auth"]
        Session[Session Management]
        JWT[JWT Tokens]
        Refresh[Token Refresh]
    end

    subgraph App["Mobile App"]
        SecStore[Secure Storage]
        State[Auth State]
    end

    Methods --> Supabase
    Supabase --> App
```

### Authentication Flow

```mermaid
stateDiagram-v2
    [*] --> Initializing: App Launch

    Initializing --> Loading: Check stored session
    Loading --> Authenticated: Valid session found
    Loading --> Unauthenticated: No session

    Unauthenticated --> LoginScreen: Show login
    LoginScreen --> Authenticating: User submits credentials
    Authenticating --> Authenticated: Success
    Authenticating --> LoginScreen: Failure

    Authenticated --> Home: Navigate to app
    Authenticated --> Unauthenticated: Sign out
    Authenticated --> Authenticating: Token expired (auto-refresh)
```

### Session Management

| Token Type | Storage | Expiration | Refresh |
|------------|---------|------------|---------|
| Access Token | Memory | 1 hour | Automatic |
| Refresh Token | Secure Storage | 1 week | On access token expiry |

---

## Performance Optimization

### Client-Side Strategies

1. **Query Caching**: React Query caches API responses
2. **Optimistic Updates**: Immediate UI feedback for mutations
3. **Image Optimization**: Compressed uploads, cached downloads
4. **List Virtualization**: Only render visible items
5. **Lazy Loading**: Load screens on demand

### Backend Strategies

1. **Database Indexes**: Optimized for common queries
2. **Connection Pooling**: Managed by Supabase
3. **Row Level Security**: Efficient policy evaluation
4. **CDN for Storage**: Static assets served from edge

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| App Launch | < 2s | ~1.5s |
| Screen Transition | < 300ms | ~200ms |
| API Response (p95) | < 500ms | ~300ms |
| Image Load | < 1s | ~600ms |

---

## Error Handling

### Error Categories

```mermaid
flowchart TB
    Error[Error Occurs] --> Category{Categorize}

    Category -->|Network| Network[Network Error]
    Category -->|Auth| Auth[Auth Error]
    Category -->|Validation| Validation[Validation Error]
    Category -->|Server| Server[Server Error]
    Category -->|Unknown| Unknown[Unknown Error]

    Network --> Retry[Retry with backoff]
    Auth --> Reauth[Prompt re-authentication]
    Validation --> ShowField[Show field errors]
    Server --> Report[Log to Sentry]
    Unknown --> Fallback[Show generic error]
```

### Error Handling Strategy

| Error Type | User Experience | Technical Action |
|------------|-----------------|------------------|
| Network offline | Show offline banner | Queue for retry |
| Auth expired | Redirect to login | Clear tokens, refresh |
| Validation | Inline field errors | Prevent submission |
| Server 500 | Toast with retry | Log to monitoring |
| Rate limited | "Try again later" | Exponential backoff |

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Build Pipeline

```mermaid
flowchart LR
    Code[Code Change] --> Push[Push to Git]
    Push --> CI[GitHub Actions]
    CI --> Lint[Lint + Type Check]
    Lint --> Test[Run Tests]
    Test --> Build[EAS Build]
    Build --> Submit[Submit to Stores]
```

### Environment Configuration

| Environment | Database | Auth Providers | Features |
|-------------|----------|----------------|----------|
| Development | Local/Staging | Test accounts | All enabled |
| Preview | Staging | OAuth sandbox | All enabled |
| Production | Production | Live OAuth | Feature flags |

---

## Monitoring and Observability

### Current Implementation

- **Error Tracking**: Sentry (planned)
- **Analytics**: PostHog (planned)
- **Logs**: Supabase Dashboard
- **Performance**: React Native Performance Monitor

### Monitoring Dashboard (Planned)

```mermaid
flowchart TB
    subgraph Metrics["Key Metrics"]
        DAU[Daily Active Users]
        Sessions[Session Duration]
        Errors[Error Rate]
        Latency[API Latency]
    end

    subgraph Alerts["Alert Thresholds"]
        ErrorSpike[Error Rate > 1%]
        LatencyHigh[P95 > 1s]
        DowntimeAlert[Service Down]
    end

    Metrics --> Dashboard[Monitoring Dashboard]
    Alerts --> PagerDuty[Alert System]
```

---

## Deployment Architecture

### Current Deployment

```mermaid
flowchart TB
    subgraph App["Mobile App"]
        iOS[iOS App Store]
        Android[Google Play Store]
    end

    subgraph Backend["Supabase Cloud"]
        DB[(PostgreSQL)]
        Auth[Auth Service]
        Storage[Object Storage]
        Edge[Edge Functions]
    end

    subgraph CDN["Supabase CDN"]
        Static[Static Assets]
    end

    iOS --> Backend
    Android --> Backend
    Backend --> CDN
```

### Release Process

1. **Development**: Feature branches, local testing
2. **Preview**: EAS Preview builds for testers
3. **Beta**: TestFlight (iOS) / Internal Testing (Android)
4. **Production**: Staged rollout to app stores

---

## Future Technical Roadmap

### Phase 2 Enhancements

- [ ] Offline-first with local SQLite sync
- [ ] Enhanced push notification targeting
- [ ] In-app analytics integration
- [ ] Performance monitoring with Sentry

### Phase 3 Scale

- [ ] Multi-region database replication
- [ ] Advanced caching with Redis
- [ ] Payment integration (Stripe Connect)
- [ ] Calendar sync (Google/Apple Calendar)

---

## Technical Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Mobile Framework | Expo/React Native | Cross-platform, rapid development |
| Backend | Supabase | Managed PostgreSQL, built-in auth |
| State Management | React Query + Zustand | Server vs client state separation |
| Styling | NativeWind | Familiar Tailwind syntax |
| Navigation | Expo Router | File-based, type-safe |
| Real-time | Supabase Realtime | Integrated with database |
| Push | Expo Notifications | Cross-platform, EAS integration |
