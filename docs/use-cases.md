# Use Cases

## 1. Authentication

```mermaid
flowchart LR
    User((User))

    subgraph Authentication
        Register([Register account])
        Login([Log in])
        Logout([Log out])
    end

    User --> Register
    User --> Login
    User --> Logout
```

### UC-01 — [Register account](functional-requirements.md#fr-011)
### UC-02 — [Log in](functional-requirements.md#fr-021)
### UC-03 — [Log out](functional-requirements.md#fr-024)


## 2. Financial Accounts

```mermaid
flowchart LR
    User((User))

    subgraph Financial Accounts
        Create([Create account])
        View([View accounts])
        Edit([Edit account])
        Delete([Delete account])
    end

    User --> Create
    User --> View
    User --> Edit
    User --> Delete
```

### UC-04 — [Create account](functional-requirements.md#fr-031)
### UC-05 — [View accounts](functional-requirements.md#fr-035)
### UC-06 — [Edit account](functional-requirements.md#fr-033)
### UC-07 — [Delete account](functional-requirements.md#fr-034)

---

## 3. Transactions

```mermaid
flowchart LR
    User((User))

    subgraph Transactions
        Add([Add transaction])
        View([View transactions])
        Edit([Edit transaction])
        Delete([Delete transaction])
        Filter([Filter transactions])
        Sort([Sort transactions])
    end

    User --> Add
    User --> View
    User --> Edit
    User --> Delete
    User --> Filter
    User --> Sort
```

### UC-08 — [Add transaction](functional-requirements.md#fr-041)
### UC-09 — [View transactions](functional-requirements.md#fr-043)
### UC-10 — [Edit transaction](functional-requirements.md#fr-044)
### UC-11 — [Delete transaction](functional-requirements.md#fr-045)
### UC-12 — [Filter transactions](functional-requirements.md#fr-047)
### UC-13 — [Sort transactions](functional-requirements.md#fr-048)

---

## 4. Categories

```mermaid
flowchart LR
    User((User))

    subgraph Categories
        Create([Create category])
        View([View categories])
        Edit([Edit category])
        Delete([Delete category])
        Assign([Assign category to transaction])
    end

    User --> Create
    User --> View
    User --> Edit
    User --> Delete
    User --> Assign
```

### UC-14 — [Create category](functional-requirements.md#fr-052)
### UC-15 — [View categories](functional-requirements.md#fr-051)
### UC-16 — [Edit category](functional-requirements.md#fr-053)
### UC-17 — [Delete category](functional-requirements.md#fr-054)
### UC-18 — [Assign category to transaction](functional-requirements.md#fr-055)

---

## 5. Dashboard

```mermaid
flowchart LR
    User((User))

    subgraph Dashboard
        View([View dashboard])
        SelectPeriod([Select analysis period])
    end

    User --> View
    User --> SelectPeriod
```

### UC-19 — [View dashboard](functional-requirements.md#fr-061)
### UC-20 — [Select analysis period](functional-requirements.md#fr-062)

---

## 6. Financial Statistics

```mermaid
flowchart LR
    User((User))

    subgraph Financial Statistics
        ViewIncome([View income statistics])
        ViewExpenses([View expense statistics])
        ViewSavings([View savings statistics])
        ViewCategories([View spending by category])
        Compare([Compare financial periods])
    end

    User --> ViewIncome
    User --> ViewExpenses
    User --> ViewSavings
    User --> ViewCategories
    User --> Compare
```

### UC-21 — [View income statistics](functional-requirements.md#fr-071)
### UC-22 — [View expense statistics](functional-requirements.md#fr-072)
### UC-23 — [View savings statistics](functional-requirements.md#fr-073)
### UC-24 — [View spending by category](functional-requirements.md#fr-074)
### UC-25 — [Compare financial periods](functional-requirements.md#fr-075)

---

## 7. Budgets

```mermaid
flowchart LR
    User((User))

    subgraph Budgets
        Create([Create budget])
        View([View budgets])
        Edit([Edit budget])
        Delete([Delete budget])
        Track([Track budget usage])
    end

    User --> Create
    User --> View
    User --> Edit
    User --> Delete
    User --> Track
```

### UC-26 — [Create budget](functional-requirements.md#fr-081)
### UC-27 — [View budgets](functional-requirements.md#fr-082)
### UC-28 — [Edit budget](functional-requirements.md#fr-086)
### UC-29 — [Delete budget](functional-requirements.md#fr-087)
### UC-30 — [Track budget usage](functional-requirements.md#fr-082)

---

## 8. Savings Goals

```mermaid
flowchart LR
    User((User))

    subgraph Savings Goals
        Create([Create savings goal])
        View([View savings goals])
        Edit([Edit savings goal])
        Delete([Delete savings goal])
        Track([Track goal progress])
        Estimate([Estimate goal achievability])
    end

    User --> Create
    User --> View
    User --> Edit
    User --> Delete
    User --> Track
    User --> Estimate
```

### UC-31 — [Create savings goal](functional-requirements.md#fr-091)
### UC-32 — [View savings goals](functional-requirements.md#fr-092)
### UC-33 — [Edit savings goal](functional-requirements.md#fr-096)
### UC-34 — [Delete savings goal](functional-requirements.md#fr-097)
### UC-35 — [Track goal progress](functional-requirements.md#fr-092)
### UC-36 — [Estimate goal achievability](functional-requirements.md#fr-095)

---

## 9. Financial What-If Simulator

```mermaid
flowchart LR
    User((User))

    subgraph What-If Simulator
        Create([Create scenario])
        Modify([Modify scenario parameters])
        Run([Run simulation])
        View([View projection])
        Compare([Compare with current situation])
        GoalImpact([Analyze goal impact])
        BudgetImpact([Analyze budget impact])
        Reset([Reset scenario])
    end

    User --> Create
    User --> Modify
    User --> Run
    User --> View
    User --> Compare
    User --> GoalImpact
    User --> BudgetImpact
    User --> Reset
```

### UC-37 — [Create financial scenario](functional-requirements.md#fr-101)
### UC-38 — [Modify scenario parameters](functional-requirements.md#fr-102)
### UC-39 — [Run financial simulation](functional-requirements.md#fr-103)
### UC-40 — [View financial projection](functional-requirements.md#fr-104)
### UC-41 — [Compare scenario with current situation](functional-requirements.md#fr-107)
### UC-42 — [Analyze impact on savings goals](functional-requirements.md#fr-105)
### UC-43 — [Analyze impact on budgets](functional-requirements.md#fr-106)
### UC-44 — [Reset scenario](functional-requirements.md#fr-109)
