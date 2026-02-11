---
title: Finance Flow
---

# Finance Flow

## Finance Capabilities

- Community transactions (income/expense)
- Event-linked expense entries
- Contribution requests
- Member settlements for contribution requests

## Access Model

- Finance module must be enabled at community level
- Transaction creation is permission-aware (`finance_add_transactions`)
- Update/delete rights are role/creator constrained by RLS

## Contribution Lifecycle

1. Admin creates request.
2. Settlements are generated and assigned.
3. Members update own settlement status.
4. Admin monitors completion and balances.

## Product Notes

Finance in MVP should remain operational and lightweight.
Treat it as community bookkeeping, not regulated accounting.
