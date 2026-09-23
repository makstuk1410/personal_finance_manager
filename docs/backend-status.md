# Backend Implementation Status

Checked against controllers, DTOs, services, models, configuration, and EF Core
migrations on 2026-09-23. Requirements describe the intended product; they do not
mean every feature is implemented.

## Available now

| Area | Current behavior |
| --- | --- |
| Authentication | Register, login, and authenticated `/api/auth/me`; password hashing and one-hour JWT expiry |
| Accounts | Authenticated create/list/detail/update/delete, scoped to the caller |
| Categories | Authenticated create/list/detail/rename/delete; nine immutable shared defaults and private custom categories |
| Database health | Public `/api/health/database` connectivity check |
| Persistence | `Users`, `FinancialAccounts`, `Categories`, plus EF migration history; integer IDs |
| API exploration | Swagger UI and OpenAPI JSON enabled in every environment |
| Automated verification | Category integration script covering authorization, defaults, CRUD, validation, duplicate names, and concurrency |

See [API Design](api-design.md) for actual payloads/status codes and
[Database Design](database.md) for the migrated schema.

## Planned or incomplete

* Transactions, budgets, savings goals, dashboard aggregates, statistics, and
  simulations have no backend endpoints or persisted models yet.
* Category assignment to transactions/budgets awaits those modules.
* Logout is client-side token removal, with no backend revocation or refresh flow.
* Registration has no explicit email-format/password-strength validation, email
  normalization, or database uniqueness constraint on email.
* Account type membership is not explicitly validated, and omitted value-type
  fields default to `Cash`/zero. Account deletion has no transaction-reference guard.
* Account updates can change currency without conversion. Balances currently
  start at the initial balance and are not updated by transaction processing.
* No list pagination, shared error envelope, separate application/domain projects,
  or financial-calculation test suite exists yet.
* The database-health failure response exposes exception details. JWT configuration
  includes a tracked signing key, test-user seeding is unconditional, and HTTPS
  redirection is disabled. These are current limitations, not fulfilled security goals.

## Setup and verification

Configure `ConnectionStrings__DefaultConnection` for the intended PostgreSQL database
and `Jwt__Key`, `Jwt__Issuer`, and `Jwt__Audience` for token configuration. Environment
variables override the corresponding application settings.

Run from the repository root, with PostgreSQL already accepting connections:

```sh
dotnet ef database update --project backend
dotnet run --project backend --no-launch-profile --urls http://localhost:8080
```

The API does not apply migrations automatically. Startup queries the users table
and creates the configured-in-code test user if absent, in every environment.
Category defaults are inserted by the `AddCategories` migration, not startup code.
Compose orders containers but has no database readiness check or migration job.

For automated category checks, start the API against a **disposable migrated database**:

```sh
node backend/tests/categories.integration.mjs http://localhost:8080
```

The script creates users and data and leaves them in that database. It requires
Node 18+ and no npm packages. It is not an end-to-end test of the frontend or a
verification of the planned modules.
