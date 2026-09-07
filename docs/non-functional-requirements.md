# Non-Functional Requirements

## 1. Security

**NFR-01.1** The system shall store user passwords using a secure one-way password hashing algorithm.

**NFR-01.2** The system shall require authentication before allowing access to protected financial data and operations.

**NFR-01.3** The system shall ensure that a user cannot access or modify another user's financial data.

**NFR-01.4** The system shall validate user input to prevent common security vulnerabilities.

---

## 2. Data Integrity

**NFR-02.1** The system shall maintain consistency between transactions and account balances.

**NFR-02.2** Financial operations that modify multiple related data records shall be performed atomically.

**NFR-02.3** The system shall prevent invalid financial data from being persisted.

**NFR-02.4** Monetary values shall be represented and calculated using a numeric type that prevents floating-point precision errors.

---

## 3. Privacy

**NFR-03.1** The system shall not expose sensitive financial or authentication data through API responses, logs, or error messages.

**NFR-03.2** The system shall collect only personal information that is necessary for the application's functionality.

---

## 4. Performance

**NFR-04.1** Typical API requests should be processed within 500 ms under normal operating conditions.

**NFR-04.2** The dashboard should become usable within 2 seconds under normal operating conditions.

**NFR-04.3** The system shall use pagination when retrieving large collections of transactions.

---

## 5. Reliability

**NFR-05.1** The system shall preserve all persisted financial data after application restarts.

**NFR-05.2** A failed financial operation shall not leave the system in an inconsistent state.

---

## 6. Maintainability

**NFR-06.1** The application shall use a modular architecture with clearly separated responsibilities.

**NFR-06.2** Business logic shall be separated from presentation and infrastructure concerns.

**NFR-06.3** The backend API shall be documented using the OpenAPI specification.

**NFR-06.4** The codebase shall follow consistent coding conventions.

---

## 7. Usability

**NFR-07.1** The application shall provide clear validation and error messages to users.

**NFR-07.2** The application shall use a consistent user interface across its main sections.

**NFR-07.3** The What-If Simulator shall clearly distinguish hypothetical scenarios from actual financial data.

---

## 8. Testability

**NFR-08.1** The backend shall be designed so that its business logic can be tested independently from external infrastructure.

**NFR-08.2** Critical financial calculations shall be covered by automated tests.

**NFR-08.3** The What-If Simulator shall have automated tests covering different financial scenarios.

---

## 9. Compatibility

**NFR-09.1** The web application shall support current versions of major desktop browsers.

**NFR-09.2** The user interface shall be responsive and usable on desktop and mobile screen sizes.

---

## 10. Observability

**NFR-10.1** The backend shall provide structured application logs.

**NFR-10.2** The application shall provide health checks for critical infrastructure components.
