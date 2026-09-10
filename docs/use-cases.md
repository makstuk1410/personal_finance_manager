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

* <a id="uc-01"></a>**[UC-01](functional-requirements.md#L9)** - [Register account](functional-requirements.md#L9)
* <a id="uc-02"></a>**[UC-02](functional-requirements.md#L25)** - [Log in](functional-requirements.md#L25)
* <a id="uc-03"></a>**[UC-03](functional-requirements.md#L31)** - [Log out](functional-requirements.md#L31)

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

* <a id="uc-04"></a>**[UC-04](functional-requirements.md#L39)** - [Create account](functional-requirements.md#L39)
* <a id="uc-05"></a>**[UC-05](functional-requirements.md#L52)** - [View accounts](functional-requirements.md#L52)
* <a id="uc-06"></a>**[UC-06](functional-requirements.md#L48)** - [Edit account](functional-requirements.md#L48)
* <a id="uc-07"></a>**[UC-07](functional-requirements.md#L50)** - [Delete account](functional-requirements.md#L50)

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

* <a id="uc-08"></a>**[UC-08](functional-requirements.md#L71)** - [Add transaction](functional-requirements.md#L71)
* <a id="uc-09"></a>**[UC-09](functional-requirements.md#L84)** - [View transactions](functional-requirements.md#L84)
* <a id="uc-10"></a>**[UC-10](functional-requirements.md#L86)** - [Edit transaction](functional-requirements.md#L86)
* <a id="uc-11"></a>**[UC-11](functional-requirements.md#L88)** - [Delete transaction](functional-requirements.md#L88)
* <a id="uc-12"></a>**[UC-12](functional-requirements.md#L92)** - [Filter transactions](functional-requirements.md#L92)
* <a id="uc-13"></a>**[UC-13](functional-requirements.md#L99)** - [Sort transactions](functional-requirements.md#L99)

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

* <a id="uc-14"></a>**[UC-14](functional-requirements.md#L121)** - [Create category](functional-requirements.md#L121)
* <a id="uc-15"></a>**[UC-15](functional-requirements.md#L119)** - [View categories](functional-requirements.md#L119)
* <a id="uc-16"></a>**[UC-16](functional-requirements.md#L123)** - [Edit category](functional-requirements.md#L123)
* <a id="uc-17"></a>**[UC-17](functional-requirements.md#L125)** - [Delete category](functional-requirements.md#L125)
* <a id="uc-18"></a>**[UC-18](functional-requirements.md#L127)** - [Assign category to transaction](functional-requirements.md#L127)

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

* <a id="uc-19"></a>**[UC-19](functional-requirements.md#L133)** - [View dashboard](functional-requirements.md#L133)
* <a id="uc-20"></a>**[UC-20](functional-requirements.md#L145)** - [Select analysis period](functional-requirements.md#L145)

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

* <a id="uc-21"></a>**[UC-21](functional-requirements.md#L159)** - [View income statistics](functional-requirements.md#L159)
* <a id="uc-22"></a>**[UC-22](functional-requirements.md#L161)** - [View expense statistics](functional-requirements.md#L161)
* <a id="uc-23"></a>**[UC-23](functional-requirements.md#L163)** - [View savings statistics](functional-requirements.md#L163)
* <a id="uc-24"></a>**[UC-24](functional-requirements.md#L169)** - [View spending by category](functional-requirements.md#L169)
* <a id="uc-25"></a>**[UC-25](functional-requirements.md#L171)** - [Compare financial periods](functional-requirements.md#L171)

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

* <a id="uc-26"></a>**[UC-26](functional-requirements.md#L179)** - [Create budget](functional-requirements.md#L179)
* <a id="uc-27"></a>**[UC-27](functional-requirements.md#L188)** - [View budgets](functional-requirements.md#L188)
* <a id="uc-28"></a>**[UC-28](functional-requirements.md#L196)** - [Edit budget](functional-requirements.md#L196)
* <a id="uc-29"></a>**[UC-29](functional-requirements.md#L198)** - [Delete budget](functional-requirements.md#L198)
* <a id="uc-30"></a>**[UC-30](functional-requirements.md#L188)** - [Track budget usage](functional-requirements.md#L188)

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

* <a id="uc-31"></a>**[UC-31](functional-requirements.md#L204)** - [Create savings goal](functional-requirements.md#L204)
* <a id="uc-32"></a>**[UC-32](functional-requirements.md#L213)** - [View savings goals](functional-requirements.md#L213)
* <a id="uc-33"></a>**[UC-33](functional-requirements.md#L221)** - [Edit savings goal](functional-requirements.md#L221)
* <a id="uc-34"></a>**[UC-34](functional-requirements.md#L223)** - [Delete savings goal](functional-requirements.md#L223)
* <a id="uc-35"></a>**[UC-35](functional-requirements.md#L213)** - [Track goal progress](functional-requirements.md#L213)
* <a id="uc-36"></a>**[UC-36](functional-requirements.md#L219)** - [Estimate goal achievability](functional-requirements.md#L219)

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

* <a id="uc-37"></a>**[UC-37](functional-requirements.md#L231)** - [Create financial scenario](functional-requirements.md#L231)
* <a id="uc-38"></a>**[UC-38](functional-requirements.md#L233)** - [Modify scenario parameters](functional-requirements.md#L233)
* <a id="uc-39"></a>**[UC-39](functional-requirements.md#L241)** - [Run financial simulation](functional-requirements.md#L241)
* <a id="uc-40"></a>**[UC-40](functional-requirements.md#L243)** - [View financial projection](functional-requirements.md#L243)
* <a id="uc-41"></a>**[UC-41](functional-requirements.md#L249)** - [Compare scenario with current situation](functional-requirements.md#L249)
* <a id="uc-42"></a>**[UC-42](functional-requirements.md#L245)** - [Analyze impact on savings goals](functional-requirements.md#L245)
* <a id="uc-43"></a>**[UC-43](functional-requirements.md#L247)** - [Analyze impact on budgets](functional-requirements.md#L247)
* <a id="uc-44"></a>**[UC-44](functional-requirements.md#L253)** - [Reset scenario](functional-requirements.md#L253)
