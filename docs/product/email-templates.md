# Grove Email Templates for Supabase

Copy these templates into your Supabase Dashboard under **Authentication -> Email Templates**.

## Brand Guidelines

| Element | Value |
|---------|-------|
| Primary Color | `#2D6A4F` (Grove Green) |
| Secondary Color | `#059669` (Emerald) |
| Background | `#F9FAFB` (Light Gray) |
| Text Color | `#111827` (Dark Gray) |
| Font | System fonts (San Francisco, Segoe UI, Roboto) |

## Logo Options

**Option A: Hosted Image (Recommended)**
Upload your icon to a CDN (e.g., Supabase Storage, Cloudinary, or your website) and use:
```html
<img src="https://docs.grove-community.com/img/grove-app-icon.png" alt="Grove" width="56" height="56" style="border-radius: 12px;">
```

**Option B: Text-based Logo (Used in templates below)**
A styled "G" that works in all email clients - no external dependencies.

---

## Dynamic Placeholder Notes (Supabase)

Supabase only renders variables that it knows about. It does not automatically look up
community data (name, description, invite code) unless you pass it in the request.

Available built-in variables include:
- `{{ .ConfirmationURL }}`
- `{{ .Email }}`
- `{{ .SiteURL }}`
- `{{ .Token }}`
- `{{ .TokenHash }}`
- `{{ .Data }}` (custom data you pass in `options.data`)

For community invites like `{{ .Data.community_name }}` or `{{ .Data.invite_code }}`,
you must pass those values when sending the invite email (for example, via
`supabase.auth.admin.inviteUserByEmail(email, { data: { community_name, invite_code } })`).
If you are not using Supabase Auth invites, you will need your own mailer (Edge Function,
transactional email provider) to inject those values.

---

## 1. Confirm Signup (Email Verification)

