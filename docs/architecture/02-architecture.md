# Community Organization App - System Architecture

## Architecture Principles

1. **Mobile-First, Web-Compatible** - Primary experience on mobile, full functionality on web
2. **Offline-Capable** - Core features work without internet, sync when connected
3. **Progressive Enhancement** - Start simple, unlock features as community grows
4. **Privacy by Design** - Minimal data collection, user controls their data
5. **Scalable but Simple** - Handle growth without over-engineering early

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────┬─────────────────────┬─────────────────────────────────┤
│   Mobile App        │    Web App          │    Public Pages                 │
│   (React Native/    │    (React/Next.js)  │    (Static/SSG)                │
│    Flutter)         │                     │                                 │
└─────────┬───────────┴──────────┬──────────┴──────────────┬──────────────────┘
          │                      │                         │
          └──────────────────────┼─────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      API GATEWAY        │
                    │   (Authentication,      │
                    │    Rate Limiting,       │
                    │    Request Routing)     │
                    └────────────┬────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────────┐
│                         SERVICE LAYER                                        │
├─────────────┬─────────────┬────┴────┬─────────────┬─────────────┬───────────┤
│   Auth      │  Community  │  Event  │  Finance    │  Media      │  Chat     │
│   Service   │  Service    │ Service │  Service    │  Service    │  Service  │
└──────┬──────┴──────┬──────┴────┬────┴──────┬──────┴──────┬──────┴─────┬─────┘
       │             │           │           │             │            │
       └─────────────┴───────────┴─────┬─────┴─────────────┴────────────┘
                                       │
┌──────────────────────────────────────┼──────────────────────────────────────┐
│                           DATA LAYER                                         │
├──────────────────┬───────────────────┼───────────────┬──────────────────────┤
│                  │                   │               │                      │
│  ┌───────────┐   │  ┌────────────┐   │  ┌─────────┐  │  ┌────────────────┐  │
│  │ PostgreSQL│   │  │   Redis    │   │  │  S3/    │  │  │  Search Index  │  │
│  │ (Primary  │   │  │  (Cache,   │   │  │  Cloud  │  │  │  (Elasticsearch│  │
│  │  Database)│   │  │  Sessions, │   │  │ Storage │  │  │   /Meilisearch)│  │
│  │           │   │  │  Pub/Sub)  │   │  │         │  │  │                │  │
│  └───────────┘   │  └────────────┘   │  └─────────┘  │  └────────────────┘  │
│                  │                   │               │                      │
└──────────────────┴───────────────────┴───────────────┴──────────────────────┘
                                       │
┌──────────────────────────────────────┼──────────────────────────────────────┐
│                      EXTERNAL SERVICES                                       │
├─────────────┬─────────────┬──────────┴──────┬─────────────┬─────────────────┤
│  Payment    │  Email/SMS  │  Push           │  Weather    │  Calendar       │
│  (Stripe)   │  (SendGrid/ │  Notifications  │  API        │  Sync           │
│             │   Twilio)   │  (FCM/APNs)     │             │  (Google/Apple) │
└─────────────┴─────────────┴─────────────────┴─────────────┴─────────────────┘
```

---

## Core Services Architecture

### 1. Authentication Service

```
┌─────────────────────────────────────────┐
│           AUTH SERVICE                   │
├─────────────────────────────────────────┤
│                                         │
│  PHASE 1 - MVP (FREE):                  │
│  ✅ Google Sign-In (primary)            │
│  ✅ Apple Sign-In (iOS required)        │
│  ✅ Email Magic Link (secondary)        │
│                                         │
│  PHASE 2 - When Revenue > ₹5K/month:    │
│  ⏳ Phone OTP (Twilio - ~₹0.30/SMS)     │
│  ⏳ Email + Password (optional)         │
│                                         │
│  PHASE 3 - Scale:                       │
│  ⏳ WhatsApp Business Login             │
│  ⏳ Two-factor authentication           │
│                                         │
│  Core Features (All Phases):            │
│  - Session management                   │
│  - Role-based access control (RBAC)     │
│  - Multi-community membership           │
│                                         │
└─────────────────────────────────────────┘

Cost Analysis:
├── Google Sign-In: FREE (unlimited)
├── Apple Sign-In: FREE (unlimited)
├── Magic Link: FREE (email cost only - 3K/month free)
├── Phone OTP: ~₹0.30/SMS (AVOID in MVP)
└── WhatsApp: Business API fees (FUTURE)

