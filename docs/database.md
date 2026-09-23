# Database Design

This document distinguishes the migrated PostgreSQL schema from planned financial
modules. The source of truth is [AppDbContext](../backend/Data/AppDbContext.cs) and
[EF Core migrations](../backend/Migrations). See [Backend Status](backend-status.md).

## 1. Implemented schema

The application currently has three tables: `Users`, `FinancialAccounts`, and
`Categories`. EF also maintains `__EFMigrationsHistory`. Table/column names use
PascalCase and require quoting in PostgreSQL SQL. All primary keys are integer
identity columns, not UUIDs. User/account timestamps are UTC values stored as
`timestamp with time zone`.

### Users

| Column | PostgreSQL type | Constraints |
| --- | --- | --- |
| `Id` | integer | Primary key, identity by default |
| `Email` | text | NOT NULL; no unique index |
| `PasswordHash` | text | NOT NULL |
| `CreatedAt` | timestamp with time zone | NOT NULL |

Passwords are hashed by `PasswordHasher<User>`. Duplicate email checking is an
application query using exact equality; there is no database uniqueness guarantee,
case normalization, or trimming. The table has no length/email-format constraints.

### FinancialAccounts

| Column | PostgreSQL type | Constraints |
| --- | --- | --- |
| `Id` | integer | Primary key, identity by default |
| `UserId` | integer | NOT NULL, FK to Users.Id, ON DELETE CASCADE |
| `Name` | text | NOT NULL |
| `Type` | text | NOT NULL; enum stored as string |
| `InitialBalance` | numeric(18,2) | NOT NULL |
| `Balance` | numeric(18,2) | NOT NULL |
| `Currency` | text | NOT NULL |
| `CreatedAt` | timestamp with time zone | NOT NULL |

`IX_FinancialAccounts_UserId` is a non-unique index. Supported named enum values
are `Cash`, `BankAccount`, `CreditCard`, and `SavingsAccount`; there is no database
check constraint restricting the text column. API validation limits account names
to 100 characters and currencies to PLN, EUR, USD, GBP, CHF, UAH (case-insensitive).
These are request rules, not database length/check constraints.

Creation sets both balances to the supplied initial balance (zero if omitted).
Negative values are allowed. Updates change only name, type, and currency, without
currency conversion. There are no transaction tables or balance recalculation
operations yet. Account deletion hard-deletes the row after checking ownership.

### Categories

| Column | PostgreSQL type | Constraints |
| --- | --- | --- |
| `Id` | integer | Primary key, identity by default |
| `UserId` | integer | Nullable FK to Users.Id, ON DELETE CASCADE |
| `Name` | character varying(100) | NOT NULL |
| `NormalizedName` | character varying(100) | NOT NULL |
| `IsDefault` | boolean | NOT NULL |

The API trims `Name` and stores its invariant-uppercase form in `NormalizedName`.
This is an application-maintained column, not a generated database column.

* `IX_Categories_UserId_NormalizedName` is unique, enforcing per-user custom-name
  uniqueness, including concurrent writes.
* `IX_Categories_NormalizedName` is unique with filter `"IsDefault"`, enforcing
  distinct normalized names among defaults.
* `CK_Categories_Owner` requires default rows to have a null owner and custom rows
  to have a non-null owner.
* Different users can reuse names. A custom category can share a default's name.
* Default immutability and caller ownership are enforced by the API, not database
  row-level permissions. API invalid-name validation is separate from NOT NULL.

The `AddCategories` migration inserts these shared defaults:

| ID | Name |
| --- | --- |
| -1 | Food |
| -2 | Transport |
| -3 | Housing |
| -4 | Entertainment |
| -5 | Shopping |
| -6 | Health |
| -7 | Education |
| -8 | Subscriptions |
| -9 | Other |

Negative seed IDs leave generated positive IDs for custom categories. Defaults
have `IsDefault = true` and `UserId = null`. Categories have no timestamp column.
The Figma dropdown's Transfer label is not a default category: the planned
transaction rules treat transfers as uncategorized.

### Implemented relationships

* One user owns zero or more accounts; each account requires one user.
* One user owns zero or more custom categories; shared defaults have no user.
* Deleting a user at the database level cascades to their accounts and custom
  categories. There is no user-deletion API.
* No foreign keys from transactions or budgets exist yet.

## 2. Migrations and startup

Apply migrations before starting the backend:

```sh
dotnet ef database update --project backend
```

Migration order: `AddUsers`, `AddFinancialAccounts`,
`StoreAccountTypeAsString` (empty Up/Down), `AddCategories`.
`AddFinancialAccounts` already creates Type as text. Startup does not migrate the
database: it queries Users to seed the test account. A fresh database must be
migrated first. Compose does not supply a migration job or readiness health check.

## 3. Planned schema and business rules

The following tables and calculations are design proposals. They are not present
in the current model or migrations. Lowercase snake_case names here are conceptual,
not existing physical columns. Proposed foreign-key types are integers to match
the implemented tables; final migrations will define exact constraints and names.
Transaction and budget references will need ownership checks and an explicit
category/account deletion policy when those modules are implemented.

