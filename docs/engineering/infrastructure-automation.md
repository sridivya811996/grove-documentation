# Grove Infrastructure Automation Guide

> Automate Supabase infrastructure deployment using Infrastructure as Code (IaC)

## Overview

This guide covers automating the deployment of Grove's backend infrastructure on Supabase. While Supabase doesn't have an official Terraform provider, there are several approaches to automate your infrastructure.

## Options Comparison

| Approach | Maturity | Complexity | Best For |
|----------|----------|------------|----------|
| **Supabase CLI + Scripts** | High | Low | Most projects (Recommended) |
| **Terraform (Community)** | Medium | Medium | Multi-cloud setups |
| **Pulumi** | Medium | Medium | TypeScript teams |
| **GitHub Actions CI/CD** | High | Low | Continuous deployment |

**Recommendation**: Use **Supabase CLI + GitHub Actions** for Grove. It's the most mature and officially supported approach.

---

## Option 1: Supabase CLI (Recommended)

### Installation

```bash
# macOS
brew install supabase/tap/supabase

# Windows (PowerShell)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# npm (cross-platform)
npm install -g supabase
```

### Project Structure

```
grove-community/
├── supabase/
│   ├── config.toml              # Project configuration
│   ├── schema.sql               # Initial schema (already exists)
│   ├── migrations/              # Version-controlled migrations
│   │   ├── 20260208_initial.sql
│   │   └── 20260209_add_polls.sql
│   ├── functions/               # Edge Functions
│   │   └── send-notification/
│   │       └── index.ts
│   ├── seed.sql                 # Seed data for development
│   └── .env.local               # Local environment variables
├── scripts/
│   └── deploy-supabase.sh       # Deployment script
└── .github/
    └── workflows/
        └── deploy-supabase.yml  # CI/CD workflow
```

### Initialize Supabase Project

```bash
# Initialize (run once)
cd grove-community
supabase init

# Link to remote project
supabase link --project-ref <your-project-ref>

# Pull current state from remote
supabase db pull
```

### Configuration File

Create `supabase/config.toml`:

```toml
[project]
project_id = "your-project-ref"

[api]
enabled = true
schemas = ["public", "graphql_public"]
max_rows = 1000

[db]
major_version = 15

[db.pooler]
enabled = true
pool_mode = "transaction"
default_pool_size = 20

[auth]
enabled = true
site_url = "https://grove.app"
additional_redirect_urls = [
  "exp://localhost:19000",
  "grove://auth/callback",
  "https://grove.app/auth/callback"
]
jwt_expiry = 3600

[auth.email]
enable_signup = true
enable_confirmations = true

[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"

[auth.external.apple]
enabled = true
client_id = "env(APPLE_CLIENT_ID)"
secret = "env(APPLE_CLIENT_SECRET)"

[storage]
enabled = true
file_size_limit = "50MiB"

[realtime]
enabled = true
```

### Migration Workflow

```bash
# Create a new migration
supabase migration new add_new_feature

# Apply migrations locally
supabase db reset

# Push migrations to production
supabase db push

# Generate TypeScript types
supabase gen types typescript --project-id <ref> > types/supabase.ts
```

---

## Option 2: GitHub Actions CI/CD

Create `.github/workflows/deploy-supabase.yml`:

```yaml
name: Deploy Supabase

on:
  push:
    branches: [main]
    paths:
      - 'supabase/**'
  workflow_dispatch:

env:
  SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
  SUPABASE_PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}
  SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Link Supabase Project
        run: |
          supabase link --project-ref $SUPABASE_PROJECT_REF

      - name: Run Migrations
        run: |
          supabase db push

      - name: Deploy Edge Functions
        run: |
          supabase functions deploy --project-ref $SUPABASE_PROJECT_REF

      - name: Generate Types
        run: |
          supabase gen types typescript --project-id $SUPABASE_PROJECT_REF > types/supabase.ts

      - name: Commit Updated Types
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: update supabase types"
          file_pattern: types/supabase.ts

  notify:
    needs: deploy
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Notify on Failure
        if: needs.deploy.result == 'failure'
        run: |
          echo "Deployment failed! Check the logs."
          # Add Slack/Discord notification here
```

