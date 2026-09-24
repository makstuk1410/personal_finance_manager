# Personal Finance Manager

A full-stack personal finance application for tracking accounts, transactions,
and spending in one place, with planned budgeting, savings goals, analytics,
and financial What-If simulations.

[Live Demo](https://personal-finance-manager-production-ab12.up.railway.app/)

> **Status:** Active development. Authentication, accounts, categories, and
> transactions are implemented. Budgets, savings goals, financial analytics,
> and What-If simulations are planned next.

---

## Demo

![Personal Finance Manager Demo](docs/images/fin_manager.gif)

---

## 1. Problem

Managing personal finances often means spreading information across banking apps,
notes, spreadsheets, and budgeting tools.

Personal Finance Manager brings accounts, income, expenses, transfers, and spending
categories into one application while keeping account balances consistent
automatically.

The long-term goal is not only to record financial data, but also to help users
understand it. Planned features include budgets, savings goals, financial
statistics, and a **What-If Simulator** for testing hypothetical financial
decisions without changing real data.

For example, a user will be able to simulate how increasing rent or reducing
monthly food spending would affect savings, budgets, and financial goals.

---

## 2. Architecture

```text
┌─────────────────────────────┐
│     React + TypeScript      │
│          Frontend           │
└──────────────┬──────────────┘
               │
               │ REST / JSON
               ▼
┌─────────────────────────────┐
│    ASP.NET Core Web API     │
│                             │
│ Auth │ Accounts │ Categories│
│      │ Transactions         │
└──────────────┬──────────────┘
               │
               │ Entity Framework Core
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
└─────────────────────────────┘
```

### Technology

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, React Router, CSS |
| Backend | C#, ASP.NET Core 8 Web API |
| Database | PostgreSQL, Entity Framework Core |
| Authentication | JWT, password hashing, Google OAuth |
| API documentation | Swagger / OpenAPI |
| Infrastructure | Docker Compose, nginx |
| Deployment | Railway |

### Implemented

- Email/password registration and login
- Google OAuth
- JWT-protected frontend and API routes
- Financial account CRUD
- Income, expense, and transfer transactions
- Automatic account balance updates
- Default and custom transaction categories
- Transaction filtering and sorting through the API
- Swagger/OpenAPI documentation
- PostgreSQL persistence with EF Core migrations

### Core financial rules

Transactions update account balances atomically.

- **Income** adds money to a destination account.
- **Expense** subtracts money from a source account.
- **Transfer** moves money between two accounts.
- Editing a transaction first reverses its previous balance effect.
- Deleting a transaction reverses its balance effect.
- Transfers require different accounts using the same currency.
- Users can access only their own accounts and custom categories.
- Accounts and categories referenced by transactions cannot be deleted.
- An account's currency cannot be changed after it has transactions.

---

## 3. Run Locally

The easiest way to run the entire application locally is with Docker.

### Requirements

- Docker
- Docker Compose

### Step 1 — Clone the repository

```bash
git clone https://github.com/makstuk1410/personal_finance_manager.git
cd personal_finance_manager
```

### Step 2 — Start the application

```bash
docker compose up --build
```

That's it.

The application will be available at:

- **Frontend:** http://localhost:3000
- **API:** http://localhost:8080
- **Swagger:** http://localhost:8080/swagger

The backend automatically applies EF Core migrations when it starts.

A development account is automatically created:

```text
Email:    test@example.com
Password: Test123!
```

You can also register a new account directly in the application.

> Google OAuth is optional. Email/password authentication works without
> configuring Google credentials.

To stop the application:

```bash
docker compose down
```

---

## 4. Key Engineering Decisions

### Atomic transaction balance updates

Creating a financial transaction affects both transaction history and account
balances. These changes must stay consistent.

Transaction creation, editing, and deletion therefore update all affected data
inside a single database transaction. If an operation fails, the entire change
is rolled back.

Editing is handled by first reversing the old transaction's effect and then
applying the new one.

### PostgreSQL

PostgreSQL was chosen because the application's data is strongly relational:
users own accounts, transactions reference accounts and categories, and future
budgets and savings goals will depend on the same financial data.

Relational constraints also help protect financial data integrity.

### ASP.NET Core + Entity Framework Core

ASP.NET Core provides the REST API, authentication/authorization pipeline, and
dependency injection used by the backend.

Entity Framework Core handles persistence and migrations while still allowing
financial rules and balance calculations to remain in application logic rather
than controllers.

### JWT authentication

The frontend and backend are separate applications, so JWT bearer authentication
provides a simple stateless authentication mechanism for protected API requests.

Google OAuth uses a short-lived exchange code instead of putting the JWT directly
in the browser redirect URL.

### Docker Compose

The frontend, backend, and PostgreSQL database can be started together with one
command, keeping the local environment reproducible and reducing setup work for
someone running the repository for the first time.

### nginx

The production frontend build is served through nginx. It provides a lightweight
HTTP server for the compiled React application and supports SPA routing.

---

## 5. What I Learned

Building Personal Finance Manager has gone beyond implementing CRUD endpoints.

One of the main challenges was maintaining consistency between transactions and
account balances. Implementing transaction editing required treating a financial
operation as a reversible state change: undo the previous effect and then apply
the new one atomically.

The project also gave me practical experience with authentication across a
separate React frontend and ASP.NET Core API, including JWT authorization and
Google OAuth, as well as database migrations, relational constraints, Docker
networking, environment-specific configuration, and deploying a full-stack
application.

As the project grows, the next challenge is moving from storing financial data
to analyzing it through budgets, savings goals, statistics, and the planned
What-If Simulator.

---

## Documentation

More detailed technical documentation is available in the repository:

- [Functional requirements](docs/functional-requirements.md)
- [API design](docs/api-design.md)
- [Database design](docs/database.md)
- [Architecture](docs/architecture.md)
- [Figma design](https://www.figma.com/design/u6sTPM2bcvMINg1Jx2JlYY/Personal-Finance-Manager?node-id=1-2)