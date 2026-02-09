# Grove App Store Launch Guide

> Complete guide to publishing Grove on Google Play Store and Apple App Store

## Quick Summary

| Store | Fee | Review Time | Difficulty |
|-------|-----|-------------|------------|
| Google Play | $25 (one-time) | 1-3 days | Easier |
| Apple App Store | $99/year | 1-7 days | Harder |

**Recommended Order**: Android first (cheaper, faster), then iOS.

---

## Phase 1: Pre-Launch Preparation

### 1.1 Legal Documents (Priority: Critical)

#### Privacy Policy
**Why**: Both stores require it. Google rejects apps without one.

**What to include**:
- Data you collect (email, photos, location if any)
- How you use it
- Third-party sharing (Supabase, Google Auth)
- User rights (access, delete, export)
- Contact information

**Free Tools**:
- [Iubenda](https://www.iubenda.com) - Free tier available
- [PrivacyPolicies.com](https://privacypolicies.com)
- [Termly](https://termly.io)

**Hosting**:
```
Options:
1. GitHub Pages (free) - create /privacy-policy.md
2. Your website
3. Notion public page
```

#### Terms of Service
Similar to privacy policy. Include:
- Acceptable use
- User-generated content rules
- Liability limitations
- Termination conditions

### 1.2 Developer Accounts

#### Google Play Console
```bash
# Steps
1. Go to: https://play.google.com/console
2. Sign in with Google account
3. Accept developer agreement
4. Pay $25 USD one-time fee
5. Complete account details
6. Verify identity (takes 24-48 hours)
```

**Pro Tips**:
- Use a dedicated business email
- Add a backup owner account
- Complete identity verification early (required before publishing)

#### Apple Developer Program
```bash
# Steps
1. Go to: https://developer.apple.com/enroll
2. Sign in with Apple ID
3. Enroll as Individual or Organization
4. Pay $99 USD/year
5. Wait for approval (1-3 days for individuals)
```

**Pro Tips**:
- Organization enrollment requires D-U-N-S number (takes 2 weeks)
- Individual is faster for MVP launch
- Can upgrade to Organization later

### 1.3 App Assets

#### App Icon Requirements

| Platform | Size | Format | Notes |
|----------|------|--------|-------|
| Android | 512x512 | PNG | Store listing |
| Android | Adaptive | PNG | Foreground + Background layers |
| iOS | 1024x1024 | PNG | No alpha/transparency |
| Both | 192x192 | PNG | In-app icon |

**Checklist**:
- [ ] No text (illegible at small sizes)
- [ ] Simple, recognizable shape
- [ ] Works on light and dark backgrounds
- [ ] No rounded corners (system adds them)

#### Screenshots Requirements

**Android (Play Store)**:
| Device Type | Size | Minimum | Maximum |
|-------------|------|---------|---------|
| Phone | 16:9 or 9:16 | 2 | 8 |
| 7" Tablet | 16:9 | 1 | 8 |
| 10" Tablet | 16:9 | 1 | 8 |

**iOS (App Store)**:
| Device | Size | Required |
|--------|------|----------|
| 6.9" Display | 1320x2868 | Yes (iPhone 15 Pro Max) |
| 6.5" Display | 1284x2778 | Yes (iPhone 14 Plus) |
| 5.5" Display | 1242x2208 | Yes (iPhone 8 Plus) |
| 12.9" iPad | 2048x2732 | If iPad supported |

**Recommended Screenshots**:
1. Login/Welcome screen
2. Community home with upcoming events
3. Event detail with RSVP
4. Chat interface
5. Finance/expense tracker
6. Member directory

**Free Tools**:
- [AppMockUp](https://app-mockup.com)
- [Previewed](https://previewed.app)
- [Screenshot Maker](https://theapplaunchpad.com)

#### Feature Graphic (Android Only)
- Size: 1024x500 px
- Include app name and tagline
- Show key feature or screenshot

---

## Phase 2: Technical Preparation

### 2.1 Configure EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Initialize EAS for your project
eas build:configure
```

Update `eas.json`:
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./play-store-key.json"
      },
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-id"
      }
    }
  }
}
```

### 2.2 Version Management

Update `app.json`:
```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1,
      "package": "com.grove.app"
    },
    "ios": {
      "buildNumber": "1",
      "bundleIdentifier": "com.grove.app"
    }
  }
}
```

**Version Strategy**:
- `version`: User-facing version (1.0.0, 1.0.1)
- `versionCode`/`buildNumber`: Internal integer, increment each build
- Auto-increment with `"autoIncrement": true` in eas.json

### 2.3 Build Commands

```bash
# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production

# Build for both
eas build --platform all --profile production

# Submit to stores (after first manual setup)
eas submit --platform android
eas submit --platform ios
```

### 2.4 Environment Configuration

Create EAS secrets for production:
```bash
eas secret:create --name SUPABASE_URL --value "your-url"
eas secret:create --name SUPABASE_ANON_KEY --value "your-key"
eas secret:create --name GOOGLE_CLIENT_ID --value "your-id"
```

---

## Phase 3: Store Submission

### 3.1 Google Play Store Submission

#### Data Safety Questionnaire
Answer these questions in Play Console:

| Question | Grove's Answer |
|----------|----------------|
| Does app collect user data? | Yes |
| Data types collected | Email, name, photos, messages |
| Is data encrypted in transit? | Yes (Supabase uses HTTPS) |
| Can users request deletion? | Yes |
| Is data shared with third parties? | Supabase (backend), Google (auth) |

#### Content Rating
Complete the IARC questionnaire:
- Violence: None
- Sexual content: None
- User interaction: Yes (chat, messaging)
- In-app purchases: No (for MVP)
- Ads: No

Expected rating: **Everyone** or **Everyone 10+**

#### Release Steps
```
1. Go to Play Console > All apps > Create app
2. Enter app name: Grove
3. Select: App (not Game)
4. Select: Free
5. Complete store listing (all sections)
6. Upload AAB to Production track
7. Complete content rating
8. Complete data safety
9. Select countries/regions
10. Submit for review
```

### 3.2 Apple App Store Submission

#### App Store Connect Setup
```
1. Go to App Store Connect
2. My Apps > + (New App)
3. Enter: Name, primary language, bundle ID, SKU
4. Fill App Information section
5. Fill Pricing and Availability
6. Upload build (EAS submit or Transporter)
7. Complete App Review Information
8. Submit for Review
```

#### Common Rejection Reasons
1. **Crashes/Bugs**: Test thoroughly on real devices
2. **Broken links**: Verify all URLs work
3. **Login issues**: Provide demo credentials
4. **Incomplete metadata**: Fill all required fields
5. **Privacy policy issues**: Must be accessible and complete

#### App Review Information
```
Review Notes:
"Grove is a community management app for local groups.
Test account:
Email: demo@grove.app
Password: DemoPassword123

To test:
1. Login with provided credentials
2. View the Demo Community
3. Create an event or send a message"
```

---

## Phase 4: Post-Launch

### 4.1 Monitor & Respond

| Task | Frequency | Tools |
|------|-----------|-------|
| Check crash reports | Daily (first week) | Sentry, Play Console |
| Read user reviews | Daily | Store consoles |
| Respond to reviews | Within 24h | Store consoles |
| Track installs | Daily | Analytics |

### 4.2 First Week Priorities
1. Fix any critical bugs immediately
2. Respond to all reviews (positive and negative)
3. Monitor server load
4. Collect user feedback
5. Plan first update

### 4.3 Update Cadence
- **Hotfixes**: Same day for critical issues
- **Minor updates**: Every 2 weeks
- **Major updates**: Monthly

---

## Cost Summary

### One-Time Costs
| Item | INR | USD |
|------|-----|-----|
| Google Play Developer | ₹2,075 | $25 |
| Apple Developer (Year 1) | ₹8,225 | $99 |
| **Total Minimum** | **₹10,300** | **$124** |

### Optional Costs
| Item | INR | USD |
|------|-----|-----|
| Custom Domain | ₹1,000-5,000/yr | $12-60/yr |
| Professional Screenshots | ₹5,000-15,000 | $60-180 |
| App Preview Video | ₹10,000-30,000 | $120-360 |
| Legal Review | ₹10,000-50,000 | $120-600 |

### Monthly Recurring (Post-Launch)
| Item | Free Tier | Paid Tier |
|------|-----------|-----------|
| Supabase | 500MB DB, 1GB storage | $25/mo+ |
| Sentry | 5K errors/mo | $26/mo+ |
| Support Tools | Email only | $50/mo+ |

---

## Checklist Before Submission

### Technical
- [ ] App builds without errors
- [ ] Tested on multiple devices
- [ ] Push notifications working
- [ ] Deep links configured
- [ ] Error monitoring active
- [ ] Analytics tracking events
- [ ] Production API endpoints set

### Store Listing
- [ ] App icon uploaded
- [ ] All screenshots uploaded
- [ ] Short description written
- [ ] Full description written
- [ ] Keywords added (iOS)
- [ ] Category selected
- [ ] Content rating completed

### Legal
- [ ] Privacy policy URL works
- [ ] Terms of service URL works
- [ ] Data safety form completed (Android)
- [ ] Export compliance answered (iOS)

### Pre-Submit
- [ ] Build uploaded successfully
- [ ] Demo account created for reviewers
- [ ] Review notes written
- [ ] Contact info provided

---

## Quick Reference Links

| Resource | URL |
|----------|-----|
| Google Play Console | https://play.google.com/console |
| App Store Connect | https://appstoreconnect.apple.com |
| Expo EAS | https://expo.dev/eas |
| EAS Documentation | https://docs.expo.dev/eas |
| Play Store Guidelines | https://play.google.com/about/developer-content-policy |
| App Store Guidelines | https://developer.apple.com/app-store/review/guidelines |

---

*Last updated: February 2026*
