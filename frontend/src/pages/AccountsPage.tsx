import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    Banknote,
    CreditCard,
    Landmark,
    Pencil,
    Plus,
    Trash2,
    Wallet,
} from "lucide-react";
import "./AccountsPage.css";

interface Account {
    id: number;
    name: string;
    type: "Cash" | "BankAccount" | "CreditCard" | "SavingsAccount";
    initialBalance: number;
    balance: number;
    currency: string;
    createdAt: string;
}

interface AccountFormData {
    name: string;
    type: Account["type"];
    initialBalance: string;
    currency: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

const accountTypeLabels: Record<Account["type"], string> = {
    Cash: "Cash",
    BankAccount: "Bank Account",
    CreditCard: "Credit Card",
    SavingsAccount: "Savings Account",
};

const emptyForm: AccountFormData = {
    name: "",
    type: "BankAccount",
    initialBalance: "",
    currency: "PLN",
};

function getToken(): string | null {
    return localStorage.getItem("token");
}

function getAccountIcon(type: Account["type"]) {
    switch (type) {
        case "Cash":
            return <Banknote size={22} />;

        case "BankAccount":
            return <Landmark size={22} />;

        case "CreditCard":
            return <CreditCard size={22} />;

        case "SavingsAccount":
            return <Wallet size={22} />;

        default:
            return <Wallet size={22} />;
    }
}

function formatBalance(value: number): string {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);

    const [deleteAccountId, setDeleteAccountId] = useState<number | null>(null);

    const [formData, setFormData] =
        useState<AccountFormData>(emptyForm);

    const loadAccounts = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            const response = await fetch(`${API_URL}/accounts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to load accounts.");
            }

            const data: Account[] = await response.json();

            setAccounts(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load accounts."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    const openCreateModal = () => {
        setEditingAccount(null);
        setFormData(emptyForm);
        setShowForm(true);
        setError("");
    };

    const openEditModal = (account: Account) => {
        setEditingAccount(account);

        setFormData({
            name: account.name,
            type: account.type,
            initialBalance: account.initialBalance.toString(),
            currency: account.currency,
        });

        setShowForm(true);
        setError("");
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingAccount(null);
        setFormData(emptyForm);
    };

    const handleInputChange = (
        field: keyof AccountFormData,
        value: string
    ) => {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {
            setError("");

            const token = getToken();

            const isEditing = editingAccount !== null;

            const url = isEditing
                ? `${API_URL}/accounts/${editingAccount.id}`
                : `${API_URL}/accounts`;

            const body = isEditing
                ? {
                      name: formData.name,
                      type: formData.type,
                      currency: formData.currency,
                  }
                : {
                      name: formData.name,
                      type: formData.type,
                      initialBalance: Number(formData.initialBalance),
                      currency: formData.currency,
                  };

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message || "Failed to save account."
                );
            }

            closeForm();
            await loadAccounts();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save account."
            );
        }
    };

    const handleDelete = async () => {
        if (deleteAccountId === null) {
            return;
        }

        try {
            setError("");

            const token = getToken();

            const response = await fetch(
                `${API_URL}/accounts/${deleteAccountId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete account.");
            }

            setDeleteAccountId(null);
            await loadAccounts();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete account."
            );

