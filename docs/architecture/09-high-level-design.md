# Grove - High-Level Design Document

**Version**: 1.0
**Created**: 2026-02-03
**Last Updated**: 2026-02-03
**Status**: Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Mobile App Architecture](#3-mobile-app-architecture)
4. [Data Architecture](#4-data-architecture)
5. [Authentication Flow](#5-authentication-flow)
6. [Technical Stack](#6-technical-stack)
7. [Infrastructure & Deployment](#7-infrastructure--deployment)
8. [CI/CD Pipeline](#8-cicd-pipeline)
9. [Security Considerations](#9-security-considerations)
10. [Scalability Strategy](#10-scalability-strategy)
11. [Monitoring & Observability](#11-monitoring--observability)
12. [Cost Analysis](#12-cost-analysis)

---

## 1. Executive Summary

### 1.1 Product Overview

**Grove** is a mobile-first community organization app designed for informal local groups who have outgrown WhatsApp but don't need enterprise software. It combines chat, events, and financial transparency in one simple platform.

### 1.2 Key Design Principles

| Principle | Description |
|-----------|-------------|
| **Mobile-First** | Primary experience on iOS/Android; web is secondary |
| **Zero-Cost MVP** | Leverage free tiers until revenue justifies upgrades |
| **Offline-Capable** | Core features work without internet |
| **Privacy-First** | Minimal data collection, user owns their data |
| **Simplicity** | WhatsApp-level ease of use |

### 1.3 Target Scale (MVP)

- **Users**: 10,000 monthly active users
- **Communities**: 500 active communities
- **Messages**: 100,000 messages/month
- **Events**: 2,000 events/month

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              GATHER SYSTEM ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │   iOS App    │     │ Android App  │     │   Web App    │
    │  (Expo/RN)   │     │  (Expo/RN)   │     │  (Next.js)   │
    └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
           │                    │                    │
           └────────────────────┼────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │      API Gateway       │
                    │   (Supabase Edge)      │
                    └───────────┬───────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Supabase    │     │    Supabase     │     │    Supabase     │
│     Auth      │     │    Database     │     │    Storage      │
│               │     │  (PostgreSQL)   │     │   (S3-compat)   │
└───────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │              ┌────────┴────────┐              │
        │              │                 │              │
        ▼              ▼                 ▼              ▼
┌───────────────┐ ┌─────────┐     ┌───────────┐ ┌───────────────┐
│  OAuth 2.0    │ │Realtime │     │   Edge    │ │  Cloudinary   │
│  Providers    │ │Channels │     │ Functions │ │    (CDN)      │
│ Google/Apple  │ │  (WS)   │     │           │ │               │
└───────────────┘ └─────────┘     └───────────┘ └───────────────┘
                                        │
                              ┌─────────┴─────────┐
                              │                   │
                              ▼                   ▼
                      ┌───────────────┐   ┌───────────────┐
                      │    Resend     │   │     FCM       │
                      │   (Email)     │   │    (Push)     │
                      └───────────────┘   └───────────────┘
```

### 2.2 Component Descriptions

| Component | Purpose | Technology |
|-----------|---------|------------|
| **Mobile Apps** | Primary user interface | Expo (React Native) |
| **Web App** | Admin dashboard, sharing | Next.js 14 |
| **API Gateway** | Request routing, rate limiting | Supabase Edge |
| **Auth Service** | User authentication | Supabase Auth |
| **Database** | Persistent data storage | PostgreSQL (Supabase) |
| **Realtime** | Live updates, chat | Supabase Realtime (WebSocket) |
| **Storage** | Media files | Supabase Storage + Cloudinary |
| **Email** | Transactional emails | Resend |
| **Push** | Mobile notifications | Firebase Cloud Messaging |

---

## 3. Mobile App Architecture

### 3.1 App Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MOBILE APP ARCHITECTURE                              │
│                            (Expo/React Native)                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  Home   │ │ Events  │ │  Chat   │ │ Finance │ │ Profile │              │
│  │   Tab   │ │   Tab   │ │   Tab   │ │   Tab   │ │   Tab   │              │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘              │
│       │          │          │          │          │                       │
│       └──────────┴──────────┴──────────┴──────────┘                       │
│                              │                                             │
│                    ┌─────────▼─────────┐                                   │
│                    │   Expo Router     │                                   │
│                    │  (File-based)     │                                   │
│                    └───────────────────┘                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      SHARED COMPONENTS                               │   │
│  │  Button │ Card │ Input │ Avatar │ Modal │ Toast │ Skeleton │ ...   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                              STATE MANAGEMENT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐         ┌─────────────────────────────────────┐   │
│  │      Zustand        │         │         TanStack Query              │   │
│  │   (Client State)    │         │        (Server State)               │   │
│  ├─────────────────────┤         ├─────────────────────────────────────┤   │
│  │ • Auth State        │         │ • Communities Query                 │   │
│  │ • UI State          │         │ • Events Query                      │   │
│  │ • Active Community  │         │ • Messages Query                    │   │
│  │ • Draft Messages    │         │ • Transactions Query                │   │
│  │ • Offline Queue     │         │ • Members Query                     │   │
│  └─────────────────────┘         └─────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                               DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │  Supabase Client │  │  Secure Storage  │  │    Expo Modules          │  │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────────────┤  │
│  │ • REST API       │  │ • Auth Tokens    │  │ • expo-notifications     │  │
│  │ • Realtime WS    │  │ • User Prefs     │  │ • expo-image-picker      │  │
│  │ • Auth Methods   │  │ • Cache          │  │ • expo-secure-store      │  │
│  │ • Storage API    │  │                  │  │ • expo-linking           │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Feature Module Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FEATURE MODULE PATTERN                              │
└─────────────────────────────────────────────────────────────────────────────┘

    feature/
    ├── components/          # Feature-specific UI components
    │   ├── EventCard.tsx
    │   └── EventForm.tsx
    ├── hooks/              # Feature-specific hooks
    │   ├── useEvents.ts
    │   └── useCreateEvent.ts
    ├── screens/            # Screen components (used in app/)
    │   ├── EventListScreen.tsx
    │   └── EventDetailScreen.tsx
    ├── types.ts            # Feature-specific types
    └── utils.ts            # Feature-specific utilities

```

### 3.3 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────┘

  User Action          State Update           Side Effects
      │                    │                       │
      ▼                    ▼                       ▼
┌──────────┐         ┌──────────┐           ┌──────────────┐
│  Touch   │         │  Zustand │           │   Supabase   │
│  Event   │────────▶│  Store   │──────────▶│   Mutation   │
└──────────┘         └──────────┘           └──────────────┘
                          │                       │
                          │                       │
                          ▼                       ▼
                    ┌──────────┐           ┌──────────────┐
                    │    UI    │◀──────────│   TanStack   │
                    │  Update  │           │Query Refetch │
                    └──────────┘           └──────────────┘
                                                  │
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │   Realtime   │
                                          │   Listener   │
                                          └──────────────┘
                                                  │
                                                  │ (Other users)
                                                  ▼
                                          ┌──────────────┐
                                          │  Broadcast   │
                                          │   Update     │
                                          └──────────────┘
```

---

## 4. Data Architecture

### 4.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ENTITY RELATIONSHIP DIAGRAM                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌─────────────────────────┐
│     users       │         │      communities        │
├─────────────────┤         ├─────────────────────────┤
│ id (PK)         │         │ id (PK)                 │
│ email           │◀────┐   │ name                    │
│ full_name       │     │   │ description             │
│ avatar_url      │     │   │ image_url               │
│ created_at      │     │   │ invite_code (UNIQUE)    │
│ updated_at      │     │   │ created_by (FK)─────────┼──────────┐
└────────┬────────┘     │   │ created_at              │          │
         │              │   │ updated_at              │          │
         │              │   └───────────┬─────────────┘          │
         │              │               │                        │
         │              │               │ 1:N                    │
         │              │               │                        │
         │              │   ┌───────────▼─────────────┐          │
         │              │   │  community_members      │          │
         │      N:M     │   ├─────────────────────────┤          │
         │              │   │ id (PK)                 │          │
         └──────────────┼───│ community_id (FK)       │          │
                        │   │ user_id (FK)────────────┼──────────┤
                        │   │ role (admin/moderator/  │          │
                        │   │       member)           │          │
                        │   │ joined_at               │          │
                        │   └─────────────────────────┘          │
                        │                                        │
         ┌──────────────┘                                        │
         │                                                       │
         │   ┌───────────────────────┐    ┌────────────────────────────┐
         │   │       events          │    │        channels            │
         │   ├───────────────────────┤    ├────────────────────────────┤
         │   │ id (PK)               │    │ id (PK)                    │
         │   │ community_id (FK)     │    │ community_id (FK)          │
         │   │ title                 │    │ name                       │
         │   │ description           │    │ description                │
         │   │ location              │    │ is_default                 │
         │   │ start_time            │    │ created_by (FK)────────────┤
         │   │ end_time              │    │ created_at                 │
         │   │ created_by (FK)───────┤    └─────────────┬──────────────┘
         │   │ created_at            │                  │
         │   └───────────┬───────────┘                  │ 1:N
         │               │                              │
         │               │ 1:N                          │
         │               │                  ┌───────────▼──────────────┐
         │   ┌───────────▼───────────┐      │       messages           │
         │   │   event_attendees     │      ├──────────────────────────┤
         │   ├───────────────────────┤      │ id (PK)                  │
         │   │ id (PK)               │      │ channel_id (FK)          │
         │   │ event_id (FK)         │      │ user_id (FK)─────────────┤
         │   │ user_id (FK)──────────┤      │ content                  │
         │   │ status (going/maybe/  │      │ media_urls[]             │
         │   │         not_going)    │      │ created_at               │
         │   │ responded_at          │      │ updated_at               │
         │   └───────────────────────┘      └──────────────────────────┘
         │
         │   ┌───────────────────────┐      ┌──────────────────────────┐
         │   │    transactions       │      │        media             │
         │   ├───────────────────────┤      ├──────────────────────────┤
         │   │ id (PK)               │      │ id (PK)                  │
         │   │ community_id (FK)     │      │ community_id (FK)        │
         │   │ type (income/expense) │      │ event_id (FK) nullable   │
         │   │ amount                │      │ message_id (FK) nullable │
         │   │ currency              │      │ uploaded_by (FK)─────────┤
         │   │ description           │      │ url                      │
         │   │ category              │      │ thumbnail_url            │
         │   │ receipt_url           │      │ type (image/video/doc)   │
         │   │ created_by (FK)───────┤      │ created_at               │
         │   │ created_at            │      └──────────────────────────┘
         │   └───────────────────────┘
         │
         └─────────────────────────────────────────────────────────────────────
```

### 4.2 Database Schema Highlights

```sql
-- Row Level Security (RLS) Pattern
-- Users can only see communities they're members of

CREATE POLICY "Users can view their communities"
ON communities FOR SELECT
USING (
  id IN (
    SELECT community_id FROM community_members
    WHERE user_id = auth.uid()
  )
);

-- Realtime subscriptions for chat
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Indexes for performance
CREATE INDEX idx_messages_channel_created ON messages(channel_id, created_at DESC);
CREATE INDEX idx_events_community_start ON events(community_id, start_time);
CREATE INDEX idx_transactions_community_created ON transactions(community_id, created_at DESC);
```

---

## 5. Authentication Flow

### 5.1 OAuth Flow (Google/Apple)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        OAUTH AUTHENTICATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

     Mobile App                Supabase Auth             OAuth Provider
         │                          │                    (Google/Apple)
         │                          │                          │
         │  1. User taps           │                          │
         │     "Sign in with       │                          │
         │      Google/Apple"      │                          │
         │                          │                          │
         │  2. Request OAuth URL    │                          │
         ├─────────────────────────▶│                          │
         │                          │                          │
         │  3. Return Auth URL      │                          │
         │◀─────────────────────────┤                          │
         │                          │                          │
         │  4. Open In-App Browser  │                          │
         ├─────────────────────────────────────────────────────▶│
         │                          │                          │
         │                          │  5. User authenticates   │
         │                          │                          │
         │  6. Redirect with code   │                          │
         │◀─────────────────────────────────────────────────────┤
         │     (grove://auth/      │                          │
         │      callback?code=...)  │                          │
         │                          │                          │
         │  7. Exchange code        │                          │
         ├─────────────────────────▶│                          │
         │                          │  8. Verify with provider │
         │                          ├─────────────────────────▶│
         │                          │                          │
         │                          │  9. User info            │
         │                          │◀─────────────────────────┤
         │                          │                          │
         │                          │  10. Create/update user  │
         │                          │      Generate JWT        │
         │                          │                          │
         │  11. Return session      │                          │
         │      (access_token,      │                          │
         │       refresh_token)     │                          │
         │◀─────────────────────────┤                          │
         │                          │                          │
         │  12. Store tokens        │                          │
         │      securely            │                          │
         │      (expo-secure-store) │                          │
         │                          │                          │
         │  13. Navigate to         │                          │
         │      Home screen         │                          │
         ▼                          ▼                          ▼
```

### 5.2 Magic Link Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MAGIC LINK AUTHENTICATION                            │
└─────────────────────────────────────────────────────────────────────────────┘

     Mobile App            Supabase Auth              Resend              User
         │                      │                       │                  │
         │  1. Enter email      │                       │                  │
         │     "user@email.com" │                       │                  │
         │                      │                       │                  │
         │  2. Request magic    │                       │                  │
         │     link             │                       │                  │
         ├─────────────────────▶│                       │                  │
         │                      │                       │                  │
         │                      │  3. Generate OTP      │                  │
         │                      │     token             │                  │
         │                      │                       │                  │
         │                      │  4. Send email        │                  │
         │                      ├──────────────────────▶│                  │
         │                      │                       │                  │
         │  5. Show "Check      │                       │  5. Deliver     │
         │     your email"      │                       │     email       │
         │     screen           │                       ├─────────────────▶│
         │                      │                       │                  │
         │                      │                       │                  │
         │                      │                       │  6. User clicks │
         │                      │                       │     link        │
         │  7. Deep link opens  │                       │                  │
         │     app with token   │◀─────────────────────────────────────────┤
         │     grove://auth/   │                       │                  │
         │     callback?token=  │                       │                  │
         │                      │                       │                  │
         │  8. Verify token     │                       │                  │
         ├─────────────────────▶│                       │                  │
         │                      │                       │                  │
         │  9. Return session   │                       │                  │
         │◀─────────────────────┤                       │                  │
         │                      │                       │                  │
         │  10. Store & proceed │                       │                  │
         ▼                      ▼                       ▼                  ▼
```

---

## 6. Technical Stack

### 6.1 Complete Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TECHNOLOGY STACK                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT TIER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         MOBILE (iOS + Android)                       │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Framework     │ Expo SDK 52+ (React Native 0.76+)                  │   │
│  │  Language      │ TypeScript 5.x (strict mode)                       │   │
│  │  Navigation    │ Expo Router 4.x (file-based routing)               │   │
│  │  Styling       │ NativeWind 4.x (Tailwind for RN)                   │   │
│  │  State         │ Zustand 5.x (client) + TanStack Query 5.x (server) │   │
│  │  Forms         │ React Hook Form + Zod validation                   │   │
│  │  Storage       │ expo-secure-store (tokens), AsyncStorage (cache)   │   │
│  │  Testing       │ Jest + React Native Testing Library                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                              WEB (Future)                            │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Framework     │ Next.js 14 (App Router)                            │   │
│  │  Styling       │ Tailwind CSS 3.x + shadcn/ui                       │   │
│  │  State         │ Same as mobile (code sharing)                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND TIER (BaaS)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           SUPABASE                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Database      │ PostgreSQL 15 (managed)                            │   │
│  │  Auth          │ Supabase Auth (OAuth, Magic Link, JWT)             │   │
│  │  Realtime      │ Supabase Realtime (WebSocket, Postgres Changes)    │   │
│  │  Storage       │ Supabase Storage (S3-compatible)                   │   │
│  │  Functions     │ Supabase Edge Functions (Deno runtime)             │   │
│  │  Security      │ Row Level Security (RLS) policies                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SERVICES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐   │
│  │   Cloudinary  │ │    Resend     │ │     FCM       │ │    Sentry     │   │
│  ├───────────────┤ ├───────────────┤ ├───────────────┤ ├───────────────┤   │
│  │ Image/Video   │ │ Transactional │ │ Push Notifs   │ │ Error         │   │
│  │ Processing    │ │ Emails        │ │ (iOS/Android) │ │ Monitoring    │   │
│  │ CDN Delivery  │ │               │ │               │ │               │   │
│  │               │ │ Free: 3K/mo   │ │ Free: ∞       │ │ Free: 5K/mo   │   │
│  │ Free: 25GB    │ │               │ │               │ │               │   │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          BUILD & DEPLOYMENT                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐   │
│  │   EAS Build   │ │  EAS Submit   │ │   Vercel      │ │    GitHub     │   │
│  ├───────────────┤ ├───────────────┤ ├───────────────┤ ├───────────────┤   │
│  │ iOS/Android   │ │ App Store     │ │ Web Hosting   │ │ Source Code   │   │
│  │ Cloud Builds  │ │ Play Store    │ │ (Next.js)     │ │ CI/CD         │   │
│  │ OTA Updates   │ │ Submission    │ │               │ │ Actions       │   │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Package Versions

```json
{
  "mobile": {
    "expo": "~54.0.0",
    "expo-router": "~6.0.0",
    "react-native": "0.76.x",
    "nativewind": "^4.0.0",
    "@supabase/supabase-js": "^2.x",
    "@tanstack/react-query": "^5.x",
    "zustand": "^5.x"
  },
  "web": {
    "next": "14.x",
    "react": "18.x",
    "tailwindcss": "^3.4.x",
    "@supabase/ssr": "^0.x"
  }
}
```

---

## 7. Infrastructure & Deployment

### 7.1 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌───────────────────┐
                              │      GitHub       │
                              │    Repository     │
                              └─────────┬─────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
            │   EAS Build   │   │    Vercel     │   │   Supabase    │
            │   (Mobile)    │   │    (Web)      │   │   (Backend)   │
            └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
                    │                   │                   │
        ┌───────────┴───────────┐       │                   │
        │                       │       │                   │
        ▼                       ▼       ▼                   ▼
┌───────────────┐       ┌───────────────┐           ┌───────────────┐
│  App Store    │       │  Play Store   │           │   Supabase    │
│  (iOS)        │       │  (Android)    │           │   Cloud       │
│               │       │               │           │   (AWS)       │
│  TestFlight   │       │  Internal     │           │               │
│  for Beta     │       │  Testing      │           │  Region:      │
└───────────────┘       └───────────────┘           │  ap-south-1   │
                                                    │  (Mumbai)     │
                                                    └───────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           ENVIRONMENT STRATEGY                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│  │ Development │     │   Staging   │     │ Production  │                   │
│  ├─────────────┤     ├─────────────┤     ├─────────────┤                   │
│  │ Local       │     │ Preview     │     │ Live        │                   │
│  │ Supabase    │────▶│ Supabase    │────▶│ Supabase    │                   │
│  │             │     │ (branch)    │     │             │                   │
│  │ Expo Go     │     │ EAS Preview │     │ App Stores  │                   │
│  └─────────────┘     └─────────────┘     └─────────────┘                   │
│                                                                             │
│  Branch: feature/* ──▶ Branch: staging ──▶ Branch: main                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Deployment Platforms

| Platform | Purpose | Pricing |
|----------|---------|---------|
| **EAS Build** | iOS/Android builds | Free: 30 builds/mo |
| **EAS Submit** | Store submissions | Free |
| **EAS Update** | OTA JavaScript updates | Free: 1,000 users/mo |
| **App Store** | iOS distribution | $99/year |
| **Play Store** | Android distribution | $25 one-time |
| **Vercel** | Web hosting | Free: hobby tier |
| **Supabase** | Backend services | Free: see limits below |

### 7.3 Supabase Free Tier Limits

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE FREE TIER LIMITS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Database:                                                                  │
│  ├── Storage: 500 MB                                                        │
│  ├── Bandwidth: Unlimited                                                   │
│  └── Connections: 60 direct, 200 pooled                                     │
│                                                                             │
│  Auth:                                                                      │
│  └── MAU: 50,000 users                                                      │
│                                                                             │
│  Storage:                                                                   │
│  ├── Space: 1 GB                                                            │
│  └── Bandwidth: 2 GB/month                                                  │
│                                                                             │
│  Edge Functions:                                                            │
│  ├── Invocations: 500,000/month                                             │
│  └── Execution time: 400,000 seconds/month                                  │
│                                                                             │
│  Realtime:                                                                  │
│  ├── Concurrent connections: 200                                            │
│  └── Messages: 2 million/month                                              │
│                                                                             │
│  ⚠️  NOTE: Free projects pause after 1 week of inactivity                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. CI/CD Pipeline

### 8.1 Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CI/CD PIPELINE                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           PULL REQUEST                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│   │   Lint   │───▶│   Type   │───▶│   Unit   │───▶│   E2E    │            │
│   │  Check   │    │  Check   │    │  Tests   │    │  Tests   │            │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘            │
│        │               │               │               │                   │
│        └───────────────┴───────────────┴───────────────┘                   │
│                                │                                           │
│                    ┌───────────▼───────────┐                               │
│                    │   Preview Build       │                               │
│                    │   (EAS Preview)       │                               │
│                    └───────────────────────┘                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          MERGE TO MAIN                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    │
│   │  Production      │───▶│  EAS Build       │───▶│  Auto Submit     │    │
│   │  Tests           │    │  (iOS/Android)   │    │  (Stores)        │    │
│   └──────────────────┘    └──────────────────┘    └──────────────────┘    │
│                                    │                                       │
│                                    │ (JS-only changes)                     │
│                                    ▼                                       │
│                           ┌──────────────────┐                             │
│                           │  EAS Update      │                             │
│                           │  (OTA Update)    │                             │
│                           └──────────────────┘                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 GitHub Actions Workflow

```yaml
# .github/workflows/mobile-ci.yml (simplified)

name: Mobile CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test

  build-preview:
    needs: lint-and-test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --profile preview --platform all --non-interactive

  deploy-production:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: expo/expo-github-action@v8
      - run: eas build --profile production --platform all --auto-submit
```

---

## 9. Security Considerations

### 9.1 Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT SECURITY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Secure token storage (expo-secure-store with Keychain/Keystore)          │
│  • Certificate pinning for API calls                                        │
│  • No sensitive data in AsyncStorage                                        │
│  • Input validation with Zod schemas                                        │
│  • Biometric authentication option                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TRANSPORT SECURITY                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  • HTTPS/TLS 1.3 for all API calls                                          │
│  • WSS for realtime connections                                             │
│  • App Transport Security (iOS)                                             │
│  • Network Security Config (Android)                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          API SECURITY                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  • JWT authentication with short expiry (1 hour)                            │
│  • Refresh token rotation                                                   │
│  • Rate limiting per user/IP                                                │
│  • Request validation                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SECURITY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Row Level Security (RLS) policies on ALL tables                          │
│  • Users can only access their communities' data                            │
│  • Soft deletes (no permanent data loss)                                    │
│  • Audit logging for sensitive operations                                   │
│  • Encrypted at rest (Supabase default)                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Key Security Policies

| Policy | Implementation |
|--------|----------------|
| **Authentication** | OAuth 2.0 (Google, Apple) + Magic Link |
| **Authorization** | RLS policies, role-based access |
| **Data Privacy** | GDPR-compliant, minimal data collection |
| **Token Storage** | iOS Keychain, Android Keystore |
| **API Security** | JWT, rate limiting, input validation |
| **Media Security** | Signed URLs, virus scanning |

---

## 10. Scalability Strategy

### 10.1 Scaling Triggers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SCALING DECISION TREE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

                          ┌───────────────────┐
                          │  Current Scale    │
                          │  (Free Tier)      │
                          │                   │
                          │  • 10K MAU        │
                          │  • 500 MB DB      │
                          │  • 1 GB Storage   │
                          └─────────┬─────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌───────────┐   ┌───────────┐   ┌───────────┐
            │ DB > 400MB│   │ MAU > 40K │   │ Revenue   │
            │           │   │           │   │ > ₹5K/mo  │
            └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
                  │               │               │
                  └───────────────┼───────────────┘
                                  │
                                  ▼
                          ┌───────────────────┐
                          │  Supabase Pro     │
                          │  ($25/month)      │
                          │                   │
                          │  • 8 GB DB        │
                          │  • 100 GB Storage │
                          │  • No pause       │
                          └─────────┬─────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌───────────┐   ┌───────────┐   ┌───────────┐
            │ DB > 6 GB │   │ MAU > 100K│   │ Revenue   │
            │           │   │           │   │ > ₹50K/mo │
            └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
                  │               │               │
                  └───────────────┼───────────────┘
                                  │
                                  ▼
                          ┌───────────────────┐
                          │  Supabase Team    │
                          │  ($599/month)     │
                          │                   │
                          │  • Custom limits  │
                          │  • Priority       │
                          │    support        │
                          │  • SOC 2 Type 2   │
                          └───────────────────┘
```

### 10.2 Optimization Strategies

| Level | Strategy |
|-------|----------|
| **Database** | Indexes, query optimization, connection pooling |
| **API** | Pagination, caching headers, edge functions |
| **Storage** | Cloudinary CDN, lazy loading, thumbnails |
| **Mobile** | Image compression, offline-first, pagination |
| **Realtime** | Channel-based subscriptions, debouncing |

---

## 11. Monitoring & Observability

### 11.1 Monitoring Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MONITORING ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│      Sentry      │  │ Supabase Studio  │  │   App Stores     │
│   (Errors/APM)   │  │  (DB Metrics)    │  │   (Analytics)    │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ • Crash reports  │  │ • Query perf     │  │ • Installs       │
│ • Performance    │  │ • Connection     │  │ • Ratings        │
│ • User sessions  │  │   monitoring     │  │ • Retention      │
│ • Release health │  │ • Storage usage  │  │ • Revenue        │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Alerts         │
                    │   (Email/Slack)  │
                    └──────────────────┘
```

### 11.2 Key Metrics to Track

| Category | Metrics |
|----------|---------|
| **App Health** | Crash-free rate, ANR rate, startup time |
| **Performance** | API latency, frame rate, memory usage |
| **Engagement** | DAU/MAU, session duration, feature usage |
| **Business** | Communities created, events RSVPs, transactions |
| **Infrastructure** | DB size, storage usage, API calls |

---

## 12. Cost Analysis

### 12.1 MVP Cost Breakdown (Monthly)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MVP MONTHLY COSTS (First 6 Months)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Service               │ Tier        │ Monthly Cost │ Notes          │   │
│  ├───────────────────────┼─────────────┼──────────────┼────────────────┤   │
│  │ Supabase              │ Free        │ ₹0           │ 500MB DB       │   │
│  │ EAS Build             │ Free        │ ₹0           │ 30 builds/mo   │   │
│  │ Vercel                │ Hobby       │ ₹0           │ Web hosting    │   │
│  │ Cloudinary            │ Free        │ ₹0           │ 25GB storage   │   │
│  │ Resend                │ Free        │ ₹0           │ 3K emails/mo   │   │
│  │ FCM                   │ Free        │ ₹0           │ Unlimited      │   │
│  │ Sentry                │ Free        │ ₹0           │ 5K errors/mo   │   │
│  │ GitHub                │ Free        │ ₹0           │ Public/Private │   │
│  │ Play Store            │ One-time    │ ₹2,100*      │ $25 one-time   │   │
│  │ App Store             │ Annual      │ -            │ Delayed        │   │
│  ├───────────────────────┼─────────────┼──────────────┼────────────────┤   │
│  │ TOTAL (Monthly)       │             │ ₹0           │                │   │
│  │ TOTAL (One-time)      │             │ ₹2,100       │ Play Store     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  * Play Store fee is one-time, not monthly                                  │
│  * App Store ($99/year = ₹8,250) delayed until revenue                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Growth Cost Projection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COST SCALING PROJECTION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Monthly Active Users:  1K    5K    10K   25K   50K   100K                 │
│                          │     │     │     │     │     │                    │
│  ────────────────────────┼─────┼─────┼─────┼─────┼─────┼────────────────   │
│                          │     │     │     │     │     │                    │
│  Supabase:              ₹0   ₹0   ₹0  ₹2K  ₹2K  ₹50K                      │
│  (Free→Pro→Team)         │     │     │     │     │     │                    │
│                          │     │     │     │     │     │                    │
│  Cloudinary:            ₹0   ₹0   ₹0   ₹0  ₹3K  ₹7K                       │
│  (Free→Plus)             │     │     │     │     │     │                    │
│                          │     │     │     │     │     │                    │
│  Resend:                ₹0   ₹0  ₹1.5K ₹1.5K ₹1.5K ₹4K                    │
│  (Free→Pro)              │     │     │     │     │     │                    │
│                          │     │     │     │     │     │                    │
│  EAS Build:             ₹0   ₹0   ₹0  ₹7K  ₹7K  ₹7K                       │
│  (Free→Production)       │     │     │     │     │     │                    │
│                          │     │     │     │     │     │                    │
│  ────────────────────────┼─────┼─────┼─────┼─────┼─────┼────────────────   │
│                          │     │     │     │     │     │                    │
│  TOTAL/Month:           ₹0   ₹0  ₹1.5K ₹10.5K ₹13.5K ₹68K                 │
│                                                                             │
│  Expected Revenue*:     ₹0  ₹2K  ₹5K  ₹25K  ₹75K  ₹200K                   │
│  (@ ₹50/community/mo)                                                       │
│                                                                             │
│  Net Margin:            -    +    +    +     +     +                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

* Revenue projection assumes premium communities pay ₹50/month average
```

### 12.3 Break-Even Analysis

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BREAK-EVEN ANALYSIS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Scenario: 10,000 MAU with 5% conversion to premium                         │
│                                                                             │
│  Premium communities: 500 × ₹99/month = ₹49,500/month                       │
│  Infrastructure cost at 10K MAU: ~₹5,000/month                              │
│                                                                             │
│  Net profit: ₹44,500/month                                                  │
│                                                                             │
│  Time to break-even on initial investment:                                  │
│  • Play Store: ₹2,100 (covered in month 1)                                  │
│  • App Store: ₹8,250 (covered in month 1)                                   │
│  • Development time: Opportunity cost                                       │
│                                                                             │
│  ✓ Profitable from first paying customer due to ₹0 MVP costs                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Appendix A: Deployment Checklist

### A.1 Pre-Launch Checklist

- [ ] Supabase project created and configured
- [ ] RLS policies tested for all tables
- [ ] Google OAuth configured
- [ ] Apple Sign-In configured
- [ ] FCM configured for both platforms
- [ ] EAS Build profiles configured
- [ ] Environment variables set
- [ ] Sentry project created
- [ ] App Store Connect account ready
- [ ] Play Console account ready ($25 paid)
- [ ] Privacy policy URL created
- [ ] Terms of service URL created
- [ ] App icons and screenshots prepared
- [ ] Beta testers identified

### A.2 Launch Day Checklist

- [ ] Production Supabase migrated
- [ ] Production builds submitted
- [ ] App Store review passed
- [ ] Play Store review passed
- [ ] Monitoring dashboards set up
- [ ] Alert channels configured
- [ ] Support email ready
- [ ] Social media announced

---

## Appendix B: Quick Reference

### B.1 Key URLs

| Resource | URL |
|----------|-----|
| Supabase Dashboard | https://supabase.com/dashboard |
| EAS Dashboard | https://expo.dev |
| App Store Connect | https://appstoreconnect.apple.com |
| Play Console | https://play.google.com/console |
| Sentry | https://sentry.io |
| Vercel | https://vercel.com |

### B.2 CLI Commands

```bash
# Development
npm run start                    # Start Expo dev server
npm run android                  # Run on Android
npm run ios                      # Run on iOS

# Building
eas build --profile development  # Dev build with dev client
eas build --profile preview      # Preview APK for testing
eas build --profile production   # Production build

# Deployment
eas submit --platform ios        # Submit to App Store
eas submit --platform android    # Submit to Play Store
eas update --branch production   # OTA update (JS only)

# Database
supabase db push                 # Apply migrations
supabase gen types typescript    # Generate TypeScript types
```

---

**Document Version History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-03 | Claude | Initial draft |

---

*This document is part of the Grove project documentation. For questions or updates, refer to the project repository.*
