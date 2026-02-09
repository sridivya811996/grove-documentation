# Grove Mobile App - Development Roadmap

**Created**: 2026-02-03
**Platform**: iOS + Android (Expo/React Native)
**Target**: MVP Launch

---

## Slogan Options

| Slogan | Notes |
|--------|-------|
| **"Beyond the group chat"** | Recommended - Modern, relatable, addresses pain point |
| "Your crew, sorted" | British casual, action-oriented |
| "Less chaos. More us." | Emotional, concise, memorable |
| "Rally your people" | Action verb, empowering |
| "Group stuff, figured out" | Casual, honest, Gen-Z friendly |
| "For groups who actually do stuff" | Cheeky, differentiating |
| "The grown-up group chat" | Playful, aspirational |
| "One group. One place." | Clean, simple, Apple-esque |

---

## Tech Stack (Confirmed)

| Layer | Technology | Status |
|-------|------------|--------|
| Framework | Expo SDK 52+ (React Native) | Future-proof |
| Styling | NativeWind v4 (Tailwind for RN) | Matches web stack |
| Backend | Supabase | Excellent mobile SDK |
| Auth | expo-auth-session, expo-apple-authentication | Free tier |
| Storage | expo-secure-store | Secure token storage |
| Navigation | React Navigation v6 | Industry standard |
| State | Zustand + TanStack Query | Lightweight, powerful |
| Build | EAS Build + EAS Submit | OTA updates included |
| Push | FCM (Firebase Cloud Messaging) | Free, unlimited |

---

## Development Phases

### Phase 0: Project Setup
**Duration**: Week 1
**Status**: [x] In Progress (80% complete)

| Task | Description | Status |
|------|-------------|--------|
| 0.1 | Initialize Expo project with TypeScript | [x] |
| 0.2 | Configure NativeWind + Tailwind | [x] |
| 0.3 | Set up design tokens (Forest Green theme) | [x] |
| 0.4 | Configure Supabase client | [x] |
| 0.5 | Set up expo-secure-store for tokens | [x] |
| 0.6 | Configure EAS for iOS + Android builds | [x] |
| 0.7 | Set up folder structure (feature-based) | [x] |
| 0.8 | Configure ESLint + Prettier | [ ] |

**Deliverable**: Running app with branded splash screen, connected to Supabase

---

### Phase 1: Authentication
**Duration**: Week 2
**Status**: [x] In Progress (60% complete - UI ready, needs Supabase config)

| Task | Description | Status |
|------|-------------|--------|
| 1.1 | Google Sign-In integration | [~] UI ready |
| 1.2 | Apple Sign-In integration (iOS required) | [~] UI ready |
| 1.3 | Email Magic Link flow | [~] UI ready |
| 1.4 | Auth state management (Zustand) | [x] |
| 1.5 | Secure token storage | [x] |
| 1.6 | Auto-login on app restart | [x] |
| 1.7 | Logout functionality | [x] |
| 1.8 | Auth error handling | [x] |

**Deliverable**: Users can sign in via Google, Apple, or Magic Link

---

### Phase 2: Core Navigation & Community
**Duration**: Week 3-4
**Status**: [x] In Progress (30% complete - navigation scaffolding done)

| Task | Description | Status |
|------|-------------|--------|
| 2.1 | Bottom tab navigator (5 tabs) | [x] |
| 2.2 | Stack navigators per tab | [x] |
| 2.3 | Onboarding flow (first-time users) | [ ] |
| 2.4 | Create community screen | [ ] |
| 2.5 | Join community via invite link | [ ] |
| 2.6 | Community switcher (header) | [ ] |
| 2.7 | Member directory screen | [ ] |
| 2.8 | Member profile view | [ ] |
| 2.9 | Role management (admin/member) | [ ] |
| 2.10 | Push notification setup (FCM) | [ ] |

**Deliverable**: Users can create/join communities and see members

---

### Phase 3: Events Module
**Duration**: Week 5-6
**Status**: [ ] Not Started

| Task | Description | Status |
|------|-------------|--------|
| 3.1 | Events list screen (upcoming/past tabs) | [ ] |
| 3.2 | Event detail screen | [ ] |
| 3.3 | Create event form | [ ] |
| 3.4 | Edit event functionality | [ ] |
| 3.5 | RSVP (Going/Maybe/Not Going) | [ ] |
| 3.6 | Attendee list view | [ ] |
| 3.7 | Event location with map preview | [ ] |
| 3.8 | Local notifications for reminders | [ ] |
| 3.9 | Push notifications for event updates | [ ] |
| 3.10 | Share event functionality | [ ] |

**Deliverable**: Full event management with RSVP and reminders

---

### Phase 4: Chat Module
**Duration**: Week 7-8
**Status**: [ ] Not Started