Roles per Community:
├── Owner (creator, full control)
├── Admin (manage members, settings)
├── Moderator (manage content, events)
├── Treasurer (financial access)
├── Member (standard access)
└── Guest (limited, view-only)
```

#### Authentication Flow (MVP)

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER LOGIN FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    ┌─────────────┐                              │
│                    │  Login Page │                              │
│                    └──────┬──────┘                              │
│                           │                                      │
│           ┌───────────────┼───────────────┐                     │
│           │               │               │                     │
│           ▼               ▼               ▼                     │
│    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│    │   Google    │ │   Apple     │ │ Magic Link  │             │
│    │  Sign-In    │ │  Sign-In    │ │   (Email)   │             │
│    │   (FREE)    │ │   (FREE)    │ │   (FREE)    │             │
│    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘             │
│           │               │               │                     │
│           │      OAuth    │    OAuth      │   Email Link        │
│           │               │               │                     │
│           └───────────────┼───────────────┘                     │
│                           │                                      │
│                           ▼                                      │
│                    ┌─────────────┐                              │
│                    │  Supabase   │                              │
│                    │    Auth     │                              │
│                    └──────┬──────┘                              │
│                           │                                      │
│                           ▼                                      │
│                    ┌─────────────┐                              │
│                    │   Session   │                              │
│                    │   Created   │                              │
│                    └──────┬──────┘                              │
│                           │                                      │
│                           ▼                                      │
│                    ┌─────────────┐                              │
│                    │  Dashboard  │                              │
│                    └─────────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Implementation Code

```typescript
// lib/auth.ts - All authentication methods (FREE)
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

// Primary: Google Sign-In (FREE)
export const signInWithGoogle = async () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
}

