# Community Organization App - Project Context

> **Session Context**: Check `gather-mobile/.claude-context.md` for current development status, recent changes, and pending tasks.

## Project Overview

**App Name**: **Grove**
**Tagline Options** (decide before launch):
- "Beyond the group chat" (Recommended - modern, relatable)
- "Less chaos. More us."
- "Rally your people"
- "One group. One place."

**Vision**: The app built for community groups who outgrew WhatsApp but don't need enterprise software.

**Brand Colors**:
- Primary: Forest Green `#2D6A4F`
- Secondary: Sage Green `#52B788`
- Accent: Warm Coral `#E07A5F`
- See `06-ui-ux-design-system.md` for full palette

**Target Users**: Informal local community groups like:
- Friends of Parks groups (5,000+ in UK alone)
- Residents associations
- Sports clubs
- Parent-teacher groups
- Religious/cultural community groups
- Hobby clubs (gardening, running, cycling)

**Inspiration**: "Friends of Kings Meadow" - a local park community that gathers, celebrates events, cleans the park, collects funds, holds monthly meetings, and conducts social events.

---

## Core Problem Statement

Local community groups currently juggle:
- WhatsApp groups (messages get lost, no organization)
- Google Sheets (finances, member lists)
- Shared photo albums (Google Photos, iCloud)
- Calendar invites (scattered across platforms)
- Email threads (announcements)

**Our Solution**: One unified app that replaces all of these with a simple, affordable platform.

---

## Key Differentiators

1. **Zero-Configuration Community** - No formal nonprofit structure required
2. **WhatsApp Replacement, Not Addition** - Familiar chat interface with superpowers
3. **Radical Financial Transparency** - Simple expense tracking including cash
4. **Memory-First Approach** - Photos auto-tagged to events, "on this day" memories
5. **Works for Least Tech-Savvy Member** - WhatsApp-level simplicity

---

## Tech Stack (Decided)

| Layer | Technology |
|-------|------------|
| Web Frontend | Next.js 14 (App Router) + Tailwind + shadcn/ui |
| Mobile | Expo (React Native) + NativeWind |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Hosting | Vercel (web) + EAS (mobile) |
| Payments | Stripe (Phase 2 - when revenue comes) |
| Email | Resend |
| SMS | Twilio (Phase 2 - when revenue comes) |
| Media Processing | Cloudinary |
| Monitoring | Sentry |

---

## Cost Strategy

**Principle: Spend ₹0 until revenue comes in.**

### MVP Cost: ₹0/month (Free Tiers)
- Supabase Free: 500MB DB, 1GB storage, 50K auth users
- Vercel Hobby: 100GB bandwidth
- Resend Free: 3,000 emails/month
- Cloudinary Free: 25GB storage
- FCM: Unlimited push notifications

### When to Start Paying
| Revenue | Unlock |
|---------|--------|
| ₹5,000/mo | Supabase Pro (₹2,000) |
| ₹10,000/mo | Phone OTP via Twilio |
| ₹25,000/mo | Full infrastructure upgrade |

See `05-deployment-and-costs.md` for detailed cost roadmap.

---

## Authentication Strategy (Decided)

### MVP (Free - Phase 1)
1. **Google Sign-In** (Primary) - One-tap, free, 90%+ users have it
2. **Email Magic Link** (Secondary) - For non-Google users, passwordless
3. **Apple Sign-In** (iOS Required) - Required by Apple for apps with social login

### Later (Paid - Phase 2)
4. **Phone OTP** - Add when revenue > ₹5,000/month (costs ~₹0.30/SMS)
5. **Email + Password** - Optional, for users who prefer it

**Why no Phone OTP in MVP**: 1,000 users × 3 logins = ₹900+/month just for auth

---

## Project Documents

| File | Contents |
|------|----------|
| `01-market-research-and-differentiation.md` | Market analysis, competitors, gaps, use cases |
| `02-architecture.md` | System design, services, data models, APIs |
| `03-technology-landscape.md` | Tech stack details, alternatives, costs |
| `04-user-stories.md` | 80+ user stories, MVP to full product |
| `05-deployment-and-costs.md` | Cost-conscious deployment, auth strategy, scaling costs |
| `06-ui-ux-design-system.md` | Brand identity, colors, typography, components |
| `07-screen-designs.md` | All screen wireframes, user flows, navigation |
| `08-mobile-development-roadmap.md` | **NEW** - Mobile app phases, tasks, folder structure |
| `09-high-level-design.md` | **NEW** - Architecture diagrams, deployment, CI/CD, costs |
| `10-onboarding-and-permissions.md` | **NEW** - User flows, roles, WhatsApp migration |
| `11-auth-strategy-analysis.md` | **NEW** - Phone OTP vs Social login decision |
| `grove-mobile/` | **NEW** - Expo mobile app source code |

---

## MVP Scope (Phase 1)

### Must Have
- **Auth**: Google Sign-In + Magic Link + Apple Sign-In (all FREE)
- Create/join communities via invite link
- Member directory and roles
- Create events with RSVP
- Event reminders (push + email)
- Basic income/expense tracking
- Real-time group chat with photo sharing