| Task | Description | Status |
|------|-------------|--------|
| 4.1 | Channel list screen | [ ] |
| 4.2 | Create channel functionality | [ ] |
| 4.3 | Chat screen with message list | [ ] |
| 4.4 | Real-time messaging (Supabase Realtime) | [ ] |
| 4.5 | Send text messages | [ ] |
| 4.6 | Send photos (camera + gallery) | [ ] |
| 4.7 | Image viewer/gallery | [ ] |
| 4.8 | Unread message indicators | [ ] |
| 4.9 | Push notifications for new messages | [ ] |
| 4.10 | Message timestamps & grouping | [ ] |

**Deliverable**: Real-time group chat with photo sharing

---

### Phase 5: Finance Module
**Duration**: Week 9
**Status**: [ ] Not Started

| Task | Description | Status |
|------|-------------|--------|
| 5.1 | Finance overview screen (balance) | [ ] |
| 5.2 | Transaction list (income/expense) | [ ] |
| 5.3 | Add income form | [ ] |
| 5.4 | Add expense form | [ ] |
| 5.5 | Category selection | [ ] |
| 5.6 | Transaction detail view | [ ] |
| 5.7 | Basic monthly summary | [ ] |
| 5.8 | Receipt photo attachment | [ ] |

**Deliverable**: Basic income/expense tracking with transparency

---

### Phase 6: Profile & Settings
**Duration**: Week 10
**Status**: [ ] Not Started

| Task | Description | Status |
|------|-------------|--------|
| 6.1 | Profile screen | [ ] |
| 6.2 | Edit profile (name, photo) | [ ] |
| 6.3 | Notification preferences | [ ] |
| 6.4 | Community settings (for admins) | [ ] |
| 6.5 | Leave community | [ ] |
| 6.6 | Delete account | [ ] |
| 6.7 | App version & about | [ ] |

**Deliverable**: Complete profile and settings management

---

### Phase 7: Polish & Launch
**Duration**: Week 11-12
**Status**: [ ] Not Started

| Task | Description | Status |
|------|-------------|--------|
| 7.1 | Offline handling & error states | [ ] |
| 7.2 | Loading skeletons | [ ] |
| 7.3 | Empty states for all screens | [ ] |
| 7.4 | Pull-to-refresh everywhere | [ ] |
| 7.5 | App icon design | [ ] |
| 7.6 | Splash screen animation | [ ] |
| 7.7 | App Store screenshots | [ ] |
| 7.8 | App Store description & keywords | [ ] |
| 7.9 | Play Store listing ($25 fee) | [ ] |
| 7.10 | TestFlight beta distribution | [ ] |
| 7.11 | Play Store internal testing | [ ] |
| 7.12 | Bug fixes from beta feedback | [ ] |

**Deliverable**: Published apps on both stores

---

## Folder Structure

```
grove-mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Auth screens (login, etc.)
│   ├── (tabs)/            # Main tab screens
│   │   ├── index.tsx      # Home
│   │   ├── events/        # Events tab
│   │   ├── chat/          # Chat tab
│   │   ├── finance/       # Finance tab
│   │   └── profile/       # Profile tab
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── components/
│   ├── ui/                # Reusable UI components
│   ├── events/            # Event-specific components
│   ├── chat/              # Chat-specific components
│   └── finance/           # Finance-specific components
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── auth.ts            # Auth utilities
│   └── storage.ts         # Secure storage helpers
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript types
├── constants/             # Colors, config, etc.
├── assets/                # Images, fonts
├── app.json               # Expo config
├── tailwind.config.js     # Tailwind/NativeWind config
├── eas.json               # EAS Build config
└── package.json
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "react-native": "0.76.x",
    "nativewind": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "@supabase/supabase-js": "^2.x",
    "expo-secure-store": "~14.0.0",
    "expo-auth-session": "~6.0.0",
    "expo-apple-authentication": "~7.0.0",
    "expo-image-picker": "~16.0.0",
    "expo-notifications": "~0.29.0",
    "@react-navigation/native": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "@tanstack/react-query": "^5.x",
    "zustand": "^4.x"
  }
}
```

---

## Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| App size | < 30MB |
| Cold start time | < 3 seconds |
| Crash-free rate | > 99% |
| Beta testers | 50+ users |
| Communities created | 10+ |
| Daily active users | 30%+ of installs |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Apple review rejection | Follow HIG, test on real devices |
| Supabase free tier limits | Monitor usage, optimize queries |
| Expo limitations | Use expo-dev-client if native modules needed |
| Chat performance | Implement pagination, virtualized lists |
| Offline scenarios | Graceful degradation, queue actions |

---

## Notes

- **Android first** for faster iteration (Play Store internal testing is instant)
- **iOS parallel** development but submit after Android stable
- **No SMS/Phone OTP** until revenue > ₹5,000/month
- **FCM for push** - completely free, works on both platforms
