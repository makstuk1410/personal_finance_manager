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

* **UC-01** - Register account
* **UC-02** - Log in
* **UC-03** - Log out

---

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

* **UC-04** - Create account
* **UC-05** - View accounts
* **UC-06** - Edit account
* **UC-07** - Delete account

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

* **UC-08** - Add transaction
* **UC-09** - View transactions
* **UC-10** - Edit transaction
* **UC-11** - Delete transaction
* **UC-12** - Filter transactions
* **UC-13** - Sort transactions

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

* **UC-14** - Create category
* **UC-15** - View categories
* **UC-16** - Edit category
* **UC-17** - Delete category
* **UC-18** - Assign category to transaction

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

* **UC-19** - View dashboard
* **UC-20** - Select analysis period

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

* **UC-21** - View income statistics
* **UC-22** - View expense statistics
* **UC-23** - View savings statistics
* **UC-24** - View spending by category
* **UC-25** - Compare financial periods

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

* **UC-26** - Create budget
* **UC-27** - View budgets
* **UC-28** - Edit budget
* **UC-29** - Delete budget
* **UC-30** - Track budget usage

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

* **UC-31** - Create savings goal
* **UC-32** - View savings goals
* **UC-33** - Edit savings goal
* **UC-34** - Delete savings goal
* **UC-35** - Track goal progress
* **UC-36** - Estimate goal achievability

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

* **UC-37** - Create financial scenario
* **UC-38** - Modify scenario parameters
* **UC-39** - Run financial simulation
* **UC-40** - View financial projection
* **UC-41** - Compare scenario with current situation
* **UC-42** - Analyze impact on savings goals
* **UC-43** - Analyze impact on budgets
* **UC-44** - Reset scenario
