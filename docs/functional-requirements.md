# Functional Requirements

Personal Finance Manager is a web application that allows users to track their income and expenses, analyze their financial habits, set financial goals and budgets, and simulate future financial scenarios.

## 1. Authentication

### FR-01 — User Registration

### [FR-01.1](use-cases.md#uc-01-register-account)
#### The system shall allow a user to create an account.

The user shall provide:

* Email address
* Password
* Password confirmation

### FR-01.2
#### The system shall verify that the provided email address is not already registered.

### FR-01.3
#### The system shall validate the password according to the application's password requirements.

### FR-01.4
#### After successful registration, the user shall be able to authenticate and access the application.

### FR-02 — User Authentication

### [FR-02.1](use-cases.md#uc-02-log-in)
#### The system shall allow users to authenticate using their email address and password.

### FR-02.2
#### The system shall create an authenticated session after successful authentication.

### FR-02.3
#### The system shall reject invalid authentication credentials.

### [FR-02.4](use-cases.md#uc-03-log-out)
#### The system shall allow authenticated users to log out.

### FR-02.5
#### Users shall only have access to their own financial data.

---

## 2. Financial Accounts

### [FR-03.1](use-cases.md#uc-04-create-account)
#### The system shall allow users to create financial accounts.

### FR-03.2
#### When creating an account, the user shall specify:

* Account name
* Account type
* Initial balance
* Currency

### [FR-03.3](use-cases.md#uc-06-edit-account)
#### The system shall allow users to edit their financial accounts.

### [FR-03.4](use-cases.md#uc-07-delete-account)
#### The system shall allow users to delete their financial accounts.

### [FR-03.5](use-cases.md#uc-05-view-accounts)
#### The system shall display the current balance of each account.

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

### [FR-04.1](use-cases.md#uc-08-add-transaction)
#### The system shall allow users to create transactions.

When creating a transaction, the user shall be able to specify:

* Amount
* Transaction type
* Category
* Account
* Date
* Description

### FR-04.2
#### The system shall persist transactions in the database.

### [FR-04.3](use-cases.md#uc-09-view-transactions)
#### The system shall allow users to view their transactions.

### [FR-04.4](use-cases.md#uc-10-edit-transaction)
#### The system shall allow users to edit existing transactions.

### [FR-04.5](use-cases.md#uc-11-delete-transaction)
#### The system shall allow users to delete transactions.

### FR-04.6
#### The system shall automatically update the affected account balance when a transaction is created, modified, or deleted.

### [FR-04.7](use-cases.md#uc-12-filter-transactions)
#### The system shall allow users to filter transactions by:

* Date
* Category
* Transaction type
* Account

### [FR-04.8](use-cases.md#uc-13-sort-transactions)
#### The system shall allow users to sort transactions by date and amount.

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

### [FR-05.1](use-cases.md#uc-15-view-categories)
#### The system shall provide predefined transaction categories.

### [FR-05.2](use-cases.md#uc-14-create-category)
#### The system shall allow users to create custom categories.

### [FR-05.3](use-cases.md#uc-16-edit-category)
#### The system shall allow users to rename their custom categories.

### [FR-05.4](use-cases.md#uc-17-delete-category)
#### The system shall allow users to delete their custom categories.

### [FR-05.5](use-cases.md#uc-18-assign-category-to-transaction)
#### The system shall allow users to assign a category to a transaction.

---

## 5. Dashboard

### [FR-06.1](use-cases.md#uc-19-view-dashboard)
#### The system shall provide a dashboard containing an overview of the user's financial situation.

The dashboard shall display:

* Current total balance
* Income for the selected period
* Expenses for the selected period
* Savings for the selected period
* Recent transactions
* Spending by category
* Income versus expenses

### [FR-06.2](use-cases.md#uc-20-select-analysis-period)
#### The system shall allow users to select the period used for dashboard calculations.

Supported periods shall include:

* This week
* This month
* Last month
* Last three months
* Custom period

---

## 6. Financial Statistics

### [FR-07.1](use-cases.md#uc-21-view-income-statistics)
#### The system shall calculate the total income for a selected period.

