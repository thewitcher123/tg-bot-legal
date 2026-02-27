"use client";

import {useState} from "react";

type Document = {
    id: string;
    title: string;
    description?: string;
};

type Props = {
    documents: Document[];
    selected: Document[];
    onChange: (selected: Document[]) => void;
    disabled?: boolean;
};

export function MultiSelectDocumentDropdown({
                                                documents,
                                                selected,
                                                onChange,
                                                disabled,
                                            }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = documents.filter((doc) =>
        doc.title.toLowerCase().includes(search.toLowerCase())
    );

    const toggleDocument = (doc: Document) => {
        if (selected.some((s) => s.id === doc.id)) {
            onChange(selected.filter((s) => s.id !== doc.id));
        } else {
            onChange([...selected, doc]);
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-left text-sm text-zinc-100 shadow-inner focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {selected.length === 0
                    ? "Choose documents..."
                    : `${selected.length} document${selected.length !== 1 ? "s" : ""} selected`}
                <svg
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-64 overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60">
                    {/* Search */}
                    <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm p-3">
                        <div className="relative">
                            <svg
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-4 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="py-2">
                        {filtered.map((doc) => {
                            const isSelected = selected.find((s) => s.id === doc.id);
                            return (
                                <button
                                    key={doc.id}
                                    type="button"
                                    onClick={() => toggleDocument(doc)}
                                    className="flex w-full items-center gap-3 px-4 py-3 hover:bg-zinc-900/50"
                                >
                                    <div className="flex h-5 w-5 items-center justify-center rounded border-2 transition-all">
                                        {isSelected ? (
                                            <svg
                                                className="h-3 w-3 text-emerald-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <div className="h-2 w-2 rounded-full bg-transparent"/>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 truncate">
                                        <div className="font-medium text-zinc-100 truncate">
                                            {doc.title}
                                        </div>
                                        {doc.description && (
                                            <div className="text-xs text-zinc-500 truncate">
                                                {doc.description}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}