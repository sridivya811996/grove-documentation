---
title: Authentication and Login Flow
---

# Authentication and Login Flow

## Supported Login Paths

- Email and password
- Username and password (username is resolved to email first)
- Google OAuth (PKCE)
- Apple sign-in (iOS)
- OTP/magic-link plumbing exists for staged use

## Core Flow

1. User authenticates with Supabase Auth.
2. Session is stored via SecureStore (mobile) or localStorage (web).
3. Root layout checks auth and profile completeness.
4. Incomplete profile is redirected to `/(auth)/complete-profile`.
5. Complete profile is routed to `/(tabs)`.

## Callback Handling

Auth callback page handles:

- Access and refresh token pair
- OAuth authorization code exchange
- Recovery type routing for password reset path

## Security and UX Notes

- Session auto-refresh is enabled
- Redirect handling is centralized in `getAuthRedirectUrl()`
- Sign out clears query cache to prevent cross-account data flashes on shared devices
