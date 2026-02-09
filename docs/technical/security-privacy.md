---
title: Security & Privacy
sidebar_position: 7
description: Security architecture, privacy controls, and compliance documentation
---

# Security & Privacy

Grove is built with security and privacy as fundamental requirements, not afterthoughts. This document outlines our security architecture, data protection measures, and privacy controls.

## Security Philosophy

```mermaid
mindmap
  root((Security First))
    Defense in Depth
      Transport Security
      Authentication
      Authorization
      Data Protection
    Privacy by Design
      Data Minimization
      Purpose Limitation
      User Control
    Zero Trust
      Verify Everything
      Least Privilege
      Assume Breach
```

---

## Security Architecture

### Defense in Depth

Grove implements multiple security layers to protect user data:

```mermaid
flowchart TB
    subgraph Layer1["Layer 1: Transport Security"]
        TLS[TLS 1.3 Encryption]
        HSTS[HTTP Strict Transport Security]
        Pinning[Certificate Pinning]
    end

    subgraph Layer2["Layer 2: Authentication"]
        JWT[JWT Token Validation]
        OAuth[OAuth 2.0 + PKCE]
        MFA[Multi-Factor Auth Ready]
    end

    subgraph Layer3["Layer 3: Authorization"]
        RLS[Row Level Security]
        RBAC[Role-Based Access Control]
        Scoping[Community Scoping]
    end

    subgraph Layer4["Layer 4: Data Protection"]
        Encryption[Encryption at Rest]
        Masking[Data Masking]
        Audit[Audit Logging]
    end

    Layer1 --> Layer2 --> Layer3 --> Layer4

    User[User Request] --> Layer1
    Layer4 --> Data[(Protected Data)]
```

### Security Controls Matrix

| Layer | Control | Implementation | Status |
|-------|---------|----------------|--------|
| Transport | TLS 1.3 | Supabase managed | Active |
| Transport | HSTS | Supabase default | Active |
| Auth | JWT tokens | Supabase Auth | Active |
| Auth | OAuth 2.0 | Google, Apple | Active |
| Auth | Password hashing | bcrypt | Active |
| Authz | Row Level Security | PostgreSQL RLS | Active |
| Authz | Role-based access | Owner/Admin/Member | Active |
| Data | Encryption at rest | Supabase managed | Active |
| Data | Signed URLs | Storage access | Active |
| Monitoring | Audit logs | Planned | Planned |

---

## Authentication Security

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Supabase as Supabase Auth
    participant DB as Database

    User->>App: Enter credentials
    App->>Supabase: Authenticate request
    Supabase->>Supabase: Validate credentials
    Supabase->>Supabase: Generate JWT
    Supabase->>App: Return access + refresh tokens

    Note over App: Store tokens securely

    App->>Supabase: API request with JWT
    Supabase->>Supabase: Validate JWT signature
    Supabase->>Supabase: Check token expiry
    Supabase->>DB: Execute query with user context
    DB->>Supabase: Return filtered data
    Supabase->>App: API response
```

### Token Security

**Token Types:**

| Token | Lifetime | Storage | Refresh |
|-------|----------|---------|---------|
| Access Token | 1 hour | Memory | Auto-refresh |
| Refresh Token | 7 days | Secure Storage | On expiry |

**Secure Storage Implementation:**
```typescript
// iOS: Keychain
// Android: EncryptedSharedPreferences
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('refresh_token', token, {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});
```

### Password Requirements

- Minimum 8 characters
- No maximum limit
- Hashed with bcrypt (cost factor 10)
- No password stored in plaintext

### OAuth Security (PKCE)

```mermaid
sequenceDiagram
    participant App
    participant Browser
    participant OAuth as OAuth Provider
    participant Supabase

    App->>App: Generate code_verifier (random)
    App->>App: Create code_challenge = SHA256(code_verifier)
    App->>Browser: Open OAuth with code_challenge
    Browser->>OAuth: Authorization request
    OAuth->>Browser: Return auth code
    Browser->>App: Redirect with code
    App->>Supabase: Exchange code + code_verifier
    Supabase->>OAuth: Verify with code_verifier
    OAuth->>Supabase: Token response
    Supabase->>App: Session tokens
```

---

## Authorization Security

### Row Level Security (RLS)

Every table in Grove has RLS policies that enforce access control at the database level:

```mermaid
flowchart TB
    Request[API Request] --> JWT{Valid JWT?}
    JWT -->|No| Reject1[401 Unauthorized]
    JWT -->|Yes| RLS{RLS Policy Check}
    RLS -->|Fail| Reject2[403 Forbidden]
    RLS -->|Pass| Execute[Execute Query]
    Execute --> Filter[Apply Row Filters]
    Filter --> Return[Return Filtered Data]