### Required Secrets

Set these in GitHub Repository Settings > Secrets:

| Secret | Description | How to Get |
|--------|-------------|------------|
| `SUPABASE_ACCESS_TOKEN` | CLI access token | supabase.com/dashboard > Access Tokens |
| `SUPABASE_PROJECT_REF` | Project reference ID | From project URL: `xxxxx.supabase.co` |
| `SUPABASE_DB_PASSWORD` | Database password | Project Settings > Database |

---

## Option 3: Terraform (Community Provider)

There's a community Terraform provider for Supabase. Note: Not officially supported.

### Install Provider

Create `terraform/main.tf`:

```hcl
terraform {
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

provider "supabase" {
  access_token = var.supabase_access_token
}

variable "supabase_access_token" {
  type      = string
  sensitive = true
}

variable "organization_id" {
  type = string
}
```

### Define Resources

```hcl
# Create a new Supabase project
resource "supabase_project" "grove" {
  organization_id   = var.organization_id
  name              = "grove-production"
  database_password = var.db_password
  region            = "ap-south-1"  # Mumbai

  lifecycle {
    prevent_destroy = true
  }
}

# Configure auth settings
resource "supabase_settings" "grove_auth" {
  project_ref = supabase_project.grove.id

  auth = jsonencode({
    site_url = "https://grove.app"
    external = {
      google = {
        enabled   = true
        client_id = var.google_client_id
        secret    = var.google_client_secret
      }
      apple = {
        enabled   = true
        client_id = var.apple_client_id
        secret    = var.apple_client_secret
      }
    }
  })
}

# Create storage buckets
resource "supabase_storage_bucket" "avatars" {
  project_ref = supabase_project.grove.id
  name        = "avatars"
  public      = true
  file_size_limit = 5242880  # 5MB
  allowed_mime_types = ["image/jpeg", "image/png", "image/webp"]
}

resource "supabase_storage_bucket" "community_images" {
  project_ref = supabase_project.grove.id
  name        = "community-images"
  public      = true
  file_size_limit = 10485760  # 10MB
}

resource "supabase_storage_bucket" "receipts" {
  project_ref = supabase_project.grove.id
  name        = "receipts"
  public      = false
  file_size_limit = 10485760
}

# Output project details
output "project_url" {
  value = "https://${supabase_project.grove.id}.supabase.co"
}

output "anon_key" {
  value     = supabase_project.grove.anon_key
  sensitive = true
}
```

### Terraform Variables

Create `terraform/terraform.tfvars`:

```hcl
supabase_access_token = "sbp_xxxxx"
organization_id       = "org_xxxxx"
db_password          = "your-secure-password"
google_client_id     = "xxxxx.apps.googleusercontent.com"
google_client_secret = "GOCSPX-xxxxx"
apple_client_id      = "com.grove.app"
apple_client_secret  = "xxxxx"
```

### Run Terraform

```bash
cd terraform

# Initialize
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy (careful!)
terraform destroy
```

---

## Option 4: Deployment Script

Create `scripts/deploy-supabase.sh`:

```bash
#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Supabase deployment...${NC}"

# Check if required environment variables are set
if [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo -e "${RED}Error: SUPABASE_PROJECT_REF not set${NC}"
    exit 1
fi

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo -e "${RED}Error: SUPABASE_ACCESS_TOKEN not set${NC}"
    exit 1
fi

# Link project (if not already linked)
echo -e "${YELLOW}Linking to Supabase project...${NC}"
supabase link --project-ref "$SUPABASE_PROJECT_REF" || true

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
supabase db push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Migrations applied successfully${NC}"
else
    echo -e "${RED}Migration failed${NC}"
    exit 1
fi

# Deploy Edge Functions (if any exist)
if [ -d "supabase/functions" ] && [ "$(ls -A supabase/functions)" ]; then
    echo -e "${YELLOW}Deploying Edge Functions...${NC}"
    supabase functions deploy --project-ref "$SUPABASE_PROJECT_REF"
fi

# Generate TypeScript types
echo -e "${YELLOW}Generating TypeScript types...${NC}"
supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" > types/supabase.ts

# Create storage buckets (idempotent)
echo -e "${YELLOW}Ensuring storage buckets exist...${NC}"
node scripts/setup-storage.js

echo -e "${GREEN}Deployment complete!${NC}"
```

