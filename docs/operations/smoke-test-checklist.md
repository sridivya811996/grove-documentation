---
sidebar_position: 14
title: Smoke Test Checklist
description: QA checklist for testing production builds before app store submission
---

# Smoke Test Checklist

Complete this checklist before submitting to app stores. Test on a **production build** (not development).

## Pre-Test Setup

- [ ] Install production APK/IPA on physical device
- [ ] Ensure device has internet connection
- [ ] Clear any previous app data/cache
- [ ] Have test accounts ready (new + existing)

---

## 1. Authentication

### Fresh Install - New User
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| App launches without crash | | | |
| Login screen displays correctly | | | |
| Google Sign-In works | | | |
| Apple Sign-In works (iOS) | | | |
| New user profile created automatically | | | |
| Redirected to home after login | | | |

### Existing User
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Sign in with existing account | | | |
| Previous data loads correctly | | | |
| Session persists after app restart | | | |
| Sign out works | | | |
| Sign out clears session | | | |

---

## 2. Communities

### View Communities
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Home screen shows community list | | | |
| Community cards display correctly | | | |
| Empty state shown when no communities | | | |
| Pull to refresh works | | | |

### Create Community
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Create community button visible | | | |
| Form fields work (name, description) | | | |
| Image upload works | | | |
| Community created successfully | | | |
| Creator becomes owner | | | |
| Invite code generated | | | |

### Join Community
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Join with invite code works | | | |
| Invalid code shows error | | | |
| User added as member | | | |
| Community appears in list | | | |

---

## 3. Events

### View Events
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Events tab loads | | | |
| Upcoming events displayed | | | |
| Past events accessible | | | |
| Event cards show correct info | | | |
| Empty state when no events | | | |

### Create Event
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Create event button visible | | | |
| Title field works | | | |
| Description field works | | | |
| Date picker works | | | |
| Time picker works | | | |
| Location field works | | | |
| Event saves successfully | | | |
| Event appears in list | | | |

### Event Details & RSVP
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Event detail page loads | | | |
| All event info displayed | | | |
| RSVP Going works | | | |
| RSVP Maybe works | | | |
| RSVP Not Going works | | | |
| Attendee count updates | | | |
| Attendee list shows correctly | | | |

---

## 4. Feed

### View Feed
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Feed tab loads | | | |
| Posts display correctly | | | |
| Author info shown | | | |
| Timestamps correct | | | |
| Pull to refresh works | | | |

### Create Post
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Create post button visible | | | |
| Text input works | | | |
| Post submits successfully | | | |
| Post appears in feed | | | |

### Comments
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Tap post opens detail | | | |
| Comments load | | | |
| Add comment works | | | |
| Comment appears | | | |

---

## 5. Finance (Admin Only)

### View Transactions
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Finance tab loads | | | |
| Transactions list displayed | | | |
| Income shown correctly | | | |
| Expenses shown correctly | | | |
| Balance calculated correctly | | | |

### Add Transaction
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Add transaction button visible | | | |
| Type selection works (income/expense) | | | |
| Amount input works | | | |
| Description input works | | | |
| Category selection works | | | |
| Date picker works | | | |
| Transaction saves successfully | | | |

---

## 6. Polls

### View Polls
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Polls section loads | | | |
| Active polls displayed | | | |
| Closed polls accessible | | | |

### Vote on Poll
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Tap poll opens detail | | | |
| Options displayed | | | |
| Can select option | | | |
| Vote submits | | | |
| Results shown after voting | | | |

---

## 7. Profile

### View Profile
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Profile tab loads | | | |
| Name displayed | | | |
| Email displayed | | | |
| Avatar displayed | | | |

### Edit Profile
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Edit button works | | | |
| Can change name | | | |
| Can change username | | | |
| Can upload new avatar | | | |
| Changes save successfully | | | |

### Notification Settings
| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Settings screen loads | | | |
| Toggle switches work | | | |
| Settings persist after restart | | | |

---

## 8. Notifications

| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Push permission prompt shows | | | |
| Push notifications received | | | |
| Tapping notification opens app | | | |
| Deep link to correct screen | | | |

---

## 9. Error Handling

| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Offline mode shows message | | | |
| Network error handled gracefully | | | |
| Invalid input shows validation | | | |
| App recovers from errors | | | |

---

## 10. Performance

| Test | Pass | Fail | Notes |
|------|------|------|-------|
| App launches in < 3 seconds | | | |
| Screens load quickly | | | |
| Scrolling is smooth | | | |
| No memory warnings | | | |
| No excessive battery drain | | | |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Tester | | | |
| Developer | | | |
| Product Owner | | | |

### Notes / Issues Found

```
[List any issues discovered during testing]
```

### Recommendation

- [ ] **APPROVED** for submission
- [ ] **BLOCKED** - issues must be fixed first

---

## Quick Reference: Critical Paths

These flows MUST work for store approval:

1. **Fresh user onboarding**: Install → Sign in → Create/Join community
2. **Event creation**: Open community → Create event → Verify in list
3. **RSVP flow**: View event → RSVP → See in attendee list
4. **Post creation**: Open feed → Create post → See in feed
5. **Profile edit**: Open profile → Edit → Save → Verify changes

If any critical path fails, **do not submit**.