### Out of Scope for MVP
- Phone OTP authentication (costs money)
- Online payments (Stripe)
- Recurring events
- Video uploads
- Public community pages
- Fundraising campaigns
- SMS notifications

---

## Data Model Summary

**Core Entities**:
- `User` - App users
- `Community` - A group/organization
- `CommunityMember` - User membership in community (with role)
- `Event` - Community events
- `EventAttendee` - RSVP and attendance
- `Transaction` - Income/expense records
- `Message` - Chat messages
- `Channel` - Chat channels within community
- `Media` - Photos, videos, documents

---

## API Structure

```
/api/v1
├── /auth (register, login, logout, reset-password)
├── /users (profile management)
├── /communities (CRUD, members, settings)
├── /events (CRUD, RSVP, attendance, tasks)
├── /transactions (income, expenses, reports)
├── /media (upload, galleries)
├── /channels (chat channels)
└── /notifications (preferences)
```

---

## Current Status

- [x] Market research completed
- [x] Architecture designed
- [x] Technology stack selected
- [x] User stories defined
- [x] High-level design document created
- [x] Mobile app project scaffolded (Expo + NativeWind)
- [x] Mobile navigation structure (5 tabs)
- [x] Mobile auth screens (login, magic link)
- [~] Authentication flow (UI ready, needs Supabase config)
- [ ] Database schema implementation
- [ ] Supabase project setup
- [ ] Core features development
- [ ] Testing
- [ ] Beta launch (Android first)

---

## Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Functional components with hooks
- TanStack Query for server state
- Zustand for client state

### Database
- UUID primary keys
- Soft deletes (deleted_at)
- Audit columns (created_at, updated_at, created_by)
- Row Level Security (RLS) in Supabase

### Testing
- Jest/Vitest for unit tests
- React Testing Library for components
- Playwright for E2E tests

---

## Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserProfile`)
- **Database tables**: snake_case (`community_members`)
- **API endpoints**: kebab-case (`/api/v1/community-members`)

---

## Commands Reference

```bash
# Development
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run tests

# Database
npx supabase start   # Start local Supabase
npx supabase db push # Push schema changes
npx supabase gen types typescript # Generate TypeScript types

# Mobile
npx expo start       # Start Expo dev server
npx eas build        # Build for production
```

---

## Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-02 | Chose Supabase over Firebase | Better SQL support, RLS, lower cost |
| 2026-02-02 | Chose React Native/Expo over Flutter | Code sharing with web, larger ecosystem |
| 2026-02-02 | MVP focuses on events + chat + basic finance | Core pain points for target users |
| 2026-02-02 | **Zero-cost MVP deployment** | Use free tiers until revenue; don't spend before earning |
| 2026-02-02 | **Auth: Google + Magic Link + Apple** | All free, covers 99% of users, skip Phone OTP (costs ₹0.30/SMS) |
| 2026-02-02 | **No Phone OTP in MVP** | Would cost ₹900+/month for 1000 users; add when revenue > ₹5K |
| 2026-02-02 | **Android first, iOS later** | Play Store $25 one-time vs App Store $99/year |
| 2026-02-03 | **App name: Grove** | Natural, unique, memorable - perfect with forest green branding |
| 2026-02-02 | **Forest Green primary color** | Natural, trustworthy, warm - suits park/community theme |
| 2026-02-02 | **5-tab navigation** | Home, Events, Chat, Finance, Profile - covers all core features |
| 2026-02-03 | **Expo Router for navigation** | File-based routing, better DX, typed routes |
| 2026-02-03 | **NativeWind 4.x for styling** | Tailwind for RN, matches web stack, consistent design |
| 2026-02-03 | **Zustand + TanStack Query** | Lightweight state management, excellent caching |
| 2026-02-03 | **Mobile-first development** | Focus on mobile app before web; that's where users are |
| 2026-02-03 | **Slogan shortlist** | "Beyond the group chat" leads; decision pending user feedback |

---

## Questions to Resolve

- [x] App name / branding (Grove - finalized)
- [ ] Pricing model (free tier limits, premium features)
- [ ] Launch market (UK focus first? Global?)
- [ ] Beta community partnerships

---

## Notes for Claude

When working on this project:
1. Reference the architecture doc (`02-architecture.md`) for system design questions
2. Reference user stories (`04-user-stories.md`) for feature requirements
3. Reference cost strategy (`05-deployment-and-costs.md`) for deployment decisions
4. Follow the tech stack decisions - don't suggest alternatives unless asked
5. Prioritize MVP features (P0) before enhancements
6. Keep code simple - this targets non-technical community organizers
7. Consider offline-first for mobile features where possible
8. **COST-CONSCIOUS**: Always prefer free tier solutions; don't suggest paid services for MVP
9. **AUTH**: Use Google/Apple/Magic Link only in MVP; no Phone OTP until revenue
10. **NO SMS**: Use push notifications and email instead of SMS to save costs
