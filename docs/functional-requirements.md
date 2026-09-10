# Functional Requirements

Personal Finance Manager is a web application that allows users to track their income and expenses, analyze their financial habits, set financial goals and budgets, and simulate future financial scenarios.

## 1. Authentication

### FR-01 — User Registration

**<a id="fr-01-1"></a>[FR-01.1](use-cases.md#L20)** The system shall allow a user to create an account.

The user shall provide:

* Email address
* Password
* Password confirmation

**FR-01.2** The system shall verify that the provided email address is not already registered.

**FR-01.3** The system shall validate the password according to the application's password requirements.

**FR-01.4** After successful registration, the user shall be able to authenticate and access the application.

### FR-02 — User Authentication

**<a id="fr-02-1"></a>[FR-02.1](use-cases.md#L21)** The system shall allow users to authenticate using their email address and password.

**FR-02.2** The system shall create an authenticated session after successful authentication.

**FR-02.3** The system shall reject invalid authentication credentials.

**<a id="fr-02-4"></a>[FR-02.4](use-cases.md#L22)** The system shall allow authenticated users to log out.

**FR-02.5** Users shall only have access to their own financial data.

---

## 2. Financial Accounts

**<a id="fr-03-1"></a>[FR-03.1](use-cases.md#L45)** The system shall allow users to create financial accounts.

**FR-03.2** When creating an account, the user shall specify:

* Account name
* Account type
* Initial balance
* Currency

**<a id="fr-03-3"></a>[FR-03.3](use-cases.md#L47)** The system shall allow users to edit their financial accounts.

**<a id="fr-03-4"></a>[FR-03.4](use-cases.md#L48)** The system shall allow users to delete their financial accounts.

**<a id="fr-03-5"></a>[FR-03.5](use-cases.md#L46)** The system shall display the current balance of each account.

The system shall support different account types, including:

* Cash
* Bank account
* Credit card
* Savings account

---

## 3. Transactions

A transaction shall have one of the following types:

* Income
* Expense
* Transfer

**<a id="fr-04-1"></a>[FR-04.1](use-cases.md#L75)** The system shall allow users to create transactions.

When creating a transaction, the user shall be able to specify:

* Amount
* Transaction type
* Category
* Account
* Date
* Description

**FR-04.2** The system shall persist transactions in the database.

**<a id="fr-04-3"></a>[FR-04.3](use-cases.md#L76)** The system shall allow users to view their transactions.

**<a id="fr-04-4"></a>[FR-04.4](use-cases.md#L77)** The system shall allow users to edit existing transactions.

**<a id="fr-04-5"></a>[FR-04.5](use-cases.md#L78)** The system shall allow users to delete transactions.

**FR-04.6** The system shall automatically update the affected account balance when a transaction is created, modified, or deleted.

**<a id="fr-04-7"></a>[FR-04.7](use-cases.md#L79)** The system shall allow users to filter transactions by:

* Date
* Category
* Transaction type
* Account

**<a id="fr-04-8"></a>[FR-04.8](use-cases.md#L80)** The system shall allow users to sort transactions by date and amount.

---

## 4. Categories

The system shall provide predefined categories for organizing transactions.

Default categories shall include:

* Food
* Transport
* Housing
* Entertainment
* Shopping
* Health
* Education
* Subscriptions
* Other

**<a id="fr-05-1"></a>[FR-05.1](use-cases.md#L106)** The system shall provide predefined transaction categories.

**<a id="fr-05-2"></a>[FR-05.2](use-cases.md#L105)** The system shall allow users to create custom categories.

**<a id="fr-05-3"></a>[FR-05.3](use-cases.md#L107)** The system shall allow users to rename their custom categories.

**<a id="fr-05-4"></a>[FR-05.4](use-cases.md#L108)** The system shall allow users to delete their custom categories.

**<a id="fr-05-5"></a>[FR-05.5](use-cases.md#L109)** The system shall allow users to assign a category to a transaction.

---

## 5. Dashboard

**<a id="fr-06-1"></a>[FR-06.1](use-cases.md#L128)** The system shall provide a dashboard containing an overview of the user's financial situation.

The dashboard shall display:

* Current total balance
* Income for the selected period
* Expenses for the selected period
* Savings for the selected period
* Recent transactions
* Spending by category
* Income versus expenses

**<a id="fr-06-2"></a>[FR-06.2](use-cases.md#L129)** The system shall allow users to select the period used for dashboard calculations.

Supported periods shall include:

* This week
* This month
* Last month
* Last three months
* Custom period

---

## 6. Financial Statistics

**<a id="fr-07-1"></a>[FR-07.1](use-cases.md#L154)** The system shall calculate the total income for a selected period.

**<a id="fr-07-2"></a>[FR-07.2](use-cases.md#L155)** The system shall calculate the total expenses for a selected period.

**<a id="fr-07-3"></a>[FR-07.3](use-cases.md#L156)** The system shall calculate savings for a selected period.

```text
Savings = Income - Expenses
```

**<a id="fr-07-4"></a>[FR-07.4](use-cases.md#L157)** The system shall provide a breakdown of expenses by category.

**<a id="fr-07-5"></a>[FR-07.5](use-cases.md#L158)** The system shall allow users to compare financial statistics between different periods.

The system shall provide information about changes in spending between periods.

---

## 7. Budgets

**<a id="fr-08-1"></a>[FR-08.1](use-cases.md#L183)** The system shall allow users to create budgets for specific categories and periods.

A budget shall contain:

* Category
* Spending limit
* Start date
* End date

**<a id="fr-08-2"></a>[FR-08.2](use-cases.md#L184)** The system shall calculate the amount spent within a budget.

**<a id="fr-08-3"></a>[FR-08.3](use-cases.md#L187)** The system shall display the remaining amount available within a budget.

**<a id="fr-08-4"></a>[FR-08.4](use-cases.md#L187)** The system shall display the percentage of the budget that has been used.

**<a id="fr-08-5"></a>[FR-08.5](use-cases.md#L187)** The system shall indicate when spending exceeds the configured budget.

**<a id="fr-08-6"></a>[FR-08.6](use-cases.md#L185)** The system shall allow users to edit existing budgets.

**<a id="fr-08-7"></a>[FR-08.7](use-cases.md#L186)** The system shall allow users to delete existing budgets.

---

## 8. Savings Goals

**<a id="fr-09-1"></a>[FR-09.1](use-cases.md#L214)** The system shall allow users to create financial savings goals.

A savings goal shall contain:

* Name
* Target amount
* Current amount
* Deadline

**<a id="fr-09-2"></a>[FR-09.2](use-cases.md#L215)** The system shall display the user's progress towards each savings goal.

**<a id="fr-09-3"></a>[FR-09.3](use-cases.md#L218)** The system shall calculate the remaining amount required to reach a savings goal.

**<a id="fr-09-4"></a>[FR-09.4](use-cases.md#L218)** The system shall calculate the average amount that needs to be saved per month to reach the goal by its deadline.

**<a id="fr-09-5"></a>[FR-09.5](use-cases.md#L219)** The system shall estimate whether a savings goal is achievable based on the user's financial data.

**<a id="fr-09-6"></a>[FR-09.6](use-cases.md#L216)** The system shall allow users to edit existing savings goals.

**<a id="fr-09-7"></a>[FR-09.7](use-cases.md#L217)** The system shall allow users to delete existing savings goals.

---

## 9. Financial What-If Simulator

The Financial What-If Simulator shall allow users to create hypothetical financial scenarios without modifying their actual financial data.

**<a id="fr-10-1"></a>[FR-10.1](use-cases.md#L250)** The system shall allow users to create hypothetical financial scenarios.

**<a id="fr-10-2"></a>[FR-10.2](use-cases.md#L251)** A scenario shall allow users to modify selected financial parameters, including:

* Monthly income
* Housing expenses
* Food expenses
* Entertainment expenses
* Other recurring expenses

**<a id="fr-10-3"></a>[FR-10.3](use-cases.md#L252)** The system shall calculate the projected monthly income, expenses, and savings based on the scenario.

**<a id="fr-10-4"></a>[FR-10.4](use-cases.md#L253)** The system shall calculate the projected account balance based on the scenario.

**<a id="fr-10-5"></a>[FR-10.5](use-cases.md#L255)** The system shall calculate the impact of a hypothetical scenario on the user's savings goals.

**<a id="fr-10-6"></a>[FR-10.6](use-cases.md#L256)** The system shall calculate the impact of a hypothetical scenario on the user's budgets.

**<a id="fr-10-7"></a>[FR-10.7](use-cases.md#L254)** The system shall allow users to compare their current financial situation with a hypothetical scenario.

**FR-10.8** Hypothetical scenarios shall not modify the user's actual transactions, accounts, budgets, or savings goals.

**<a id="fr-10-9"></a>[FR-10.9](use-cases.md#L257)** The system shall allow users to modify or reset scenario parameters before applying the simulation.
