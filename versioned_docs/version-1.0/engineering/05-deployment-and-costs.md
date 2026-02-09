# Community Organization App - Deployment & Cost Strategy

## Guiding Principle

**Spend ₹0 until revenue comes in.** Scale costs only when user growth demands it.

---

## Free Tier Stack (MVP)

| Service | Provider | Free Tier Limits | What It Covers |
|---------|----------|------------------|----------------|
| **Database** | Supabase | 500MB, 2 projects | PostgreSQL, enough for ~5,000 users |
| **Auth** | Supabase | 50,000 MAU | Google, Apple, Magic Link - all free |
| **Storage** | Supabase | 1GB | Photos, receipts, documents |
| **Realtime** | Supabase | 200 concurrent | Chat, live updates |
| **Web Hosting** | Vercel | 100GB bandwidth | Next.js app, API routes |
| **Mobile Builds** | EAS (Expo) | Free tier | iOS & Android builds (queued) |
| **Email** | Resend | 3,000/month | Magic links, notifications |
| **Media CDN** | Cloudinary | 25GB storage | Image optimization, thumbnails |
| **Monitoring** | Sentry | 5K errors/month | Error tracking |
| **Analytics** | PostHog | 1M events/month | Product analytics |
| **Push Notifications** | FCM | Unlimited | Free from Google/Apple |

### Total MVP Cost: ₹0/month

This supports approximately:
- 500-1,000 active users
- 50-100 communities
- 10,000 messages/day
- 5GB of photos

---

## Authentication Strategy (Cost-Optimized)

### Phase 1: MVP (₹0/month)

```
┌─────────────────────────────────────────────────────────────────┐
│                  MVP AUTHENTICATION (FREE)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRIMARY: Google Sign-In                                        │
│  ├── One-tap login on mobile                                   │
│  ├── 90%+ of users have Google account                         │
│  ├── Auto-fills name, email, profile photo                     │
│  ├── No password to remember                                   │
│  └── Cost: FREE                                                │
│                                                                 │
│  SECONDARY: Email Magic Link                                    │
│  ├── For users who don't want Google                           │
│  ├── Click link in email to login                              │
│  ├── No password needed                                        │
│  ├── Works with any email provider                             │
│  └── Cost: FREE (within 3,000 emails/month)                    │
│                                                                 │
│  iOS REQUIRED: Apple Sign-In                                    │
│  ├── Required by Apple if you have social login                │
│  ├── "Hide My Email" support                                   │
│  └── Cost: FREE                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Why NOT Phone OTP in MVP:**
- SMS costs ₹0.15-0.50 per message
- 1,000 users × 3 logins/month = ₹450-1,500/month just for auth
- Can add later when revenue supports it

### Phase 2: Growth (When Revenue Starts)

```
ADD: Phone Number OTP
├── Familiar to WhatsApp users
├── Universal (everyone has a phone)
├── Cost: ~₹1,000-3,000/month for 5,000 users
└── Trigger: When monthly revenue > ₹5,000

ADD: Email + Password (Optional)
├── For users who prefer traditional login
├── Requires password reset flow
└── Cost: FREE
```

### Phase 3: Scale

```
CONSIDER: WhatsApp Business Login
├── Perfect fit for target audience
├── Requires WhatsApp Business API
├── Cost: Higher (business API fees)
└── Trigger: When user demand is clear
```

### Authentication Implementation

```typescript
// Supabase makes this trivially easy
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(URL, KEY)

// Google Sign-In (FREE)
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
}

// Apple Sign-In (FREE)
const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple'
  })
}

// Magic Link (FREE - just email cost)
const signInWithMagicLink = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })
}