// iOS Required: Apple Sign-In (FREE)
export const signInWithApple = async () => {
  return supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

// Secondary: Magic Link (FREE - uses email)
export const signInWithMagicLink = async (email: string) => {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

// PHASE 2 ONLY: Phone OTP (PAID - ~₹0.30/SMS)
// Uncomment when monthly revenue > ₹5,000
// export const signInWithPhone = async (phone: string) => {
//   return supabase.auth.signInWithOtp({ phone })
// }

// Sign out
export const signOut = async () => {
  return supabase.auth.signOut()
}
```

### 2. Community Service

```
┌─────────────────────────────────────────┐
│         COMMUNITY SERVICE               │
├─────────────────────────────────────────┤
│  Community Management:                  │
│  - Create/edit community profile        │
│  - Privacy settings (public/private)    │
│  - Invite link generation               │
│  - Member management                    │
│  - Role assignment                      │
│  - Community settings                   │
│                                         │
│  Member Management:                     │
│  - Join requests / approvals            │
│  - Member profiles                      │
│  - Member directory                     │
│  - Activity tracking                    │
│  - Membership status (active/inactive)  │
└─────────────────────────────────────────┘
```

### 3. Event Service

```
┌─────────────────────────────────────────┐
│           EVENT SERVICE                 │
├─────────────────────────────────────────┤
│  Event Management:                      │
│  - Create/edit events                   │
│  - Recurring events                     │
│  - Event categories/types               │
│  - Location management                  │
│  - Weather integration                  │
│                                         │
│  Attendance:                            │
│  - RSVP management                      │
│  - Check-in/check-out                   │
│  - Waitlists                            │
│  - Attendance history                   │
│                                         │
│  Tasks & Volunteers:                    │
│  - Task creation/assignment             │
│  - Volunteer sign-up                    │
│  - Hour tracking                        │
│  - Task completion tracking             │
│                                         │
│  Event Documentation:                   │
│  - Agenda management                    │
│  - Meeting minutes                      │
│  - Action items                         │
│  - File attachments                     │
└─────────────────────────────────────────┘
```

### 4. Finance Service

```
┌─────────────────────────────────────────┐
│          FINANCE SERVICE                │
├─────────────────────────────────────────┤
│  Transactions:                          │
│  - Income recording                     │
│  - Expense recording                    │
│  - Receipt capture (OCR)                │
│  - Category management                  │
│  - Cash tracking                        │
│                                         │
│  Dues & Memberships:                    │
│  - Membership fee tracking              │
│  - Payment reminders                    │
│  - Payment status                       │
│  - Grace periods                        │
│                                         │
│  Fundraising:                           │
│  - Campaign creation                    │
│  - Pledge tracking                      │
│  - Progress visualization              │
│  - Donor recognition                    │
│                                         │
│  Reporting:                             │
│  - Balance sheets                       │
│  - Income/expense reports               │
│  - Member payment status                │
│  - Export (PDF, CSV, Excel)             │
│                                         │
│  Payments (Optional Integration):       │
│  - Stripe Connect                       │
│  - Bank account linking                 │
│  - Payment collection                   │
└─────────────────────────────────────────┘
```

### 5. Media Service

```
┌─────────────────────────────────────────┐
│           MEDIA SERVICE                 │
├─────────────────────────────────────────┤
│  Upload & Storage:                      │
│  - Image upload/compression             │
│  - Video upload/transcoding             │
│  - Document storage                     │
│  - Storage quota management             │
│                                         │
│  Organization:                          │
│  - Auto-tagging to events               │
│  - Albums/galleries                     │
│  - Timeline view                        │
│  - Search by date/event/person          │
│                                         │
│  Sharing:                               │
│  - QR code for event uploads            │
│  - Guest upload (no account needed)     │
│  - Download/export                      │
│  - Privacy controls                     │
│                                         │
│  Memories:                              │
│  - "On this day" feature                │
│  - Year in review                       │
│  - Community highlights                 │
└─────────────────────────────────────────┘
```

### 6. Chat/Communication Service

```
┌─────────────────────────────────────────┐
│           CHAT SERVICE                  │
├─────────────────────────────────────────┤
│  Messaging:                             │
│  - Real-time messaging (WebSocket)      │
│  - Channels (topics/groups)             │
│  - Direct messages                      │
│  - Threads/replies                      │
│  - Rich media support                   │
│                                         │
│  Notifications:                         │
│  - Push notifications                   │
│  - Email digests                        │
│  - SMS alerts (critical only)           │
│  - Notification preferences             │
│                                         │
│  Announcements:                         │
│  - Broadcast messages                   │
│  - Pinned messages                      │
│  - Read receipts (optional)             │
│  - Emergency alerts                     │
│                                         │
│  Polls & Surveys:                       │
│  - Quick polls                          │
│  - Surveys                              │
│  - Voting                               │
│  - Results visualization                │
└─────────────────────────────────────────┘
```

---

## Data Models

### Core Entities

```
User
├── id (UUID)
├── email
├── phone
├── name
├── avatar_url
├── preferences
├── created_at
└── updated_at

Community
├── id (UUID)
├── name
├── description
├── avatar_url
├── cover_image_url
├── location
├── privacy (public/private)
├── settings (JSON)
├── created_at
└── updated_at

CommunityMember
├── id (UUID)
├── community_id (FK)
├── user_id (FK)
├── role (owner/admin/moderator/treasurer/member/guest)
├── status (active/inactive/pending/banned)
├── joined_at
└── updated_at

Event
├── id (UUID)
├── community_id (FK)
├── title
├── description
├── location
├── start_time
├── end_time
├── recurring_rule
├── category
├── status (draft/published/cancelled/completed)
├── created_by (FK User)
├── created_at
└── updated_at

EventAttendee
├── id (UUID)
├── event_id (FK)
├── user_id (FK)
├── status (invited/going/maybe/not_going)
├── checked_in_at
├── checked_out_at
└── hours_logged

Transaction
├── id (UUID)
├── community_id (FK)
├── type (income/expense)
├── amount
├── currency
├── category
├── description
├── receipt_url
├── recorded_by (FK User)
├── event_id (FK, optional)
├── created_at
└── updated_at

Message
├── id (UUID)
├── community_id (FK)
├── channel_id (FK)
├── sender_id (FK User)
├── content
├── attachments (JSON)
├── reply_to_id (FK Message, optional)
├── created_at
└── updated_at

Media
├── id (UUID)
├── community_id (FK)
├── uploaded_by (FK User)
├── event_id (FK, optional)
├── type (image/video/document)
├── url
├── thumbnail_url
├── metadata (JSON)
├── created_at
└── updated_at
```

---

## API Design

### RESTful Endpoints Structure

```
/api/v1
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh
│   ├── POST /forgot-password
│   └── POST /verify-otp
│
├── /users
│   ├── GET /me
│   ├── PUT /me
│   └── GET /me/communities
│
├── /communities
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   ├── DELETE /:id
│   ├── GET /:id/members
│   ├── POST /:id/members/invite
│   ├── PUT /:id/members/:userId
│   ├── DELETE /:id/members/:userId
│   ├── GET /:id/events
│   ├── GET /:id/transactions
│   ├── GET /:id/media
│   └── GET /:id/channels
│
├── /events
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   ├── DELETE /:id
│   ├── POST /:id/rsvp
│   ├── POST /:id/check-in
│   ├── GET /:id/attendees
│   ├── GET /:id/tasks
│   └── GET /:id/media
│
├── /transactions
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   ├── DELETE /:id
│   └── POST /:id/receipt
│
├── /media
│   ├── POST /upload
│   ├── GET /:id
│   ├── DELETE /:id
│   └── GET /album/:eventId
│
├── /channels
│   ├── GET /:id
│   ├── GET /:id/messages
│   └── POST /:id/messages
│
└── /notifications
    ├── GET /
    ├── PUT /:id/read
    └── PUT /preferences
```

### WebSocket Events (Real-time)

```
Client -> Server:
├── join_community
├── leave_community
├── send_message
├── typing_start
├── typing_stop
└── mark_read

Server -> Client:
├── new_message
├── message_updated
├── message_deleted
├── user_typing
├── member_joined
├── member_left
├── event_updated
├── announcement
└── notification
```

---

## Infrastructure Architecture

### Cloud Architecture (AWS Example)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              AWS CLOUD                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐     ┌─────────────────────────────────────────────┐   │
│  │ CloudFront  │────▶│              S3 (Static Assets)              │   │
│  │    (CDN)    │     │         - Web App Build                      │   │
│  └──────┬──────┘     │         - Media Files                        │   │
│         │            └─────────────────────────────────────────────┘   │
│         ▼                                                               │
│  ┌─────────────┐     ┌─────────────────────────────────────────────┐   │
│  │    ALB      │────▶│              ECS / EKS                       │   │
│  │ (Load       │     │         - API Services                       │   │
│  │  Balancer)  │     │         - WebSocket Server                   │   │
│  └─────────────┘     │         - Background Workers                 │   │
│                      └──────────────────┬──────────────────────────┘   │
│                                         │                               │
│         ┌───────────────────────────────┼───────────────────────────┐   │
│         ▼                               ▼                           ▼   │
│  ┌─────────────┐              ┌─────────────┐              ┌─────────┐ │
│  │    RDS      │              │ ElastiCache │              │   SQS   │ │
│  │ (PostgreSQL)│              │   (Redis)   │              │ (Queue) │ │
│  └─────────────┘              └─────────────┘              └─────────┘ │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      Additional Services                         │   │
│  │  - Lambda (image processing, notifications)                      │   │
│  │  - SNS (push notifications)                                      │   │
│  │  - SES (email)                                                   │   │
│  │  - OpenSearch (full-text search)                                 │   │
│  │  - Cognito (optional auth)                                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Simplified Architecture (MVP) - COST: ₹0/month

For MVP, use a simplified stack with **100% free tiers**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FREE TIER MVP ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐          ┌─────────────────┐                  │
│  │  Vercel (FREE)  │          │ Supabase (FREE) │                  │
│  │                 │          │                 │                  │
│  │  • Next.js App  │◀────────▶│  • PostgreSQL   │                  │
│  │  • API Routes   │          │    (500MB)      │                  │
│  │  • 100GB BW     │          │  • Auth (50K)   │                  │
│  └─────────────────┘          │  • Storage (1GB)│                  │
│                               │  • Realtime     │                  │
│                               └─────────────────┘                  │
│                                                                     │
│  External Services (ALL FREE TIER):                                 │
│  ✅ Resend (3K emails/month) - Magic links, notifications          │
│  ✅ Cloudinary (25GB) - Image optimization                         │
│  ✅ FCM (unlimited) - Push notifications                           │
│  ✅ Sentry (5K errors) - Error tracking                            │
│  ✅ PostHog (1M events) - Analytics                                │
│                                                                     │
│  NOT in MVP (costs money):                                          │
│  ❌ Stripe - Add when online payments needed                       │
│  ❌ Twilio - Add when revenue > ₹5K/month                          │
│                                                                     │
│  TOTAL MVP COST: ₹0/month                                          │
│  Supports: ~1,000 users, ~100 communities                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Cost Scaling Path

```
┌─────────────────────────────────────────────────────────────────────┐
│                      COST SCALING ROADMAP                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  STAGE 1: MVP Launch (0-1K users)                                  │
│  ├── Cost: ₹0/month                                                │
│  ├── All free tiers                                                │
│  └── Auth: Google + Apple + Magic Link                             │
│                                                                     │
│  STAGE 2: Early Growth (1K-2K users)                               │
│  ├── Cost: ₹2,000-4,000/month                                      │
│  ├── Trigger: Revenue > ₹5,000/month                               │
│  ├── Upgrade: Supabase Pro (₹2,000)                                │
│  └── Add: Phone OTP if users demand it                             │
│                                                                     │
│  STAGE 3: Growth (2K-10K users)                                    │
│  ├── Cost: ₹6,000-12,000/month                                     │
│  ├── Trigger: Revenue > ₹15,000/month                              │
│  ├── Upgrade: Vercel Pro, more storage                             │
│  └── Add: Online payments (Stripe)                                 │
│                                                                     │
│  STAGE 4: Scale (10K+ users)                                       │
│  ├── Cost: ₹15,000-30,000/month                                    │
│  ├── Trigger: Revenue > ₹50,000/month                              │
│  └── Full infrastructure upgrade                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────┐
│         SECURITY LAYERS                 │
├─────────────────────────────────────────┤
│                                         │
│  1. Transport Security                  │
│     - HTTPS everywhere                  │
│     - TLS 1.3                           │
│     - Certificate pinning (mobile)      │
│                                         │
│  2. Authentication                      │
│     - JWT tokens (short-lived access)   │
│     - Refresh tokens (secure, httpOnly) │
│     - Multi-factor authentication (opt) │
│     - Session management                │
│                                         │
│  3. Authorization                       │
│     - Role-based access (RBAC)          │
│     - Community-scoped permissions      │
│     - Resource-level access control     │
│                                         │
│  4. Data Protection                     │
│     - Encryption at rest (AES-256)      │
│     - Encryption in transit             │
│     - PII handling compliance           │
│     - Data anonymization                │
│                                         │
│  5. API Security                        │
│     - Rate limiting                     │
│     - Input validation                  │
│     - SQL injection prevention          │
│     - XSS protection                    │
│     - CORS configuration                │
│                                         │
└─────────────────────────────────────────┘
```

### Privacy Controls

```
User Privacy Settings:
├── Profile visibility (public/members only/private)
├── Contact info visibility
├── Activity visibility
├── Notification preferences
├── Data export (GDPR)
└── Account deletion

Community Privacy Settings:
├── Public / Private / Invite-only
├── Member list visibility
├── Financial transparency level
├── Media sharing permissions
└── Search engine indexing
```

---

## Scalability Considerations

### Horizontal Scaling Strategy

```
Phase 1 (0-10K users):
- Single database instance
- Managed services (Supabase, Vercel)
- Basic caching

Phase 2 (10K-100K users):
- Read replicas for database
- Redis caching layer
- CDN for static assets
- Background job processing

Phase 3 (100K+ users):
- Database sharding (by community)
- Microservices architecture
- Kubernetes orchestration
- Multi-region deployment
```

### Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time (p95) | < 200ms |
| Page Load Time | < 2s |
| WebSocket Latency | < 100ms |
| Image Upload | < 5s (10MB) |
| Search Results | < 500ms |
| Uptime | 99.9% |

---

## Offline Support Architecture

```
┌─────────────────────────────────────────┐
│         OFFLINE ARCHITECTURE            │
├─────────────────────────────────────────┤
│                                         │
│  Local Storage (IndexedDB/SQLite):      │
│  - Recent messages                      │
│  - Event list                           │
│  - Member directory                     │
│  - Pending actions queue                │
│                                         │
│  Sync Strategy:                         │
│  - Last sync timestamp per entity       │
│  - Conflict resolution (server wins)    │
│  - Optimistic UI updates                │
│  - Background sync when online          │
│                                         │
│  Offline Capabilities:                  │
│  - View cached content                  │
│  - Draft messages                       │
│  - Queue RSVPs                          │
│  - Queue expense entries                │
│  - View downloaded media                │
│                                         │
└─────────────────────────────────────────┘
```

---

## Monitoring & Observability

```
┌─────────────────────────────────────────┐
│         OBSERVABILITY STACK             │
├─────────────────────────────────────────┤
│                                         │
│  Logging:                               │
│  - Structured JSON logs                 │
│  - Log aggregation (CloudWatch/Datadog) │
│  - Log retention policies               │
│                                         │
│  Metrics:                               │
│  - Application metrics (Prometheus)     │
│  - Business metrics (custom)            │
│  - Infrastructure metrics               │
│                                         │
│  Tracing:                               │
│  - Distributed tracing (Jaeger/X-Ray)   │
│  - Request correlation IDs              │
│                                         │
│  Alerting:                              │
│  - Error rate thresholds                │
│  - Latency alerts                       │
│  - Resource utilization                 │
│  - Business metric anomalies            │
│                                         │
│  Tools:                                 │
│  - Sentry (error tracking)              │
│  - Datadog / New Relic (APM)            │
│  - PagerDuty (incident management)      │
│                                         │
└─────────────────────────────────────────┘
```
