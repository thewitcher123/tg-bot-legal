// app/components/ManageDocumentsModal.tsx — ИСПРАВЛЕННАЯ ВЕРСИЯ
"use client";

import {useState, useEffect} from "react";
import {MultiSelectDocumentDropdown} from "@/app/components/MultiselectDropdown";

type Document = {
    id: string;
    title: string;
    description?: string;
};

type Props = {
    open: boolean;
    packageId: string;
    packageName: string;
    onClose: () => void;
    onSave: (addedDocuments: Document[]) => Promise<void>; // только новые
};

export function ManageDocumentsModal({
                                         open,
                                         packageId,
                                         packageName,
                                         onClose,
                                         onSave,
                                     }: Props) {
    const [allDocuments, setAllDocuments] = useState<Document[]>([]);
    const [connectedDocuments, setConnectedDocuments] = useState<Document[]>([]); // ✅ ПРИВЯЗАННЫЕ
    const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]); // новые
    const [isSaving, setIsSaving] = useState(false);

    // Загружаем ВСЕ документы + привязанные к пакету
    useEffect(() => {
        if (!open) return;

        Promise.all([
            fetch("/api/admin/documents"),
            fetch(`/api/admin/document-package/${packageId}`),
        ]).then(([allRes, connectedRes]) =>
            Promise.all([allRes.json(), connectedRes.json()]).then(([allDocs, connected]) => {
                setAllDocuments(allDocs);

                // ✅ 1. Преобразуем connected в Document[]
                const connectedDocs = connected.map((item: any) => (item.document));

                setConnectedDocuments(connectedDocs);

                // ✅ 2. НЕМЕДЛЕННО устанавливаем selectedDocuments
                setSelectedDocuments(connectedDocs);
            })
        );
    }, [open, packageId]);

    const handleSave = async () => {
        // ✅ Отправляем ТОЛЬКО новые (не были привязаны ранее)
        const newlyAdded = selectedDocuments.filter(
            (doc) => !connectedDocuments.some((cd) => cd.id === doc.id)
        );

        if (newlyAdded.length === 0) {
            onClose(); // просто закрываем если ничего не добавили
            return;
        }

        setIsSaving(true);
        try {
            await onSave(newlyAdded);
            onClose();
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex p-4 sm:p-8 items-center justify-center">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
            />
            <div className="relative z-50 w-full max-w-4xl h-[85vh] max-h-[85vh] flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl shadow-black/70 overflow-hidden mx-auto">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex-shrink-0">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-zinc-100">Manage Documents</h3>
                            <p className="text-zinc-400 mt-1">
                                Package: <span className="font-semibold text-zinc-200">&#34;{packageName}&#34;</span>
                                <span className="ml-4 text-sm bg-zinc-800/50 px-2 py-1 rounded-full">
                  {connectedDocuments.length} assigned
                </span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-all flex-shrink-0"
                            disabled={isSaving}
                        >
                            <svg className="h-5 w-5"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 pb-20">
                    <MultiSelectDocumentDropdown
                        documents={allDocuments} // ВСЕ документы
                        selected={selectedDocuments} // ✅ Привязанные по умолчанию
                        onChange={setSelectedDocuments}
                    />

                    {selectedDocuments.length > 0 && (
                        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  {selectedDocuments.length}
                </span>
                                <span className="text-zinc-200 font-medium">
                  documents selected ({connectedDocuments.length} assigned)
                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky Footer */}
                <div className="border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-lg p-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-900/50 text-sm font-medium text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800/50 backdrop-blur-sm transition-all disabled:opacity-50 sm:flex-none"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 px-8 py-3 rounded-xl border border-emerald-600 bg-gradient-to-r from-emerald-600 to-emerald-500 text-sm font-semibold text-emerald-50 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-500 hover:to-emerald-400 backdrop-blur-sm transition-all disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-400 sm:flex-none"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
