import { useEffect, useId, useRef, useState } from "react";
import { createCategory, getCategories, type Category } from "../services/categoryService";
import "./CategoryField.css";

interface CategoryFieldProps {
    value: number | null;
    onChange: (id: number | null) => void;
    required?: boolean;
    disabled?: boolean;
    onBusyChange?: (busy: boolean) => void;
}

export default function CategoryField({ value, onChange, required = false, disabled = false, onBusyChange }: CategoryFieldProps) {
    const id = useId();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState("");
    const [saveError, setSaveError] = useState("");
    const [saving, setSaving] = useState(false);
    const [announcement, setAnnouncement] = useState("");
    const savingRef = useRef(false);
    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        const controller = new AbortController();
        getCategories(controller.signal).then(items => {
            if (!controller.signal.aborted) setCategories(items);
        }).catch(error => {
            if (!controller.signal.aborted) {
                setLoadError(error instanceof Error ? error.message : "Unable to load categories.");
            }
        }).finally(() => {
            if (!controller.signal.aborted) setLoading(false);
        });
        return () => controller.abort();
    }, [attempt]);

    function cancel() {
        if (savingRef.current) return;
        setAdding(false);
        setName("");
        setSaveError("");
        selectRef.current?.focus();
    }

    async function addCategory() {
        if (savingRef.current) return;
        const trimmed = name.trim();
        if (!trimmed || trimmed.length > 100) {
            setSaveError("Enter a category name between 1 and 100 characters.");
            return;
        }
        savingRef.current = true;
        setSaving(true);
        onBusyChange?.(true);
        setSaveError("");
        try {
            const category = await createCategory(trimmed);
            setCategories(items => [...items.filter(item => item.id !== category.id), category]);
            onChange(category.id);
            setAdding(false);
            setName("");
            setAnnouncement(`${category.name} created and selected.`);
            selectRef.current?.focus();
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : "Unable to create category.");
        } finally {
            savingRef.current = false;
            setSaving(false);
            onBusyChange?.(false);
            requestAnimationFrame(() => selectRef.current?.focus());
        }
    }

    return (
        <div className="category-field">
            <label htmlFor={id}>Category{required ? " *" : " (optional)"}</label>
            <select
                ref={selectRef}
                id={id}
                value={value ?? ""}
                required={required}
                disabled={loading || !!loadError || saving || disabled}
                aria-describedby={loadError ? `${id}-load-error` : undefined}
                onChange={event => {
                    if (event.target.value === "add") {
                        setAdding(true);
                        setSaveError("");
                        setAnnouncement("");
                    } else {
                        onChange(event.target.value === "" ? null : Number(event.target.value));
                    }
                }}
            >
                <option value="">{loading ? "Loading categories…" : "Select a category"}</option>
                {[...categories].sort((a, b) => a.name.localeCompare(b.name)).map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}{category.isDefault ? " (default)" : ""}
                    </option>
                ))}
                <option value="add">+ Create new category</option>
            </select>

            {loadError && <div id={`${id}-load-error`} role="alert" className="category-field__error">
                {loadError} <button type="button" onClick={() => {
                    setLoading(true);
                    setLoadError("");
                    setAttempt(current => current + 1);
                }}>Retry</button>
            </div>}
            {!loading && !loadError && categories.length === 0 &&
                <p>No categories yet. Choose “Create new category” to add one.</p>}

            {adding && <div className="category-field__create" role="group" aria-labelledby={`${id}-name-label`}>
                <label id={`${id}-name-label`} htmlFor={`${id}-name`}>New category name</label>
                <input
                    id={`${id}-name`}
                    autoFocus
                    maxLength={100}
                    value={name}
                    disabled={saving || disabled}
                    aria-invalid={!!saveError}
                    aria-describedby={saveError ? `${id}-save-error` : undefined}
                    placeholder="e.g. Pets"
                    onChange={event => { setName(event.target.value); setSaveError(""); }}
                    onKeyDown={event => {
                        if (event.key === "Enter") { event.preventDefault(); void addCategory(); }
                        if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); cancel(); }
                    }}
                />
                {saveError && <p id={`${id}-save-error`} role="alert" className="category-field__error">{saveError}</p>}
                <div className="category-field__actions">
                    <button type="button" disabled={saving || disabled} onClick={cancel}>Cancel category</button>
                    <button type="button" className="category-field__save" disabled={saving || disabled} onClick={() => void addCategory()}>
                        {saving ? "Creating…" : "Create category"}
                    </button>
                </div>
            </div>}
            <span className="category-field__announcement" role="status">{announcement}</span>
        </div>
    );
}