**Subject:** `Verify your Grove account`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify your Grove account</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .logo { text-align: center; margin-bottom: 32px; }
        .logo-text { font-size: 24px; font-weight: 700; color: #2D6A4F; margin-top: 12px; }
    h1 { color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; text-align: center; }
    p { color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 24px 0; }
    .button { display: inline-block; background: #2D6A4F; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; }
    .button:hover { background: #245a42; }
    .button-container { text-align: center; margin: 32px 0; }
    .divider { height: 1px; background: #e5e7eb; margin: 32px 0; }
    .footer { text-align: center; color: #9ca3af; font-size: 14px; line-height: 20px; }
    .footer a { color: #2D6A4F; text-decoration: none; }
    .security-note { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .security-note p { color: #166534; font-size: 14px; margin: 0; }
    .link-fallback { color: #6b7280; font-size: 14px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <!-- Option A: Use hosted image -->
        <!-- <img src="https://docs.grove-community.com/img/grove-app-icon.png" alt="Grove" width="56" height="56" style="border-radius: 12px;"> -->
        <!-- Option B: Text-based logo (works everywhere) -->
        <div style="width: 56px; height: 56px; background: #2D6A4F; border-radius: 12px; display: inline-block; text-align: center; line-height: 56px;">
          <span style="color: #ffffff; font-size: 28px; font-weight: 700; font-family: Georgia, serif;">G</span>
        </div>
        <div class="logo-text">Grove</div>
      </div>

      <h1>Verify your email address</h1>

      <p>Welcome to Grove! Click the button below to verify your email address and activate your account.</p>

      <div class="button-container">
        <a href="{{ .ConfirmationURL }}" class="button">Verify Email Address</a>
      </div>

      <div class="security-note">
        <p> This link will expire in 24 hours. After clicking, you'll be signed in automatically.</p>
      </div>

      <div class="divider"></div>

      <p style="font-size: 14px; color: #6b7280;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p class="link-fallback">{{ .ConfirmationURL }}</p>

      <div class="divider"></div>

      <div class="footer">
        <p>If you didn't create a Grove account, you can safely ignore this email.</p>
        <p style="margin-top: 16px;">
          <a href="https://grove-community.com">Grove</a>  Building stronger communities together
        </p>
        <p style="margin-top: 8px; color: #d1d5db;">
           2026 Grove. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 2. Reset Password

**Subject:** `Reset your Grove password`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Reset your Grove password</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .logo { text-align: center; margin-bottom: 32px; }
        .logo-text { font-size: 24px; font-weight: 700; color: #2D6A4F; margin-top: 12px; }
    h1 { color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; text-align: center; }
    p { color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 24px 0; }
    .button { display: inline-block; background: #2D6A4F; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; }
    .button:hover { background: #245a42; }
    .button-container { text-align: center; margin: 32px 0; }
    .divider { height: 1px; background: #e5e7eb; margin: 32px 0; }
    .footer { text-align: center; color: #9ca3af; font-size: 14px; line-height: 20px; }
    .footer a { color: #2D6A4F; text-decoration: none; }
    .warning-note { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .warning-note p { color: #92400e; font-size: 14px; margin: 0; }
    .security-note { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .security-note p { color: #166534; font-size: 14px; margin: 0; }
    .link-fallback { color: #6b7280; font-size: 14px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <!-- Option A: Use hosted image -->
        <!-- <img src="https://docs.grove-community.com/img/grove-app-icon.png" alt="Grove" width="56" height="56" style="border-radius: 12px;"> -->
        <!-- Option B: Text-based logo (works everywhere) -->
        <div style="width: 56px; height: 56px; background: #2D6A4F; border-radius: 12px; display: inline-block; text-align: center; line-height: 56px;">
          <span style="color: #ffffff; font-size: 28px; font-weight: 700; font-family: Georgia, serif;">G</span>
        </div>
        <div class="logo-text">Grove</div>
      </div>

      <h1>Reset your password</h1>

      <p>We received a request to reset the password for your Grove account. Click the button below to choose a new password.</p>

      <div class="button-container">
        <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
      </div>

      <div class="security-note">
        <p> This link will expire in 1 hour for security reasons.</p>
      </div>

      <div class="warning-note">
        <p> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
      </div>

      <div class="divider"></div>

      <p style="font-size: 14px; color: #6b7280;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p class="link-fallback">{{ .ConfirmationURL }}</p>

      <div class="divider"></div>

      <div class="footer">
        <p>Need help- Contact us at <a href="mailto:support@grove-community.com">support@grove-community.com</a></p>
        <p style="margin-top: 16px;">
          <a href="https://grove-community.com">Grove</a>  Building stronger communities together
        </p>
        <p style="margin-top: 8px; color: #d1d5db;">
           2026 Grove. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 3. Magic Link (Passwordless Login)

**Subject:** `Sign in to Grove`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Sign in to Grove</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .logo { text-align: center; margin-bottom: 32px; }
        .logo-text { font-size: 24px; font-weight: 700; color: #2D6A4F; margin-top: 12px; }
    h1 { color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; text-align: center; }
    p { color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 24px 0; }
    .button { display: inline-block; background: #2D6A4F; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; }
    .button:hover { background: #245a42; }
    .button-container { text-align: center; margin: 32px 0; }
    .divider { height: 1px; background: #e5e7eb; margin: 32px 0; }
    .footer { text-align: center; color: #9ca3af; font-size: 14px; line-height: 20px; }
    .footer a { color: #2D6A4F; text-decoration: none; }
    .security-note { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .security-note p { color: #166534; font-size: 14px; margin: 0; }
    .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .info-box p { color: #1e40af; font-size: 14px; margin: 0; }
    .link-fallback { color: #6b7280; font-size: 14px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <!-- Option A: Use hosted image -->
        <!-- <img src="https://docs.grove-community.com/img/grove-app-icon.png" alt="Grove" width="56" height="56" style="border-radius: 12px;"> -->
        <!-- Option B: Text-based logo (works everywhere) -->
        <div style="width: 56px; height: 56px; background: #2D6A4F; border-radius: 12px; display: inline-block; text-align: center; line-height: 56px;">
          <span style="color: #ffffff; font-size: 28px; font-weight: 700; font-family: Georgia, serif;">G</span>
        </div>
        <div class="logo-text">Grove</div>
      </div>

      <h1>Sign in to Grove</h1>

      <p style="text-align: center;">Click the button below to securely sign in to your Grove account. No password needed!</p>

      <div class="button-container">
        <a href="{{ .ConfirmationURL }}" class="button">Sign In to Grove</a>
      </div>

      <div class="info-box">
        <p> This is a magic link  one click and you're in! It works like a password, just more convenient.</p>
      </div>

      <div class="security-note">
        <p> This link expires in 1 hour and can only be used once.</p>
      </div>

      <div class="divider"></div>

      <p style="font-size: 14px; color: #6b7280;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p class="link-fallback">{{ .ConfirmationURL }}</p>

      <div class="divider"></div>

      <div class="footer">
        <p>If you didn't request this email, you can safely ignore it.</p>
        <p style="margin-top: 16px;">
          <a href="https://grove-community.com">Grove</a>  Building stronger communities together
        </p>
        <p style="margin-top: 8px; color: #d1d5db;">
           2026 Grove. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 4. Invite User (Bonus)

**Subject:** `You're invited to join {{ .Data.community_name }} on Grove`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>You're invited to Grove</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .logo { text-align: center; margin-bottom: 32px; }
        .logo-text { font-size: 24px; font-weight: 700; color: #2D6A4F; margin-top: 12px; }
    h1 { color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; text-align: center; }
    p { color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 24px 0; }
    .button { display: inline-block; background: #2D6A4F; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; }
    .button:hover { background: #245a42; }
    .button-container { text-align: center; margin: 32px 0; }
    .divider { height: 1px; background: #e5e7eb; margin: 32px 0; }
    .footer { text-align: center; color: #9ca3af; font-size: 14px; line-height: 20px; }
    .footer a { color: #2D6A4F; text-decoration: none; }
    .community-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
    .community-name { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 8px; }
    .community-desc { font-size: 14px; color: #6b7280; margin: 0; }
    .invite-code { background: #2D6A4F; color: white; font-size: 24px; font-weight: 700; letter-spacing: 4px; padding: 16px 32px; border-radius: 8px; display: inline-block; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <!-- Option A: Use hosted image -->
        <!-- <img src="https://docs.grove-community.com/img/grove-app-icon.png" alt="Grove" width="56" height="56" style="border-radius: 12px;"> -->
        <!-- Option B: Text-based logo (works everywhere) -->
        <div style="width: 56px; height: 56px; background: #2D6A4F; border-radius: 12px; display: inline-block; text-align: center; line-height: 56px;">
          <span style="color: #ffffff; font-size: 28px; font-weight: 700; font-family: Georgia, serif;">G</span>
        </div>
        <div class="logo-text">Grove</div>
      </div>

      <h1>You're invited! </h1>

      <p style="text-align: center;">You've been invited to join a community on Grove  the app for managing local communities.</p>

      <div class="community-card">
        <div class="community-name">{{ .Data.community_name }}</div>
        <p class="community-desc">{{ .Data.community_description }}</p>
        <div class="invite-code">{{ .Data.invite_code }}</div>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 12px;">Your invite code</p>
      </div>

      <div class="button-container">
        <a href="https://grove-community.com/join-code={{ .Data.invite_code }}" class="button">Join Community</a>
      </div>

      <div class="divider"></div>

      <p style="font-size: 14px; color: #6b7280; text-align: center;">
        <strong>How to join:</strong><br>
        1. Download Grove from the App Store or Google Play<br>
        2. Create an account or sign in<br>
        3. Enter the invite code above or click the button
      </p>

      <div class="divider"></div>

      <div class="footer">
        <p>This invite was sent by a Grove community admin.</p>
        <p style="margin-top: 16px;">
          <a href="https://grove-community.com">Grove</a>  Building stronger communities together
        </p>
        <p style="margin-top: 8px; color: #d1d5db;">
           2026 Grove. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 5. Email Change Confirmation

**Subject:** `Confirm your new email address for Grove`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Confirm your new email</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .logo { text-align: center; margin-bottom: 32px; }
        .logo-text { font-size: 24px; font-weight: 700; color: #2D6A4F; margin-top: 12px; }
    h1 { color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; text-align: center; }
    p { color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 24px 0; }
    .button { display: inline-block; background: #2D6A4F; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; }
    .button:hover { background: #245a42; }
    .button-container { text-align: center; margin: 32px 0; }
    .divider { height: 1px; background: #e5e7eb; margin: 32px 0; }
    .footer { text-align: center; color: #9ca3af; font-size: 14px; line-height: 20px; }
    .footer a { color: #2D6A4F; text-decoration: none; }
    .email-change-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center; }
    .old-email { color: #9ca3af; font-size: 14px; text-decoration: line-through; }
    .arrow { color: #2D6A4F; font-size: 20px; margin: 8px 0; }
    .new-email { color: #166534; font-size: 16px; font-weight: 600; }
    .warning-note { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 24px 0; }
    .warning-note p { color: #92400e; font-size: 14px; margin: 0; }
    .link-fallback { color: #6b7280; font-size: 14px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <!-- Option A: Use hosted image -->
        <!-- <img src="https://docs.grove-community.com/img/grove-app-icon.png" alt="Grove" width="56" height="56" style="border-radius: 12px;"> -->
        <!-- Option B: Text-based logo (works everywhere) -->
        <div style="width: 56px; height: 56px; background: #2D6A4F; border-radius: 12px; display: inline-block; text-align: center; line-height: 56px;">
          <span style="color: #ffffff; font-size: 28px; font-weight: 700; font-family: Georgia, serif;">G</span>
        </div>
        <div class="logo-text">Grove</div>
      </div>

      <h1>Confirm your new email</h1>

      <p style="text-align: center;">You requested to change your Grove account email address. Please confirm this change by clicking the button below.</p>

      <div class="email-change-box">
        <div class="old-email">{{ .Data.old_email }}</div>
        <div class="arrow"></div>
        <div class="new-email">{{ .Email }}</div>
      </div>

      <div class="button-container">
        <a href="{{ .ConfirmationURL }}" class="button">Confirm New Email</a>
      </div>

      <div class="warning-note">
        <p> If you didn't request this change, please secure your account immediately by resetting your password.</p>
      </div>

      <div class="divider"></div>

      <p style="font-size: 14px; color: #6b7280;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p class="link-fallback">{{ .ConfirmationURL }}</p>

      <div class="divider"></div>

      <div class="footer">
        <p>Need help- Contact us at <a href="mailto:support@grove-community.com">support@grove-community.com</a></p>
        <p style="margin-top: 16px;">
          <a href="https://grove-community.com">Grove</a>  Building stronger communities together
        </p>
        <p style="margin-top: 8px; color: #d1d5db;">
           2026 Grove. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## How to Apply Templates in Supabase

1. Go to **Supabase Dashboard**  **Authentication**  **Email Templates**

2. For each template type:
   - **Confirm signup**: Paste Template #1
   - **Reset password**: Paste Template #2
   - **Magic link**: Paste Template #3
   - **Invite user**: Paste Template #4 (if using Supabase invites)
   - **Change email address**: Paste Template #5

3. Update the **Subject** line for each template

4. Click **Save**

5. **Test** by triggering each email type and checking:
   - Renders correctly on Gmail, Outlook, Apple Mail
   - Renders correctly on mobile devices
   - All links work correctly
   - Button clicks open the app

---

## Email Template Best Practices

### Do's
-  Keep subject lines under 50 characters
-  Use a clear, prominent call-to-action button
-  Include fallback plain text link
-  Add security notices for sensitive actions
-  Use mobile-responsive design (max-width 600px)
-  Include company footer with unsubscribe/contact info
-  Test on major email clients (Gmail, Outlook, Apple Mail)

### Don'ts
-  Don't use images for critical content (may be blocked)
-  Don't use JavaScript (not supported in emails)
-  Don't use web fonts (fallback to system fonts)
-  Don't use `position: absolute/fixed`
-  Don't include sensitive data in the email body
-  Don't use CSS Grid or Flexbox extensively (poor support)

---

## Plain Text Fallbacks

For email clients that don't support HTML, Supabase auto-generates plain text. However, you can customize it:

**Confirm Signup:**
```
Welcome to Grove!

Verify your email address by clicking this link:
{{ .ConfirmationURL }}

This link expires in 24 hours.

If you didn't create a Grove account, you can ignore this email.


Grove  Building stronger communities together
https://grove-community.com
```

**Reset Password:**
```
Reset your Grove password

Click this link to reset your password:
{{ .ConfirmationURL }}

This link expires in 1 hour.

If you didn't request this, ignore this email.


Grove  Building stronger communities together
https://grove-community.com
```

**Magic Link:**
```
Sign in to Grove

Click this link to sign in:
{{ .ConfirmationURL }}

This link expires in 1 hour and can only be used once.


Grove  Building stronger communities together
https://grove-community.com
```