            setDeleteAccountId(null);
        }
    };

    const totalBalance = accounts.reduce(
        (total, account) => total + account.balance,
        0
    );

    return (
        <div className="accounts-page">
            <div className="accounts-page__actions">
                <button
                    className="accounts-page__add-button"
                    onClick={openCreateModal}
                >
                    <Plus size={18} />
                    Add account
                </button>
            </div>

            {error && (
                <div className="accounts-page__error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="accounts-page__loading">
                    Loading accounts...
                </div>
            ) : accounts.length === 0 ? (
                <div className="accounts-page__empty">
                    <h2 className="accounts-page__empty-title">
                        No accounts yet
                    </h2>

                    <p className="accounts-page__empty-text">
                        Create your first financial account to start
                        tracking your finances.
                    </p>

                    <button
                        className="accounts-page__add-button"
                        onClick={openCreateModal}
                    >
                        <Plus size={18} />
                        Add account
                    </button>
                </div>
            ) : (
                <>
                    <div className="accounts-page__grid">
                        {accounts.map((account) => (
                            <div
                                className="account-card"
                                key={account.id}
                            >
                                <div className="account-card__header">
                                    <div className="account-card__identity">
                                        <div className="account-card__icon">
                                            {getAccountIcon(account.type)}
                                        </div>

                                        <div>
                                            <h3 className="account-card__name">
                                                {account.name}
                                            </h3>

                                            <p className="account-card__type">
                                                {
                                                    accountTypeLabels[
                                                        account.type
                                                    ]
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="account-card__bottom">
                                    <div>
                                        <span className="account-card__balance-label">
                                            Balance
                                        </span>

                                        <div className="account-card__balance">
                                            {formatBalance(account.balance)}{" "}
                                            {account.currency}
                                        </div>
                                    </div>

                                    <div className="account-card__actions">
                                        <button
                                            className="account-card__edit-button"
                                            onClick={() =>
                                                openEditModal(account)
                                            }
                                            title="Edit account"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            className="account-card__delete-button"
                                            onClick={() =>
                                                setDeleteAccountId(
                                                    account.id
                                                )
                                            }
                                            title="Delete account"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="accounts-page__summary">
                        <h2 className="accounts-page__summary-title">
                            Overview
                        </h2>

                        <div className="accounts-page__summary-grid">
                            <div>
                                <span className="accounts-page__summary-label">
                                    Total accounts
                                </span>

                                <span className="accounts-page__summary-value">
                                    {accounts.length}
                                </span>
                            </div>

                            <div>
                                <span className="accounts-page__summary-label">
                                    Total balance
                                </span>

                                <span className="accounts-page__summary-value">
                                    {formatBalance(totalBalance)} PLN
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showForm &&
                createPortal(
                    <div
                        className="account-modal-overlay"
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                closeForm();
                            }
                        }}
                    >
                        <div
                            className="account-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="account-modal-title"
                        >
                            <h2
                                id="account-modal-title"
                                className="account-modal__title"
                            >
                                {editingAccount
                                    ? "Edit Account"
                                    : "Create Account"}
                            </h2>

                            <form
                                className="account-modal__form"
                                onSubmit={handleSubmit}
                            >
                                <div className="account-modal__field">
                                    <label className="account-modal__label">
                                        Account name
                                    </label>

                                    <input
                                        className="account-modal__input"
                                        type="text"
                                        value={formData.name}
                                        onChange={(event) =>
                                            handleInputChange(
                                                "name",
                                                event.target.value
                                            )
                                        }
                                        placeholder="e.g. Main Bank Account"
                                        required
                                    />
                                </div>

                                <div className="account-modal__field">
                                    <label className="account-modal__label">
                                        Account type
                                    </label>

                                    <select
                                        className="account-modal__select"
                                        value={formData.type}
                                        onChange={(event) =>
                                            handleInputChange(
                                                "type",
                                                event.target
                                                    .value
                                            )
                                        }
                                        required
                                    >
                                        <option value="Cash">
                                            Cash
                                        </option>

                                        <option value="BankAccount">
                                            Bank Account
                                        </option>

                                        <option value="CreditCard">
                                            Credit Card
                                        </option>

                                        <option value="SavingsAccount">
                                            Savings Account
                                        </option>
                                    </select>
                                </div>

                                {!editingAccount && (
                                    <div className="account-modal__field">
                                        <label className="account-modal__label">
                                            Initial balance
                                        </label>

                                        <input
                                            className="account-modal__input"
                                            type="number"
                                            step="0.01"
                                            value={
                                                formData.initialBalance
                                            }
                                            onChange={(event) =>
                                                handleInputChange(
                                                    "initialBalance",
                                                    event.target
                                                        .value
                                                )
                                            }
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="account-modal__field">
                                    <label className="account-modal__label">
                                        Currency
                                    </label>

                                    <select
                                        className="account-modal__select"
                                        value={formData.currency}
                                        onChange={(event) =>
                                            handleInputChange(
                                                "currency",
                                                event.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="PLN">
                                            PLN
                                        </option>

                                        <option value="EUR">
                                            EUR
                                        </option>

                                        <option value="USD">
                                            USD
                                        </option>

                                        <option value="GBP">
                                            GBP
                                        </option>

                                        <option value="CHF">
                                            CHF
                                        </option>
                                    </select>
                                </div>

                                <div className="account-modal__actions">
                                    <button
                                        type="button"
                                        className="account-modal__cancel"
                                        onClick={closeForm}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="account-modal__submit"
                                    >
                                        {editingAccount
                                            ? "Save"
                                            : "Create"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}

            {deleteAccountId !== null &&
                createPortal(
                    <div
                        className="delete-modal-overlay"
                        onMouseDown={(event) => {
                            if (
                                event.target === event.currentTarget
                            ) {
                                setDeleteAccountId(null);
                            }
                        }}
                    >
                        <div
                            className="delete-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="delete-modal-title"
                        >
                            <h2
                                id="delete-modal-title"
                                className="delete-modal__title"
                            >
                                Delete account?
                            </h2>

                            <p className="delete-modal__text">
                                Are you sure you want to delete this
                                account? This action cannot be undone.
                            </p>

                            <div className="delete-modal__actions">
                                <button
                                    className="delete-modal__cancel"
                                    onClick={() =>
                                        setDeleteAccountId(null)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="delete-modal__confirm"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}