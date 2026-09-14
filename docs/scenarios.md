# Scenarios

## UC-01 — Register account

**Main scenario:**

1. The user opens the registration page.
2. The system displays the registration form.
3. The user enters their email address.
4. The user enters a password.
5. The user confirms the password.
6. The user submits the registration form.
7. The system validates the provided data.
8. The system creates the user account.
9. The system securely stores the user's password.
10. The system confirms successful registration.
11. The system redirects the user to the login page.

**Alternative scenarios:**

* If the email address is already registered, the system informs the user and does not create a new account.
* If the passwords do not match, the system informs the user and asks them to correct the data.
* If the provided data is invalid, the system displays validation errors.

---

## UC-02 — Log in

**Main scenario:**

1. The user opens the login page.
2. The system displays the login form.
3. The user enters their email address.
4. The user enters their password.
5. The user submits the login form.
6. The system verifies the provided credentials.
7. The system authenticates the user.
8. The system generates an authentication token.
9. The system returns the authentication token to the application.
10. The application stores the authentication token.
11. The system redirects the user to the Dashboard.

**Alternative scenarios:**

* If the email address or password is incorrect, the system informs the user that the credentials are invalid.
* If the provided data is invalid, the system displays validation errors.
* If authentication fails, the user remains on the login page.

---

## UC-03 — Log out

**Main scenario:**

1. The authenticated user selects the logout option.
2. The application removes the stored authentication token.
3. The system clears the user's authenticated state.
4. The system redirects the user to the landing page.
5. The user is no longer able to access protected application pages.

**Alternative scenario:**

* If the user is already unauthenticated, the system redirects them to the landing page or login page.