### [FR-07.2](use-cases.md#uc-22-view-expense-statistics)
#### The system shall calculate the total expenses for a selected period.

### [FR-07.3](use-cases.md#uc-23-view-savings-statistics)
#### The system shall calculate savings for a selected period.

```text
Savings = Income - Expenses
```

### [FR-07.4](use-cases.md#uc-24-view-spending-by-category)
#### The system shall provide a breakdown of expenses by category.

### [FR-07.5](use-cases.md#uc-25-compare-financial-periods)
#### The system shall allow users to compare financial statistics between different periods.

The system shall provide information about changes in spending between periods.

---

## 7. Budgets

### [FR-08.1](use-cases.md#uc-26-create-budget)
#### The system shall allow users to create budgets for specific categories and periods.

A budget shall contain:

* Category
* Spending limit
* Start date
* End date

### [FR-08.2](use-cases.md#uc-27-view-budgets)
#### The system shall calculate the amount spent within a budget.

### FR-08.3
#### The system shall display the remaining amount available within a budget.

### FR-08.4
#### The system shall display the percentage of the budget that has been used.

### FR-08.5
#### The system shall indicate when spending exceeds the configured budget.

### [FR-08.6](use-cases.md#uc-28-edit-budget)
#### The system shall allow users to edit existing budgets.

### [FR-08.7](use-cases.md#uc-29-delete-budget)
#### The system shall allow users to delete existing budgets.

---

## 8. Savings Goals

### [FR-09.1](use-cases.md#uc-31-create-savings-goal)
#### The system shall allow users to create financial savings goals.

A savings goal shall contain:

* Name
* Target amount
* Current amount
* Deadline

### [FR-09.2](use-cases.md#uc-32-view-savings-goals)
#### The system shall display the user's progress towards each savings goal.

### FR-09.3
#### The system shall calculate the remaining amount required to reach a savings goal.

### FR-09.4
#### The system shall calculate the average amount that needs to be saved per month to reach the goal by its deadline.

### [FR-09.5](use-cases.md#uc-36-estimate-goal-achievability)
#### The system shall estimate whether a savings goal is achievable based on the user's financial data.

### [FR-09.6](use-cases.md#uc-33-edit-savings-goal)
#### The system shall allow users to edit existing savings goals.

### [FR-09.7](use-cases.md#uc-34-delete-savings-goal)
#### The system shall allow users to delete existing savings goals.

---

## 9. Financial What-If Simulator

The Financial What-If Simulator shall allow users to create hypothetical financial scenarios without modifying their actual financial data.

### [FR-10.1](use-cases.md#uc-37-create-financial-scenario)
#### The system shall allow users to create hypothetical financial scenarios.

### [FR-10.2](use-cases.md#uc-38-modify-scenario-parameters)
#### A scenario shall allow users to modify selected financial parameters, including:

* Monthly income
* Housing expenses
* Food expenses
* Entertainment expenses
* Other recurring expenses

### [FR-10.3](use-cases.md#uc-39-run-financial-simulation)
#### The system shall calculate the projected monthly income, expenses, and savings based on the scenario.

### [FR-10.4](use-cases.md#uc-40-view-financial-projection)
#### The system shall calculate the projected account balance based on the scenario.

### [FR-10.5](use-cases.md#uc-42-analyze-impact-on-savings-goals)
#### The system shall calculate the impact of a hypothetical scenario on the user's savings goals.

### [FR-10.6](use-cases.md#uc-43-analyze-impact-on-budgets)
#### The system shall calculate the impact of a hypothetical scenario on the user's budgets.

### [FR-10.7](use-cases.md#uc-41-compare-scenario-with-current-situation)
#### The system shall allow users to compare their current financial situation with a hypothetical scenario.

### FR-10.8
#### Hypothetical scenarios shall not modify the user's actual transactions, accounts, budgets, or savings goals.

### [FR-10.9](use-cases.md#uc-44-reset-scenario)
#### The system shall allow users to modify or reset scenario parameters before applying the simulation.
