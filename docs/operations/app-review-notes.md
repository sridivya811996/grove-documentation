---
sidebar_position: 12
title: App Review Notes
description: Instructions and demo account for App Store and Play Store reviewers
---

# App Review Notes

Provide these notes to Apple and Google reviewers to ensure smooth app review.

## Demo Account Credentials

```
Email: reviewer@grove.app
Password: GroveReview2026!
```

:::warning Important
Create this account in your Supabase database before submission with pre-populated demo data.
:::

## Setup Script for Demo Account

Run this in Supabase SQL Editor to create the demo environment:

```sql
-- Create demo user (after they sign up with the credentials above)
-- This assumes the user has already been created via the auth flow

-- Create demo community
INSERT INTO public.communities (id, name, description, created_by, invite_code, join_mode)
VALUES (
  'demo-community-id',
  'Oakwood Residents Association',
  'Demo community for app review. A residential community with 50+ families.',
  (SELECT id FROM auth.users WHERE email = 'reviewer@grove.app'),
  'DEMO2026',
  'private'
);

-- Add reviewer as owner
INSERT INTO public.community_members (community_id, user_id, role)
VALUES (
  'demo-community-id',
  (SELECT id FROM auth.users WHERE email = 'reviewer@grove.app'),
  'owner'
);

-- Create sample events, posts, etc.
-- (Add more seed data as needed)
```

## Review Notes for Apple (App Store Connect)

```
Thank you for reviewing Grove!

Grove is a community management app that helps groups organize events,
communicate, and manage shared finances.

DEMO ACCOUNT
Email: reviewer@grove.app
Password: GroveReview2026!

Or you can use "Sign in with Apple" to create a new account.

TESTING THE APP

1. SIGN IN
   - Use the demo account or Sign in with Apple
   - You'll be taken to the home screen

2. HOME TAB
   - View your communities
   - The demo account has access to "Oakwood Residents Association"
   - Tap to enter the community

3. EVENTS
   - View upcoming and past events
   - Tap an event to see details and RSVP
   - Tap + to create a new event

4. FEED
   - View community posts and announcements
   - Tap + to create a new post
   - Tap a post to comment

5. FINANCE (Admin only)
   - View community income and expenses
   - Tap + to add a transaction
   - View transaction history

6. POLLS
   - View active polls
   - Cast your vote
   - Create new polls (admin only)

7. PROFILE
   - View and edit your profile
   - Manage notification preferences
   - Sign out

REQUIREMENTS
- Active internet connection required
- Push notifications permission (optional)

CONTACT
If you have any questions: support@grove.app

Thank you!
```

## Review Notes for Google (Play Console)

```
Thank you for reviewing Grove!

Grove is a community management app for organizing events, communication,
and shared finances.

DEMO ACCOUNT
Email: reviewer@grove.app
Password: GroveReview2026!

WHAT TO TEST

1. Authentication
   - Sign in with demo account or Google Sign-In

2. Community Features
   - View community home screen
   - Browse member list
   - Check community settings (as admin)

3. Events
   - View event list
   - Open event details
   - RSVP to an event
   - Create a new event

4. Feed
   - Browse posts
   - Create a post
   - Add comments

5. Finance
   - View transactions (admin feature)
   - Add income/expense

6. Polls
   - View and vote on polls

7. Profile
   - Edit profile information
   - Change notification settings

PERMISSIONS USED
- Camera: Take photos for events/posts
- Photos: Upload images
- Notifications: Event reminders and updates

CONTACT: support@grove.app
```

## Pre-Review Checklist

Before submitting for review, ensure:

### Demo Data Setup
- [ ] Demo account created and can sign in
- [ ] Demo community exists with sample data
- [ ] Sample events (past and upcoming)
- [ ] Sample posts in feed
- [ ] Sample transactions (if finance enabled)
- [ ] Sample polls
- [ ] At least 2-3 demo members in community

### App Functionality
- [ ] All authentication methods work (Google, Apple)
- [ ] Deep links work correctly
- [ ] Push notifications configured
- [ ] All images load correctly
- [ ] No crashes on main user flows
- [ ] Network error handling works

### Store Assets
- [ ] Screenshots uploaded for all required sizes
- [ ] App icon uploaded
- [ ] Feature graphic uploaded (Android)
- [ ] Privacy policy URL accessible
- [ ] Support URL accessible

### Compliance
- [ ] Privacy policy matches actual data collection
- [ ] Data safety form completed (Android)
- [ ] App privacy details completed (iOS)
- [ ] Content rating questionnaire completed

## Common Rejection Reasons & Solutions

| Rejection Reason | Solution |
|-----------------|----------|
| Broken links | Verify all URLs in app and store listing |
| Login issues | Test demo account, ensure Supabase is running |
| Incomplete functionality | Ensure all advertised features work |
| Missing privacy policy | Host at accessible URL |
| Crash on launch | Test on clean install, check API keys |
| Placeholder content | Remove all Lorem ipsum, TODO comments |
| Missing demo account | Provide working credentials |

## Contact Information

Provide this in both store listings:

- **Support Email**: support@grove.app
- **Privacy Inquiries**: privacy@grove.app
- **Website**: https://grove.app
