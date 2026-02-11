# Grove Authentication System

This document describes the authentication flows, account linking behavior, and implementation details for the Grove Community app.

## Table of Contents

1. [Overview](#overview)
2. [Authentication Methods](#authentication-methods)
3. [User Flows](#user-flows)
4. [Account Linking](#account-linking)
5. [Profile Onboarding](#profile-onboarding)
6. [Email Verification](#email-verification)
7. [Password Recovery](#password-recovery)
8. [Session Management](#session-management)
9. [Security Considerations](#security-considerations)
10. [Supabase Configuration](#supabase-configuration)
11. [Implementation Details](#implementation-details)

---

## Overview

Grove uses [Supabase Auth](https://supabase.com/docs/guides/auth) as the authentication backend, providing:

- **Email/Password** authentication with email verification
- **OAuth** authentication (Google, Apple)
- **Magic Link** passwordless authentication
- **Automatic account linking** for same-email identities

### Key Principles

1. **One email = One account** - Users with the same email share a single account, regardless of auth method
2. **OAuth is instant** - No email verification required for OAuth sign-ins
3. **Profile completion** - OAuth users may need to complete their profile (set username) on first login
4. **Deep linking** - Email verification links open the app directly and auto-sign in

---

## Authentication Methods

### 1. Email/Password

Traditional email and password authentication with email verification.

**Sign Up Flow:**
```
User enters: First name, Last name, Username, Email, Password
     ↓
Validation (username availability, email format, password strength)
     ↓
Supabase creates user with email confirmation required
     ↓
User redirected to "Check Email" screen
     ↓
User clicks email link → Opens app → Auto-signed in → Home
```

**Sign In Flow:**
```
User enters: Email/Username + Password
     ↓
If username provided → Lookup email from profiles table
     ↓
Supabase validates credentials
     ↓
If email not verified → Error: "Please verify your email"
     ↓
Success → Navigate to Home
```

### 2. Google OAuth

One-tap sign in with Google account.

**Flow:**
```
User taps "Continue with Google"
     ↓
Opens Google OAuth consent screen (in-app browser)
     ↓
User authorizes Grove
     ↓
Supabase receives Google token, creates/links user
     ↓
Profile auto-created via database trigger
     ↓
Check profile_complete flag
     ↓
If incomplete → "Complete Profile" screen
If complete → Home
```

**Data extracted from Google:**
- `email` - User's email address
- `full_name` / `name` - Display name
- `avatar_url` - Profile picture URL

### 3. Apple Sign-In

Available only on iOS devices.

**Flow:** Similar to Google OAuth, but:
- Apple may hide the user's real email (uses relay email)
- First/last name only provided on first authorization
- Subsequent logins don't include name data

**Important:** Store name data on first Apple sign-in, as it won't be provided again.

### 4. Magic Link (Passwordless)

Email-based passwordless authentication.

**Flow:**
```
User enters email
     ↓
Supabase sends magic link email
     ↓
User clicks link → Opens app
     ↓
App exchanges token for session
     ↓
If new user → Complete Profile
If existing → Home
```

---

## User Flows

### New User - Email Sign Up

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. LOGIN SCREEN (Sign Up mode)                                │
│     ┌──────────────────────────────────────────────────────┐   │
│     │ First name:    [John                              ]  │   │
│     │ Last name:     [Smith                             ]  │   │
│     │ Username:      [johnsmith                         ]  │   │
│     │ Email:         [john@example.com                  ]  │   │
│     │ Password:      [••••••••                          ]  │   │
│     │                                                      │   │
│     │            [ Create account ]                        │   │
│     └──────────────────────────────────────────────────────┘   │
│                              ↓                                 │
│  2. CHECK EMAIL SCREEN                                         │
│     ┌──────────────────────────────────────────────────────┐   │
│     │            ✉️  Check your email                      │   │
│     │                                                      │   │
│     │   We sent a verification link to                     │   │
│     │   john@example.com                                   │   │
│     │                                                      │   │
│     │   ┌────────────────────────────────────────────┐    │   │
│     │   │ ✓ Click the link to sign in automatically  │    │   │
│     │   │   No need to enter your password again.    │    │   │
│     │   └────────────────────────────────────────────┘    │   │
│     │                                                      │   │
│     │            [ Open email app ]                        │   │
│     └──────────────────────────────────────────────────────┘   │
│                              ↓                                 │
│  3. USER CLICKS EMAIL LINK                                     │
│     → Deep link: grove://auth/callback?access_token=...        │
│                              ↓                                 │
│  4. CALLBACK SCREEN (brief loading)                            │
│     → Exchanges token for session                              │
│     → Sets authenticated state                                 │
│                              ↓                                 │
│  5. HOME SCREEN                                                │
│     User is signed in!                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### New User - Google OAuth

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. LOGIN SCREEN                                               │
│     User taps [ Continue with Google ]                         │
│                              ↓                                 │
│  2. GOOGLE CONSENT (in-app browser)                            │
│     User authorizes Grove access                               │
│                              ↓                                 │
│  3. AUTOMATIC PROFILE CREATION                                 │
│     Database trigger creates profile:                          │
│     - email: from Google                                       │
│     - first_name: from Google (or email prefix)                │
│     - username: email prefix + suffix if collision             │
│     - avatar_url: Google profile picture                       │
│     - profile_complete: false                                  │
│                              ↓                                 │
│  4. COMPLETE PROFILE SCREEN                                    │
│     ┌──────────────────────────────────────────────────────┐   │
│     │           Complete your profile                       │   │
│     │                                                      │   │
│     │   [Google Avatar]  john@gmail.com                    │   │
│     │                                                      │   │
│     │   First name*:  [John                             ]  │   │
│     │   Last name:    [Smith                            ]  │   │
│     │   Username*:    [johnsmith                        ]  │   │
│     │                                                      │   │
│     │            [ Continue ]                              │   │
│     └──────────────────────────────────────────────────────┘   │
│                              ↓                                 │
│  5. HOME SCREEN                                                │
│     User is signed in with complete profile!                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Returning User - Any Method

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. User opens app with existing session                       │
│     → Session validated automatically                          │
│     → Profile fetched and checked for completeness             │
│                              ↓                                 │
│  2. If profile_complete = true                                 │
│     → Navigate directly to Home                                │
│                                                                 │
│  3. If profile_complete = false                                │
│     → Navigate to Complete Profile screen                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Account Linking

### How It Works

When **Automatic Identity Linking** is enabled in Supabase, users with the same email address are linked to a single account:

| Scenario | Behavior |
|----------|----------|
| Google first → Email signup (same email) | Accounts linked, can use either method |
| Email first → Google (same email) | Accounts linked, can use either method |
| Google → Apple (same email) | Accounts linked, can use any method |
| Email + Google + Apple (same email) | Single account with 3 identities |

### User Experience

```
Example: John signs up with Google (john@gmail.com)

Later, John tries to sign up with email/password using john@gmail.com:
  → Supabase detects existing account
  → Links email/password identity to existing Google account
  → John can now sign in with either Google OR email/password
  → All data (communities, profile, etc.) is shared
```

### Important Notes

1. **Email must match exactly** - `john@gmail.com` ≠ `John@Gmail.com` (case-sensitive by default)
2. **OAuth email is trusted** - Google/Apple verified the email, so no re-verification needed
3. **Password can be added later** - OAuth users can set a password via "Forgot Password" flow

---

## Profile Onboarding

### When Is Onboarding Required?

After successful authentication, the app checks:

```typescript
function isProfileComplete(profile: Profile): boolean {
  return (
    profile.profile_complete === true ||
    (!!profile.username &&
      profile.username.length >= 3 &&
      !!profile.first_name &&
      profile.first_name.length >= 1)
  );
}
```

### Complete Profile Screen

Required fields:
- **First name** (required) - Minimum 1 character
- **Username** (required) - 3-20 characters, alphanumeric + dots/underscores/hyphens
- **Last name** (optional)

Pre-filled from OAuth data when available.

### Username Collision Handling

The database trigger ensures unique usernames:

```sql
-- If "johnsmith" exists, try "johnsmith_a3f2", "johnsmith_b7c1", etc.
WHILE EXISTS (SELECT 1 FROM profiles WHERE lower(username) = v_username) LOOP
  v_username := v_base_username || '_' || random_suffix();
END LOOP;
```

---

## Email Verification

### Configuration

Email verification is required for email/password signups.

**Supabase settings:**
- Authentication → Email → Enable email confirmations: **ON**
- Email template: Custom template with Grove branding

### Verification Link Format

```
https://[project].supabase.co/auth/v1/verify?token=xxx&type=signup&redirect_to=grove://auth/callback
```

After verification, Supabase redirects to the app's callback URL with tokens.

### Deep Link Handling

The `callback.tsx` screen:
1. Extracts `access_token` and `refresh_token` from URL
2. Sets the session in Supabase client
3. Updates auth store state
4. Navigates to Home (or Reset Password if `type=recovery`)

---

## Password Recovery

### Flow

```
1. User taps "Forgot password?" on login screen
     ↓
2. Enter email → Supabase sends reset link
     ↓
3. User clicks link → Opens app at callback
     ↓
4. Callback detects type=recovery → Navigate to Reset Password screen
     ↓
5. User enters new password → Updated in Supabase
     ↓
6. User is signed in → Navigate to Home
```

### Security

- Reset links expire after 1 hour
- Old password is not required (user may have forgotten it)
- User is automatically signed in after reset

---

## Session Management

### Session Storage

- Sessions are stored securely by Supabase client
- On React Native: `@supabase/supabase-js` uses `AsyncStorage`
- Sessions include: `access_token`, `refresh_token`, `expires_at`

### Session Refresh

- Access tokens expire after 1 hour (configurable in Supabase)
- Refresh tokens are long-lived
- Supabase client auto-refreshes tokens before expiry

### Sign Out

```typescript
await supabase.auth.signOut();
// Clears local session
// Invalidates refresh token on server
```

### Multi-Device

- User can be signed in on multiple devices
- Each device has its own session
- Sign out on one device doesn't affect others (unless using `signOut({ scope: 'global' })`)

---

## Security Considerations

### Password Requirements

- Minimum 6 characters (enforced in app)
- Supabase default allows weak passwords; consider custom validation

### OAuth Security

- Uses PKCE flow (Proof Key for Code Exchange)
- Tokens never exposed in URLs
- In-app browser prevents token interception

### Rate Limiting

Supabase has built-in rate limiting:
- 30 requests per hour for password logins (per IP)
- 4 email sends per hour (per email)

### Sensitive Data

Never log or expose:
- Access tokens
- Refresh tokens
- Passwords
- OTP codes

---

## Supabase Configuration

### Required Settings

1. **Authentication → Providers**
   - Email: Enabled, Confirm email: ON
   - Google: Enabled, Client ID + Secret configured
   - Apple: Enabled (iOS only), Service ID + Secret configured

2. **Authentication → URL Configuration**
   - Site URL: `https://grove-community.com`
   - Redirect URLs:
     - `grove://auth/callback` (production deep link)
     - `exp://192.168.x.x:8081/--/auth/callback` (development)

3. **Authentication → Email Templates**
   - Confirm signup: Custom template with Grove branding
   - Reset password: Custom template
   - Magic link: Custom template

4. **Authentication → Security**
   - Enable automatic identity linking: **ON**
   - Secure email change: ON
   - Leaked password protection: ON (recommended)

### Email Provider (Resend)

Configure SMTP in Supabase:
- SMTP Host: `smtp.resend.com`
- SMTP Port: `465`
- SMTP User: `resend`
- SMTP Password: Your Resend API key
- Sender email: `noreply@grove-community.com`
- Sender name: `Grove`

---

## Implementation Details

### Key Files

| File | Purpose |
|------|---------|
| `stores/auth-store.ts` | Zustand store for auth state |
| `hooks/use-profile.ts` | Profile fetching and updates |
| `hooks/use-google-auth.ts` | Google OAuth flow |
| `app/(auth)/login.tsx` | Login/signup screen |
| `app/(auth)/callback.tsx` | Deep link callback handler |
| `app/(auth)/complete-profile.tsx` | Profile completion for OAuth users |
| `app/(auth)/check-email.tsx` | Email verification waiting screen |
| `app/_layout.tsx` | Root layout with auth routing logic |
| `lib/auth-redirect.ts` | Platform-specific redirect URLs |

### Database

**Trigger: `handle_new_user()`**
- Fires on `INSERT` into `auth.users`
- Creates profile in `public.profiles`
- Handles username collisions
- Sets `profile_complete = false` for OAuth users

**RPC: `complete_profile()`**
- Called from Complete Profile screen
- Validates and sets first_name, last_name, username
- Sets `profile_complete = true`

### Auth Store State

```typescript
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitializing: boolean;
  isAuthenticated: boolean;
  hasInitialized: boolean;
}
```

### Profile Completeness Check

Location: `app/_layout.tsx`

```typescript
useEffect(() => {
  if (isAuthenticated && !isProfileComplete(profile)) {
    router.replace('/(auth)/complete-profile');
  }
}, [isAuthenticated, profile]);
```

---

## Testing Checklist

### Email/Password Flow
- [ ] Sign up with new email
- [ ] Receive verification email
- [ ] Click verification link → App opens, user signed in
- [ ] Sign out and sign in with password
- [ ] Sign in with username instead of email

### OAuth Flow
- [ ] Sign in with Google (new user)
- [ ] Redirected to Complete Profile
- [ ] Complete profile → Navigate to Home
- [ ] Sign out and sign in with Google (returning user)
- [ ] Skips Complete Profile → Goes to Home

### Account Linking
- [ ] Sign up with Google
- [ ] Try email signup with same email → Accounts linked
- [ ] Can sign in with either method

### Password Recovery
- [ ] Request password reset
- [ ] Click reset link → App opens at Reset Password
- [ ] Set new password → Signed in

### Edge Cases
- [ ] Expired verification link
- [ ] Invalid reset token
- [ ] Username collision during OAuth signup
- [ ] Network failure during auth

---

## Troubleshooting

### Common Issues

**"Email not confirmed"**
- User hasn't clicked verification link
- Link may have expired (resend verification)

**"Invalid login credentials"**
- Wrong password
- Email doesn't exist (user never signed up)

**"User already registered"**
- Email exists with different auth method
- Enable automatic identity linking

**OAuth popup closes immediately**
- Check redirect URLs in Supabase
- Verify deep link configuration in app.json

**Profile not created after OAuth**
- Check `handle_new_user()` trigger exists
- Check for errors in Supabase logs

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-10 | Initial documentation |