```

**Example RLS Policies:**

```sql
-- Users can only view communities they belong to
CREATE POLICY "community_member_select"
ON communities FOR SELECT
USING (
  id IN (
    SELECT community_id FROM community_members
    WHERE user_id = auth.uid()
  )
);

-- Only community owners can delete communities
CREATE POLICY "community_owner_delete"
ON communities FOR DELETE
USING (
  id IN (
    SELECT community_id FROM community_members
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- Users can only update their own profile
CREATE POLICY "profile_owner_update"
ON profiles FOR UPDATE
USING (id = auth.uid());
```

### Role-Based Access Control

```mermaid
flowchart TB
    subgraph Roles["Community Roles"]
        Owner[Owner]
        Admin[Admin]
        Member[Member]
    end

    subgraph Permissions["Permissions"]
        Delete[Delete Community]
        Manage[Manage Members]
        Settings[Change Settings]
        Create[Create Content]
        View[View Content]
    end

    Owner --> Delete
    Owner --> Manage
    Owner --> Settings
    Owner --> Create
    Owner --> View

    Admin --> Manage
    Admin --> Settings
    Admin --> Create
    Admin --> View

    Member --> Create
    Member --> View
```

**Permission Matrix:**

| Action | Owner | Admin | Member |
|--------|-------|-------|--------|
| Delete community | Yes | No | No |
| Transfer ownership | Yes | No | No |
| Manage members | Yes | Yes | No |
| Change settings | Yes | Yes | No |
| Create events | Yes | Yes | No |
| Create posts | Yes | Yes | Yes |
| Send messages | Yes | Yes | Yes |
| View content | Yes | Yes | Yes |
| RSVP to events | Yes | Yes | Yes |

---

## Data Protection

### Encryption

**In Transit:**
- All API calls over HTTPS (TLS 1.3)
- WebSocket connections use WSS
- No sensitive data in query parameters

**At Rest:**
- Database encryption managed by Supabase
- Storage buckets encrypted
- Backups encrypted

### Sensitive Data Handling

```mermaid
flowchart TB
    subgraph Input["User Input"]
        Password[Password]
        Payment[Payment Info]
        Personal[Personal Data]
    end

    subgraph Processing["Processing"]
        Hash[Hash with bcrypt]
        Tokenize[Tokenize with Stripe]
        Validate[Validate & Sanitize]
    end

    subgraph Storage["Storage"]
        Hashed[(Hashed Password)]
        Token[(Payment Token Only)]
        Protected[(Protected Data)]
    end

    Password --> Hash --> Hashed
    Payment --> Tokenize --> Token
    Personal --> Validate --> Protected
```

### Media Security

**Storage Access Control:**
```mermaid
flowchart LR
    Request[Image Request] --> Auth{Authenticated?}
    Auth -->|No| Deny[403]
    Auth -->|Yes| Member{Community Member?}
    Member -->|No| Deny
    Member -->|Yes| Sign[Generate Signed URL]
    Sign --> Serve[Serve Image]
```

**Signed URL Implementation:**
```typescript
// Generate signed URL with expiration
const { data } = supabase.storage
  .from('community-images')
  .createSignedUrl(path, 3600); // 1 hour expiry
```

---

## Privacy Controls

### Data Minimization

Grove only collects data necessary for the service:

| Data Type | Purpose | Retention |
|-----------|---------|-----------|
| Email | Authentication, notifications | Account lifetime |
| Name | Display in community | Account lifetime |
| Avatar | Profile display | Account lifetime |
| Messages | Community communication | Indefinite |
| Transactions | Finance tracking | 7 years (compliance) |

### User Privacy Rights

```mermaid
flowchart TB
    User[User] --> Rights{Privacy Rights}

    Rights --> Access[Right to Access]
    Rights --> Rectify[Right to Rectify]
    Rights --> Delete[Right to Delete]
    Rights --> Export[Right to Export]
    Rights --> Object[Right to Object]

    Access --> ViewData[View all personal data]
    Rectify --> EditProfile[Edit profile data]
    Delete --> AccountDeletion[Delete account]
    Export --> DataExport[Export all data]
    Object --> OptOut[Opt out of processing]
```

### Privacy Features

1. **Profile Visibility**
   - Profile visible only to community members
   - Can hide email from other members
   - No public profile pages (MVP)

2. **Data Access**
   - Users can view all their data
   - Export functionality planned
   - Account deletion available

3. **Communication Preferences**
   - Push notification controls
   - Email notification preferences
   - Per-community notification settings

---

## Compliance

### GDPR Readiness

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Lawful basis | Ready | Consent + Legitimate interest |
| Data minimization | Ready | Only necessary data collected |
| Purpose limitation | Ready | Clear purposes documented |
| Right to access | Ready | Profile view in app |
| Right to rectification | Ready | Edit profile in app |
| Right to erasure | Ready | Account deletion |
| Data portability | Planned | Export feature |
| Privacy by design | Ready | Built into architecture |

### Data Processing

**Third-Party Processors:**

| Processor | Purpose | Data Shared | DPA |
|-----------|---------|-------------|-----|
| Supabase | Backend infrastructure | All user data | Yes |
| Google Cloud | OAuth, infrastructure | Auth data | Yes |
| Apple | Apple Sign-In | Auth data | Yes |
| Expo | Push notifications | Push tokens | Yes |

---

## Threat Model

### Identified Threats

```mermaid
flowchart TB
    subgraph Threats["Threat Categories"]
        Injection[SQL/XSS Injection]
        AuthBypass[Auth Bypass]
        DataLeak[Data Leakage]
        MITM[Man-in-the-Middle]
        Enumeration[User Enumeration]
    end

    subgraph Mitigations["Mitigations"]
        Parameterized[Parameterized Queries]
        JWT[JWT Validation]
        RLS[Row Level Security]
        TLS[TLS Encryption]
        RateLimit[Rate Limiting]
    end

    Injection --> Parameterized
    AuthBypass --> JWT
    DataLeak --> RLS
    MITM --> TLS
    Enumeration --> RateLimit
```

### Security Controls by Threat

| Threat | Risk | Mitigation | Status |
|--------|------|------------|--------|
| SQL Injection | High | Parameterized queries via Supabase | Mitigated |
| XSS | Medium | React Native (no DOM) | N/A |
| CSRF | Medium | SameSite cookies, token auth | Mitigated |
| Auth bypass | High | RLS, JWT validation | Mitigated |
| Data exposure | High | RLS policies, scoped access | Mitigated |
| Brute force | Medium | Rate limiting, lockout | Partial |
| Token theft | Medium | Secure storage, short expiry | Mitigated |

---

## Security Monitoring

### Current Monitoring

- Supabase Dashboard: API usage, errors
- Authentication logs: Sign-in attempts
- Storage logs: Access patterns

### Planned Monitoring

```mermaid
flowchart TB
    subgraph Sources["Event Sources"]
        Auth[Auth Events]
        API[API Requests]
        DB[Database Queries]
        App[App Events]
    end

    subgraph Processing["Processing"]
        Sentry[Sentry]
        Analytics[Analytics]
        Logs[Log Aggregation]
    end

    subgraph Alerting["Alerting"]
        Dashboard[Security Dashboard]
        Alerts[Alert System]
        Oncall[On-call Team]
    end

    Sources --> Processing --> Alerting
```

### Security Events to Monitor

| Event | Severity | Action |
|-------|----------|--------|
| Multiple failed logins | High | Temporary lockout |
| Unusual API patterns | Medium | Review and alert |
| RLS policy violations | High | Log and investigate |
| Token refresh failures | Low | Monitor trends |
| Mass data access | High | Alert immediately |

---

## Incident Response

### Response Plan

```mermaid
flowchart TB
    Detect[Detect Incident] --> Assess[Assess Severity]
    Assess --> Contain[Contain Impact]
    Contain --> Eradicate[Eradicate Threat]
    Eradicate --> Recover[Recover Systems]
    Recover --> Review[Post-Incident Review]
    Review --> Improve[Improve Defenses]
```

### Severity Levels

| Level | Definition | Response Time |
|-------|------------|---------------|
| Critical | Active data breach | Immediate |
| High | Security vulnerability | 4 hours |
| Medium | Potential exposure | 24 hours |
| Low | Minor issue | 1 week |

---

## Security Checklist

### Pre-Launch Security

- [x] TLS enabled on all endpoints
- [x] JWT token validation
- [x] RLS policies on all tables
- [x] Password hashing with bcrypt
- [x] OAuth with PKCE
- [x] Secure token storage
- [x] Input validation
- [ ] Rate limiting configured
- [ ] Audit logging enabled
- [ ] Security monitoring setup
- [ ] Incident response plan tested

### Ongoing Security

- [ ] Quarterly security review
- [ ] Dependency vulnerability scanning
- [ ] Penetration testing (annual)
- [ ] Security training for team
- [ ] Privacy policy updates
