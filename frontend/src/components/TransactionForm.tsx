import { useEffect, useRef, useState, type FormEvent } from "react";
import CategoryField from "./CategoryField";
import { saveTransaction, type AccountOption, type Transaction, type TransactionType } from "../services/transactionService";

interface Props {
    accounts: AccountOption[];
    transaction: Transaction | null;
    onClose: () => void;
    onSaved: () => void;
}

function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function TransactionForm({ accounts, transaction, onClose, onSaved }: Props) {
    const dialog = useRef<HTMLDialogElement>(null);
    const submitting = useRef(false);
    const [type, setType] = useState<TransactionType>(transaction?.type ?? "Expense");
    const [description, setDescription] = useState(transaction?.description ?? "");
    const [amount, setAmount] = useState(transaction?.amount.toString() ?? "");
    const [date, setDate] = useState(transaction?.date ?? today());
    const [sourceId, setSourceId] = useState(transaction?.sourceAccountId?.toString() ?? "");
    const [destinationId, setDestinationId] = useState(transaction?.destinationAccountId?.toString() ?? "");
    const [categoryId, setCategoryId] = useState<number | null>(transaction?.categoryId ?? null);
    const [savingCategory, setSavingCategory] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const busy = saving || savingCategory;
    const account = accounts.find(item => String(item.id) === (type === "Income" ? destinationId : sourceId));

    useEffect(() => {
        const element = dialog.current!;
        element.showModal();
        return () => element.close();
    }, []);

    async function submit(event: FormEvent) {
        event.preventDefault();
        if (submitting.current || savingCategory) return;
        if (type === "Expense" && categoryId === null) { setError("Select a category for this expense."); return; }
        if (type === "Transfer" && sourceId === destinationId) { setError("Choose two different accounts."); return; }
        submitting.current = true;
        setSaving(true);
        setError("");
        try {
            await saveTransaction({
                type, description, amount: Number(amount), date,
                sourceAccountId: type === "Income" ? null : Number(sourceId),
                destinationAccountId: type === "Expense" ? null : Number(destinationId),
                categoryId: type === "Transfer" ? null : categoryId,
            }, transaction?.id);
            onSaved();
        } catch (err) { setError(err instanceof Error ? err.message : "Unable to save transaction."); }
        finally { submitting.current = false; setSaving(false); }
    }

    return <dialog ref={dialog} className="transaction-dialog" aria-labelledby="transaction-form-title"
        onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
        <form onSubmit={submit}>
            <h2 id="transaction-form-title">{transaction ? "Edit transaction" : "Create transaction"}</h2>
            {error && <p className="transactions-error" role="alert">{error}</p>}
            <div className="transaction-form__fields">
                <label htmlFor="transaction-name">Transaction name</label>
                <input id="transaction-name" autoFocus maxLength={500} value={description} disabled={busy}
                    placeholder="e.g. Groceries" onChange={event => setDescription(event.target.value)} />
                <label htmlFor="transaction-type">Type</label>
                <select id="transaction-type" value={type} disabled={busy} onChange={event => {
                    setType(event.target.value as TransactionType); setError("");
                    if (event.target.value === "Transfer") setCategoryId(null);
                }}>
                    <option>Expense</option><option>Income</option><option>Transfer</option>
                </select>
                {type !== "Income" && <>
                    <label htmlFor="transaction-source">{type === "Transfer" ? "From account" : "Account"}</label>
                    <select id="transaction-source" required value={sourceId} disabled={busy} onChange={event => setSourceId(event.target.value)}>
                        <option value="">Select an account</option>
                        {accounts.map(item => <option key={item.id} value={item.id}>{item.name} ({item.currency})</option>)}
                    </select>
                </>}
                {type !== "Expense" && <>
                    <label htmlFor="transaction-destination">{type === "Transfer" ? "To account" : "Account"}</label>
                    <select id="transaction-destination" required value={destinationId} disabled={busy} onChange={event => setDestinationId(event.target.value)}>
                        <option value="">Select an account</option>
                        {accounts.filter(item => type !== "Transfer" || String(item.id) !== sourceId).map(item =>
                            <option key={item.id} value={item.id}>{item.name} ({item.currency})</option>)}
                    </select>
                </>}
                <div className="transaction-form__row">
                    <div><label htmlFor="transaction-amount">Amount{account ? ` (${account.currency})` : ""}</label>
                        <input id="transaction-amount" type="number" required min="0.01" step="0.01" value={amount}
                            disabled={busy} onChange={event => setAmount(event.target.value)} /></div>
                    <div><label htmlFor="transaction-date">Date</label>
                        <input id="transaction-date" type="date" required value={date} disabled={busy} onChange={event => setDate(event.target.value)} /></div>
                </div>
                {type !== "Transfer" ? <CategoryField value={categoryId} onChange={setCategoryId}
                    required={type === "Expense"} disabled={saving} onBusyChange={setSavingCategory} /> :
                    <p className="transaction-form__hint">Transfers use two accounts with the same currency and have no category.</p>}
            </div>
            <div className="transaction-dialog__actions">
                <button type="button" disabled={busy} onClick={onClose}>Cancel</button>
                <button type="submit" className="transactions-primary" disabled={busy || accounts.length === 0}>
                    {saving ? "Saving…" : transaction ? "Save changes" : "Create transaction"}
                </button>
            </div>
        </form>
    </dialog>;
}
