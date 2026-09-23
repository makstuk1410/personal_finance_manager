# Technology Stack

This describes the code and configuration in the repository, not the planned full
product. See [Backend Status](backend-status.md) for available modules.

## Current stack

| Area | Implemented technology |
| --- | --- |
| Backend | C#, ASP.NET Core Web API, target framework net8.0 |
| ORM | Entity Framework Core 8.0.31 |
| Database provider | Npgsql.EntityFrameworkCore.PostgreSQL 8.0.11 |
| Authentication | JwtBearer 8.0.18, HS256 JWTs, PasswordHasher<User> from Identity.Core 8.0.18 |
| API exploration | Swashbuckle.AspNetCore 6.6.2, Swagger UI and OpenAPI JSON |
| Database | PostgreSQL; Compose image postgres:16 |
| Frontend | React 19, TypeScript 6, Vite 8, React Router 7 |
| Styling | Regular CSS files; Tailwind CSS is not configured |
| Lint | Oxlint |
| Containers | .NET 8 SDK/runtime backend; Node 22 frontend build and nginx:alpine serving |
| Category tests | Dependency-free Node.js integration script calling a running API |
| Design reference | Figma |

Exact backend package versions are in [backend.csproj](../backend/backend.csproj).
Frontend version ranges are in [package.json](../frontend/package.json), with
resolved versions in its lockfile.

## Backend structure

The backend is one project containing Controllers, DTOs, Models, Data, Services,
Validation, and Migrations folders. Authentication uses AuthService; account and
category controllers use AppDbContext directly. Separate application/domain/
infrastructure assemblies and the remaining financial modules are target designs.

Current routes cover authentication, financial accounts, categories, and database
connectivity. See [API Design](api-design.md) for payloads and status codes.
Swagger is enabled in every environment, at /swagger and /swagger/v1/swagger.json.

PostgreSQL currently stores users, financial accounts, and categories. Account
monetary fields use numeric(18,2); IDs use integer identity columns. Category
uniqueness is backed by indexes. Email uniqueness is not database-enforced.

## Authentication and configuration

JWTs contain user ID and email claims and have expiry set one hour after issuance.
The server validates issuer, audience, signing key, and lifetime. Logout removes
client-side state; there is no revocation or refresh-token endpoint.

ConnectionStrings:DefaultConnection and Jwt:Key/Issuer/Audience are read from
ASP.NET configuration. Environment overrides use double underscores, for example
ConnectionStrings__DefaultConnection and Jwt__Key. The repository currently
includes a signing key; production secret management remains outstanding.

Startup seeds a test user in every environment. It does not apply migrations and
therefore requires the Users table to exist before the API starts.

## Local development

With .NET 8 SDK, dotnet-ef, and a reachable PostgreSQL database, configure the
connection and JWT values, then run from the repository root:

```sh
dotnet ef database update --project backend
dotnet run --project backend --no-launch-profile --urls http://localhost:8080
```

The checked-in HTTP launch profile instead uses port 5001; the HTTPS profile uses
7009 plus 5001. Frontend API URLs are currently hardcoded to localhost:8080, and
backend CORS permits only http://localhost:3000. Run the frontend on that port
when testing cross-origin calls:

```sh
cd frontend
npm ci
npm run dev -- --port 3000
```

Current clean-install limitation: frontend source imports lucide-react, but it is
missing from the frontend manifest and lockfile (it appears only in the root
manifest). An existing node_modules directory can mask this. The dependency
configuration must be fixed for reproducible frontend/Docker builds.

## Docker Compose

| Service | Container port | Host port |
| --- | --- | --- |
| postgres | 5432 | 5433 |
| backend | 8080 | 8080 |
| frontend (nginx) | 80 | 3000 |

Compose supplies the backend with a connection string using host postgres and
stores database files in the postgres_data volume. The backend runtime is ASP.NET
8; nginx serves the frontend with SPA routing fallback and no API proxy.

A single fresh Compose startup is not self-initializing: depends_on does not check
database readiness, and there is no migration job or automatic migration call.
Start PostgreSQL, wait for it to accept connections, and apply migrations against
that database before starting the API. The frontend dependency limitation above
also affects the Docker build. HTTPS redirection is disabled in Program.cs.

## Verification

Backend compilation:

```sh
dotnet build backend/backend.csproj
```

Category integration tests against a running API using a disposable migrated database:

```sh
node backend/tests/categories.integration.mjs http://localhost:8080
```

The script tests authentication, defaults, validation, CRUD, user isolation, and
concurrent duplicate creation, and leaves its users/data in the test database.
There is no backend unit-test project or financial-calculation suite yet.
Frontend scripts provide build and lint checks; no frontend test script is defined.