### Transaction (planned)

Stores income, expense, and transfer operations.

| Column                   | Type    | Constraints                           |
| ------------------------ | ------- | ------------------------------------- |
| `id`                     | INTEGER    | Primary Key                           |
| `user_id`                | INTEGER    | Foreign Key → User, NOT NULL          |
| `source_account_id`      | INTEGER    | Foreign Key → Financial Account, NULL |
| `destination_account_id` | INTEGER    | Foreign Key → Financial Account, NULL |
| `category_id`            | INTEGER    | Foreign Key → Category, NULL          |
| `amount`                 | DECIMAL | NOT NULL                              |
| `type`                   | VARCHAR | NOT NULL                              |
| `date`                   | DATE    | NOT NULL                              |
| `description`            | VARCHAR | NULL                                  |

Transaction types:

* Income
* Expense
* Transfer

The account and category requirements depend on the transaction type:

| Type     | Source Account | Destination Account | Category |
| -------- | -------------- | ------------------- | -------- |
| Income   | NULL           | Required            | Optional |
| Expense  | Required       | NULL                | Required |
| Transfer | Required       | Required            | NULL     |

A transfer cannot use the same account as both the source and destination.

The `user_id` must match the owner of the accounts referenced by the transaction.

---


### Budget (planned)

Stores spending limits defined for categories and periods.

| Column           | Type    | Constraints                      |
| ---------------- | ------- | -------------------------------- |
| `id`             | INTEGER    | Primary Key                      |
| `user_id`        | INTEGER    | Foreign Key → User, NOT NULL     |
| `category_id`    | INTEGER    | Foreign Key → Category, NOT NULL |
| `spending_limit` | DECIMAL | NOT NULL                         |
| `start_date`     | DATE    | NOT NULL                         |
| `end_date`       | DATE    | NOT NULL                         |

The following values are calculated from transactions:

* Amount spent
* Remaining amount
* Percentage used
* Overspending status

---

### Savings Goal (planned)

Stores financial goals created by users.

| Column           | Type    | Constraints                  |
| ---------------- | ------- | ---------------------------- |
| `id`             | INTEGER    | Primary Key                  |
| `user_id`        | INTEGER    | Foreign Key → User, NOT NULL |
| `name`           | VARCHAR | NOT NULL                     |
| `target_amount`  | DECIMAL | NOT NULL                     |
| `current_amount` | DECIMAL | NOT NULL                     |
| `deadline`       | DATE    | NOT NULL                     |

The following values are calculated rather than stored:

* Remaining amount
* Goal progress
* Required average monthly savings
* Goal achievability

---

### Financial Scenario (planned)

Stores hypothetical financial scenarios created by users.

| Column                     | Type    | Constraints                  |
| -------------------------- | ------- | ---------------------------- |
| `id`                       | INTEGER    | Primary Key                  |
| `user_id`                  | INTEGER    | Foreign Key → User, NOT NULL |
| `name`                     | VARCHAR | NOT NULL                     |
| `monthly_income`           | DECIMAL | NOT NULL                     |
| `housing_expenses`         | DECIMAL | NOT NULL                     |
| `food_expenses`            | DECIMAL | NOT NULL                     |
| `entertainment_expenses`   | DECIMAL | NOT NULL                     |
| `other_recurring_expenses` | DECIMAL | NOT NULL                     |

Scenario values represent hypothetical financial parameters.

Changing a scenario must not modify actual accounts, transactions, budgets, or savings goals.

The financial projection produced by a scenario is calculated by the application and is not stored as a separate database entity.


### Transaction Rules

* `amount` must be greater than zero.
* `type` must be one of: Income, Expense, Transfer.
* Income requires a destination account.
* Expense requires a source account and category.
* Transfer requires both a source and destination account.
* Transfer cannot use the same account as both source and destination.
* Transfer should not have a category.
* Referenced accounts must belong to the same user as the transaction.
* Account balances must be updated atomically with transaction changes.

### Budget Rules

* `spending_limit` must not be negative.
* `end_date` must not be earlier than `start_date`.
* The category must belong to the same user as the budget, or be a default category.

### Savings Goal Rules

* `target_amount` must be greater than zero.
* `current_amount` must not be negative.
* `deadline` must represent a valid future target date when creating a new goal.


### Calculated Data (planned)

The following information is calculated by the application rather than stored as independent database fields.

### Account Balance

```text
Balance =
Initial Balance
+ Income
- Expenses
+ Incoming Transfers
- Outgoing Transfers
```

The stored `balance` value must remain consistent with this calculation.

### Savings

```text
Savings = Income - Expenses
```

### Budget Usage

```text
Amount Spent =
Sum of Expense Transactions
for the Budget Category
within the Budget Period
```

### Savings Goal Progress

```text
Remaining Amount =
Target Amount - Current Amount
```

### Financial Projection

```text
Projected Savings =
Projected Income - Projected Expenses
```

Financial projections are generated from the current financial situation and a hypothetical financial scenario.

They are not stored as a separate database entity.