// Phone OTP (PAID - add later)
const signInWithPhone = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone  // Requires Twilio setup
  })
}
```

---

## Cost Scaling Roadmap

### Stage 1: Pre-Launch & Beta (₹0/month)
| Item | Cost |
|------|------|
| All infrastructure | ₹0 (free tiers) |
| Domain name | ₹800/year (~₹67/month) |
| **Total** | **~₹67/month** |

### Stage 2: Launch (0-500 users) - ₹0/month
| Item | Cost |
|------|------|
| Supabase Free | ₹0 |
| Vercel Free | ₹0 |
| Resend Free | ₹0 |
| EAS Free | ₹0 |
| **Total** | **₹0/month** |

### Stage 3: Early Growth (500-2,000 users) - ₹2,000-4,000/month
| Item | Cost | Trigger |
|------|------|---------|
| Supabase Pro | ₹2,000 | >500MB DB or need backups |
| Vercel Pro | ₹1,600 | >100GB bandwidth |
| Resend Paid | ₹400 | >3,000 emails |
| **Total** | **₹2,000-4,000/month** |

### Stage 4: Growth (2,000-10,000 users) - ₹6,000-12,000/month
| Item | Cost | Trigger |
|------|------|---------|
| Supabase Pro | ₹2,000 | Base |
| Supabase Add-ons | ₹2,000 | More storage/compute |
| Vercel Pro | ₹1,600 | Base |
| Phone OTP (Twilio) | ₹2,000 | User demand |
| Cloudinary Paid | ₹1,500 | >25GB media |
| **Total** | **₹6,000-12,000/month** |

### Stage 5: Scale (10,000+ users) - ₹15,000-30,000/month
| Item | Cost |
|------|------|
| Supabase Team | ₹8,000 |
| Vercel Team | ₹3,200 |
| Twilio | ₹3,000-5,000 |
| Cloudinary | ₹3,000-5,000 |
| Sentry Paid | ₹2,000 |
| **Total** | **₹15,000-30,000/month** |

---

## Revenue Triggers for Spending

**Rule: Don't spend until you earn.**

| Monthly Revenue | Unlock Spending On |
|-----------------|-------------------|
| ₹0 | Nothing - stay on free tiers |
| ₹2,000 | Domain, basic branding |
| ₹5,000 | Supabase Pro for reliability |
| ₹10,000 | Phone OTP, better email |
| ₹25,000 | Vercel Pro, paid monitoring |
| ₹50,000+ | Full infrastructure upgrade |

---

## Deployment Architecture (Free Tier)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FREE TIER ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │   Vercel (Free)  │         │  Supabase (Free) │             │
│  │                  │         │                  │             │
│  │  • Next.js App   │◀───────▶│  • PostgreSQL    │             │
│  │  • API Routes    │         │  • Auth          │             │
│  │  • Edge Funcs    │         │  • Storage       │             │
│  │  • 100GB BW      │         │  • Realtime      │             │
│  └──────────────────┘         └──────────────────┘             │
│           │                            │                        │
│           │         ┌──────────────────┘                        │
│           │         │                                           │
│           ▼         ▼                                           │
│  ┌──────────────────────────────────────────────────┐          │
│  │                 EXTERNAL (FREE)                   │          │
│  │                                                   │          │
│  │  • Resend (3K emails/mo)                         │          │
│  │  • Cloudinary (25GB media)                       │          │
│  │  • FCM (unlimited push)                          │          │
│  │  • Sentry (5K errors/mo)                         │          │
│  │  • PostHog (1M events/mo)                        │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐          │
│  │                 MOBILE (FREE)                     │          │
│  │                                                   │          │
│  │  • Expo/EAS Free Builds                          │          │
│  │  • OTA Updates (free tier)                       │          │
│  │  • App Store ($99/yr iOS, $25 one-time Android)  │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Free Tier Limits to Watch

| Service | Limit | What Happens When Exceeded |
|---------|-------|---------------------------|
| **Supabase DB** | 500MB | Need to upgrade (~₹2,000/mo) |
| **Supabase Storage** | 1GB | Need to upgrade |
| **Supabase Auth** | 50K MAU | Need to upgrade |
| **Vercel Bandwidth** | 100GB | Site may slow/block |
| **Resend Emails** | 3,000/mo | Emails won't send |
| **Cloudinary** | 25GB | Uploads fail |
| **Sentry** | 5K errors | Errors not tracked |

### Mitigation Strategies

1. **Database size**:
   - Implement message archiving (old messages to cold storage)
   - Compress images before storing URLs
   - Clean up deleted records periodically

2. **Storage**:
   - Aggressive image compression (Cloudinary handles this)
   - Limit upload sizes (5MB images, 50MB videos)
   - Move old media to cheaper storage later

3. **Bandwidth**:
   - Use Cloudinary CDN for images (offloads from Vercel)
   - Implement proper caching headers
   - Lazy load images

4. **Emails**:
   - Batch notifications into digests
   - Rate limit magic link requests
   - Use push notifications instead where possible

---

## App Store Costs (One-Time/Annual)

| Platform | Cost | Type |
|----------|------|------|
| **Google Play** | $25 (~₹2,000) | One-time |
| **Apple App Store** | $99/year (~₹8,000) | Annual |

**Strategy**: Launch on Android first (cheaper), add iOS when you have some traction.

---

## Cost Monitoring Setup

### Free Tools to Track Costs

1. **Supabase Dashboard** - Built-in usage metrics
2. **Vercel Dashboard** - Bandwidth and function usage
3. **Resend Dashboard** - Email counts
4. **PostHog** - Track user growth to predict costs

### Alert Thresholds

Set up alerts when hitting 70% of free tier limits:
- Supabase: 350MB database
- Vercel: 70GB bandwidth
- Resend: 2,100 emails
- Cloudinary: 17GB storage

---

## Monetization to Cover Costs

### Suggested Pricing Model

**Free Tier (Forever Free)**
- Up to 50 members per community
- Basic features
- Community-supported

**Premium (₹199/month per community)**
- Unlimited members
- Advanced finance reports
- Priority support
- Custom branding

**Break-even Analysis**
- At ₹4,000/month costs: Need 20 premium communities
- At ₹10,000/month costs: Need 50 premium communities

---

## Quick Reference: What's Free Forever

| Feature | Free? | Notes |
|---------|-------|-------|
| Google Sign-In | ✅ Yes | Always free |
| Apple Sign-In | ✅ Yes | Always free |
| Magic Link Email | ✅ Yes | Up to 3K/month |
| Push Notifications | ✅ Yes | FCM is free |
| Real-time Chat | ✅ Yes | Up to 200 concurrent |
| Photo Storage | ✅ Yes | Up to 1GB |
| Basic Analytics | ✅ Yes | PostHog free tier |
| Error Tracking | ✅ Yes | Sentry free tier |
| Phone OTP | ❌ No | ~₹0.30/SMS |
| Online Payments | ❌ No | 2.9% + fees |
| SMS Notifications | ❌ No | ~₹0.30/SMS |
