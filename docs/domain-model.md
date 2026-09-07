# Domain Model

The Domain Model describes the main concepts of the Personal Finance Manager domain and their relationships. It is based on the functional requirements and glossary.

## Domain Model Diagram

```mermaid
classDiagram

    class User {
        +id
        +email
    }

    class FinancialAccount {
        +id
        +name
        +type
        +balance
        +currency
    }

    class Transaction {
        +id
        +amount
        +type
        +date
        +description
    }

    class Category {
        +id
        +name
        +isDefault
    }

    class Budget {
        +id
        +spendingLimit
        +startDate
        +endDate
    }

    class SavingsGoal {
        +id
        +name
        +targetAmount
        +currentAmount
        +deadline
    }

    class FinancialScenario {
        +id
        +name
        +monthlyIncome
        +housingExpenses
        +foodExpenses
        +entertainmentExpenses
        +otherRecurringExpenses
    }

    class FinancialProjection {
        +projectedIncome
        +projectedExpenses
        +projectedSavings
        +projectedBalance
    }

    User "1" --> "0..*" FinancialAccount : owns
    User "1" --> "0..*" Transaction : creates
    User "1" --> "0..*" Budget : creates
    User "1" --> "0..*" SavingsGoal : creates
    User "1" --> "0..*" FinancialScenario : creates

    FinancialAccount "1" --> "0..*" Transaction : contains
    Transaction "0..*" --> "0..1" Category : belongs to
    Budget "0..*" --> "1" Category : applies to
    FinancialScenario "1" --> "1" FinancialProjection : produces
    Transaction "0..*" --> "1" FinancialAccount : source account
    Transaction "0..*" --> "0..1" FinancialAccount : destination account
```

## Main Relationships

* One user can own zero or more financial accounts.
* One user can create zero or more transactions, budgets, savings goals, and financial scenarios.
* A financial account can participate in many transactions.
* A transaction can affect one or two accounts depending on its type.
* A transaction can have zero or one category.
* A category can be assigned to many transactions and budgets.
* Each financial scenario produces one financial projection.
