// app/components/PackageEditModal.tsx
"use client";

import {useEffect, useState} from "react";

export type PackageEditable = {
    id?: string;
    name: string;
    priceRub: number; // хранится в копейках
    priceEur: number; // хранится в евро-центах
    duration: number; // дни
};

type PackageEditModalProps = {
    open: boolean;
    initialValue?: PackageEditable;
    onClose: () => void;
    onSave: (data: PackageEditable) => void | Promise<void>;
};

export function PackageEditModal({
                                     open,
                                     initialValue,
                                     onClose,
                                     onSave,
                                 }: PackageEditModalProps) {
    const [name, setName] = useState(initialValue?.name ?? "");

    // отображаемые значения в руб/евро
    const [priceRubDisplay, setPriceRubDisplay] = useState(
        initialValue ? (initialValue.priceRub / 100).toString() : ""
    );
    const [priceEurDisplay, setPriceEurDisplay] = useState(
        initialValue ? (initialValue.priceEur / 100).toString() : ""
    );

    const [duration, setDuration] = useState(
        initialValue ? initialValue.duration.toString() : ""
    );
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!open) return;

        setName(initialValue?.name ?? "");
        setPriceRubDisplay(
            initialValue ? (initialValue.priceRub / 100).toString() : ""
        );
        setPriceEurDisplay(
            initialValue ? (initialValue.priceEur / 100).toString() : ""
        );
        setDuration(initialValue ? initialValue.duration.toString() : "");
        setIsSaving(false);
    }, [open, initialValue]);

    if (!open) return null;

    const parseMoney = (value: string) => {
        const normalized = value.replace(",", ".").trim();
        if (!normalized) return 0;
        const num = Number(normalized);
        if (Number.isNaN(num)) return NaN;
        return Math.round(num * 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const priceRub = parseMoney(priceRubDisplay);
        const priceEur = parseMoney(priceEurDisplay);
        const durationDays = Number(duration);

        if (!name.trim()) return;
        if (Number.isNaN(priceRub) || Number.isNaN(priceEur)) return;
        if (!Number.isFinite(durationDays) || durationDays <= 0) return;

        try {
            setIsSaving(true);
            await onSave({
                id: initialValue?.id,
                name: name.trim(),
                priceRub,
                priceEur,
                duration: durationDays,
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    const isSubmitDisabled =
        !name.trim() ||
        !priceRubDisplay.trim() ||
        !priceEurDisplay.trim() ||
        !duration.trim() ||
        Number.isNaN(parseMoney(priceRubDisplay)) ||
        Number.isNaN(parseMoney(priceEurDisplay)) ||
        Number(duration) <= 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-2xl shadow-black/60">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-100">
                            {initialValue?.id ? "Edit package" : "New package"}
                        </h2>
                        <p className="mt-1 text-xs text-zinc-400">
                            Configure package name, pricing and duration.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                    >
                        <span className="sr-only">Close</span>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}
                      className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 shadow-inner shadow-black/40 outline-none ring-0 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Legal_data_pack_2026_RUB"
                            required
                        />
                    </div>

                    {/* Price RUB */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Price (RUB) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 shadow-inner shadow-black/40 outline-none ring-0 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                                value={priceRubDisplay}
                                onChange={(e) => setPriceRubDisplay(e.target.value)}
                                placeholder="8990.00"
                                inputMode="decimal"
                            />
                            <span className="text-xs text-zinc-500">₽</span>
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-500">
                            Stored as integer in kopecks (value × 100).
                        </p>
                    </div>

                    {/* Price EUR */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Price (EUR) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 shadow-inner shadow-black/40 outline-none ring-0 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                                value={priceEurDisplay}
                                onChange={(e) => setPriceEurDisplay(e.target.value)}
                                placeholder="99.00"
                                inputMode="decimal"
                            />
                            <span className="text-xs text-zinc-500">€</span>
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-500">
                            Stored as integer in euro cents (value × 100).
                        </p>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Duration (days) <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 shadow-inner shadow-black/40 outline-none ring-0 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value.replace(/[^\d]/g, ""))}
                            placeholder="365"
                            inputMode="numeric"
                        />
                        <p className="mt-1 text-[11px] text-zinc-500">
                            Example: 365 for one year access.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || isSubmitDisabled}
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-emerald-50 shadow-md shadow-emerald-500/40 hover:border-emerald-500 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-400"
                        >
                            {isSaving
                                ? "Saving…"
                                : initialValue?.id
                                    ? "Save changes"
                                    : "Create package"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