Create `scripts/setup-storage.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const buckets = [
  { name: 'avatars', public: true },
  { name: 'community-images', public: true },
  { name: 'event-images', public: true },
  { name: 'chat-media', public: false },
  { name: 'receipts', public: false },
];

async function setupStorage() {
  for (const bucket of buckets) {
    const { data, error } = await supabase.storage.createBucket(bucket.name, {
      public: bucket.public,
      fileSizeLimit: 10485760, // 10MB
    });

    if (error && !error.message.includes('already exists')) {
      console.error(`Error creating bucket ${bucket.name}:`, error.message);
    } else {
      console.log(`Bucket ${bucket.name}: OK`);
    }
  }
}

setupStorage();
```

---

## Environment Management

### Multi-Environment Setup

```
grove-community/
├── supabase/
│   ├── config.toml           # Shared config
│   ├── .env.local            # Local development
│   ├── .env.staging          # Staging environment
│   └── .env.production       # Production environment
```

### Environment Variables

Create `.env.production`:

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Auth Providers
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
APPLE_CLIENT_ID=com.grove.app
APPLE_CLIENT_SECRET=xxxxx

# External Services
RESEND_API_KEY=re_xxxxx
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## Best Practices

### 1. Version Control Migrations

```bash
# Always create migrations for schema changes
supabase migration new descriptive_name

# Never edit existing migrations after they're pushed
# Create new migrations to fix issues
```

### 2. Use Branches for Development

```bash
# Create a development branch
supabase branches create feature-polls

# Switch to branch
supabase branches switch feature-polls

# Merge when ready
supabase branches merge feature-polls
```

### 3. Backup Strategy

```bash
# Manual backup
supabase db dump -f backup.sql

# Restore from backup
supabase db restore backup.sql
```

### 4. Secrets Management

```bash
# Store secrets in environment or use a secrets manager
# Never commit secrets to git

# Use GitHub Secrets for CI/CD
# Use EAS Secrets for Expo builds
eas secret:create --name SUPABASE_URL --value "https://xxx.supabase.co"
```

---

## Quick Start Commands

```bash
# First-time setup
supabase init
supabase link --project-ref <your-project-ref>

# Daily development
supabase start                    # Start local Supabase
supabase db reset                 # Reset with migrations + seed
supabase gen types typescript     # Generate types

# Deployment
supabase db push                  # Push migrations to remote
supabase functions deploy         # Deploy edge functions

# Debugging
supabase db lint                  # Check for issues
supabase inspect db               # Analyze database
```

---

## Monitoring & Alerts

### Set Up Alerts in Supabase Dashboard

1. Go to Project Settings > Alerts
2. Configure alerts for:
   - Database connection limit (80%)
   - Storage usage (80%)
   - API error rate spike
   - Auth failures

### External Monitoring

```javascript
// Add to your app for real-time monitoring
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enableInExpoDevelopment: false,
  tracesSampleRate: 0.2,
});
```

---

## Summary

For Grove, the recommended setup is:

1. **Use Supabase CLI** for migrations and local development
2. **Use GitHub Actions** for CI/CD deployment
3. **Store migrations** in version control
4. **Generate TypeScript types** automatically
5. **Use environment-specific configs** for staging/production

This gives you:
- Version-controlled database schema
- Reproducible deployments
- Automated CI/CD pipeline
- Type-safe database access
- Easy rollback capability
