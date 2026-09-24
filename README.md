# personal_finance_manager

Start with the [documentation index](docs/requirments.md) and
[current backend status](docs/backend-status.md). Implemented endpoints are
documented in [API Design](docs/api-design.md); future modules are labeled planned.

## Google OAuth local setup

Create a Google OAuth web application and add this authorized redirect URI:

```text
http://localhost:8080/signin-google
```

Set the credentials before starting Docker Compose:

```powershell
$env:GOOGLE_CLIENT_ID = "your-client-id"
$env:GOOGLE_CLIENT_SECRET = "your-client-secret"
docker compose up -d --build
```

The frontend login page then uses `Continue with Google`. The backend stores
the Google subject ID in `ExternalLogins` and returns the same JWT format used
by password login. The callback uses a short-lived, single-use exchange code;
the JWT is not placed in the browser URL.
