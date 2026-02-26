"use client";

import {useEffect, useState} from "react";

export interface DocumentEditable {
    id?: string;
    title: string;
    description?: string | null;
    fileUrl: string;
}

interface DocumentEditModalProps {
    open: boolean;
    initialValue?: DocumentEditable;
    onClose: () => void;
    onSave: (data: DocumentEditable) => void | Promise<void>;
}

export function DocumentEditModal({
                                      open,
                                      initialValue,
                                      onClose,
                                      onSave,
                                  }: DocumentEditModalProps) {
    const [title, setTitle] = useState(initialValue?.title ?? "");
    const [description, setDescription] = useState(
        initialValue?.description ?? ""
    );
    const [fileUrl, setFileUrl] = useState(initialValue?.fileUrl ?? "");
    const [isSaving, setIsSaving] = useState(false);

    // ресет при открытии/смене initialValue
    useEffect(() => {
        if (!open) return;
        setTitle(initialValue?.title ?? "");
        setDescription(initialValue?.description ?? "");
        setFileUrl(initialValue?.fileUrl ?? "");
        setIsSaving(false);
    }, [open, initialValue]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !fileUrl.trim()) return;

        try {
            setIsSaving(true);
            await onSave({
                id: initialValue?.id,
                title: title.trim(),
                description: description.trim() || undefined,
                fileUrl: fileUrl.trim(),
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* dialog */}
            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-2xl shadow-black/60">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-100">
                            {initialValue?.id ? "Edit document" : "New document"}
                        </h2>
                        <p className="mt-1 text-xs text-zinc-400">
                            Update the document metadata and storage link.
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
                    {/* Title */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 shadow-inner shadow-black/40 outline-none ring-0 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Privacy Policy"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Description
                        </label>
                        <textarea
                            className="min-h-[80px] w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 shadow-inner shadow-black/40 outline-none ring-0 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Политика конфиденциальности"
                        />
                    </div>

                    {/* File URL */}
                    <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                            File URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 shadow-inner shadow-black/40 outline-none ring-0 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            placeholder="https://s3.amazonaws.com/bucket/path/to/file.pdf"
                            required
                        />
                        <p className="mt-1 text-[11px] text-zinc-500">
                            Link to file in S3 or other storage.
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
                            disabled={isSaving || !title.trim() || !fileUrl.trim()}
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-emerald-50 shadow-md shadow-emerald-500/40 hover:border-emerald-500 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-400"
                        >
                            {isSaving ? "Saving…" : initialValue?.id ? "Save changes" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}