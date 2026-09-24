import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import { getCategories, type Category } from "../services/categoryService";
import { getAccounts, getTransactions, deleteTransaction, type AccountOption, type Transaction } from "../services/transactionService";
import "./TransactionsPage.css";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<AccountOption[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Transaction | null>(null);
    const [deleting, setDeleting] = useState<Transaction | null>(null);
    const [deleteError, setDeleteError] = useState("");
    const [deleteBusy, setDeleteBusy] = useState(false);
    const deleteLock = useRef(false);
    const confirmation = useRef<HTMLDialogElement>(null);
    const [notice, setNotice] = useState("");

    const load = useCallback(async () => {
        setLoading(true); setError("");
        try {
            const [items, accountItems, categoryItems] = await Promise.all([getTransactions(), getAccounts(), getCategories()]);
            setTransactions(items); setAccounts(accountItems); setCategories(categoryItems);
        } catch (err) { setError(err instanceof Error ? err.message : "Unable to load transactions."); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { void load(); }, [load]);
    useEffect(() => {
        if (!deleting) return;
        const element = confirmation.current!;
        element.showModal();
        return () => element.close();
    }, [deleting]);

    async function remove() {
        if (!deleting || deleteLock.current) return;
        deleteLock.current = true; setDeleteBusy(true); setDeleteError("");
        try {
            await deleteTransaction(deleting.id);
            setDeleting(null); setNotice("Transaction deleted and account balances updated.");
            await load();
        } catch (err) { setDeleteError(err instanceof Error ? err.message : "Unable to delete transaction."); }
        finally { deleteLock.current = false; setDeleteBusy(false); }
    }

    return <div className="transactions-page">
        <div className="transactions-toolbar">
            <p>Track your income, expenses, and transfers.</p>
            <button className="transactions-primary" disabled={loading || !!error || accounts.length === 0}
                onClick={() => { setEditing(null); setFormOpen(true); setNotice(""); }}>Add transaction</button>
        </div>
        {notice && <p role="status" className="transactions-notice">{notice}</p>}
        {error && <div role="alert" className="transactions-error">{error} <button onClick={() => void load()}>Retry</button></div>}
        {loading ? <p role="status">Loading transactions…</p> : !error && <>
            {accounts.length === 0 && <p>Create an account before adding a transaction. <Link to="/accounts">Go to accounts</Link></p>}
            {transactions.length === 0 ? <div className="transactions-empty"><h2>No transactions yet</h2><p>Add your first transaction to start tracking your finances.</p></div> :
                <div className="transactions-table-wrapper"><table>
                    <caption>Transactions</caption>
                    <thead><tr><th>Date</th><th>Name</th><th>Account</th><th>Category</th><th>Type</th><th>Amount</th><th>Actions</th></tr></thead>
                    <tbody>{transactions.map(item => {
                        const source = accounts.find(a => a.id === item.sourceAccountId);
                        const destination = accounts.find(a => a.id === item.destinationAccountId);
                        const currency = (source ?? destination)?.currency ?? "";
                        return <tr key={item.id}>
                            <td>{item.date}</td><td>{item.description || "—"}</td>
                            <td>{item.type === "Transfer" ? `${source?.name} → ${destination?.name}` : (source ?? destination)?.name}</td>
                            <td>{categories.find(c => c.id === item.categoryId)?.name ?? "—"}</td>
                            <td><span className={`transaction-badge transaction-badge--${item.type.toLowerCase()}`}>{item.type}</span></td>
                            <td className="transactions-amount">{item.type === "Expense" ? "−" : item.type === "Income" ? "+" : ""}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</td>
                            <td><div className="transactions-row-actions"><button onClick={() => { setEditing(item); setFormOpen(true); }}>Edit</button>
                                <button onClick={() => { setDeleteError(""); setDeleting(item); }}>Delete</button></div></td>
                        </tr>;
                    })}</tbody>
                </table></div>}
        </>}
        {formOpen && <TransactionForm accounts={accounts} transaction={editing} onClose={() => setFormOpen(false)} onSaved={() => {
            setFormOpen(false); setNotice("Transaction saved and account balances updated."); void load();
        }} />}
        {deleting && <dialog ref={confirmation} className="transaction-dialog transaction-dialog--small" aria-labelledby="delete-transaction-title"
            onCancel={event => { event.preventDefault(); if (!deleteBusy) setDeleting(null); }}>
            <h2 id="delete-transaction-title">Delete transaction?</h2>
            <p>“{deleting.description || deleting.type}” will be removed and its effect on account balances reversed.</p>
            {deleteError && <p role="alert" className="transactions-error">{deleteError}</p>}
            <div className="transaction-dialog__actions"><button disabled={deleteBusy} onClick={() => setDeleting(null)}>Cancel</button>
                <button className="transactions-danger" disabled={deleteBusy} onClick={() => void remove()}>{deleteBusy ? "Deleting…" : "Delete transaction"}</button></div>
        </dialog>}
    </div>;
}
