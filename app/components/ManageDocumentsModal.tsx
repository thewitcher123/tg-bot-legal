// app/components/ManageDocumentsModal.tsx
// ✅ ПОЛНЫЙ КОД с исправленной высотой, скроллом и sticky футером

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
    onSave: (documents: Document[]) => Promise<void>;
};

export function ManageDocumentsModal({
                                         open,
                                         packageId,
                                         packageName,
                                         onClose,
                                         onSave,
                                     }: Props) {
    const [allDocuments, setAllDocuments] = useState<Document[]>([]);
    const [connectedDocuments, setConnectedDocuments] = useState<string[]>([]);
    const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Загружаем документы и связи
    useEffect(() => {
        if (!open) return;

        Promise.all([
            fetch("/api/admin/documents"),
            fetch(`/api/admin/document-package/${packageId}`),
        ]).then(([allRes, connectedRes]) =>
            Promise.all([allRes.json(), connectedRes.json()]).then(([allDocs, connected]) => {
                setAllDocuments(allDocs);
                setConnectedDocuments(connected.map((doc: any) => doc.id));
                setSelectedDocuments([]);
            })
        );
    }, [open, packageId]);

    const availableDocuments = allDocuments.filter(
        (doc) => !connectedDocuments.includes(doc.id)
    );

    const handleSave = async () => {
        if (selectedDocuments.length === 0) return;

        setIsSaving(true);
        try {
            await onSave(selectedDocuments);
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
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative z-50 w-full max-w-4xl h-[85vh] max-h-[85vh] flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl shadow-black/70 overflow-hidden mx-auto"
            >
                {/* Header - фиксированный */}
                <div className="p-6 border-b border-zinc-800 flex-shrink-0">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-zinc-100">
                                Manage Documents
                            </h3>
                            <p className="text-zinc-400 mt-1">
                                Package: <span className="font-semibold text-zinc-200">"{packageName}"</span>
                                <span className="ml-4 text-sm bg-zinc-800/50 px-2 py-1 rounded-full">
                  {connectedDocuments.length} documents assigned
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

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-6 pb-20">
                    {availableDocuments.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="mx-auto w-20 h-20 bg-zinc-900/50 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-zinc-600"
                                     fill="none"
                                     stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={1}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-zinc-100 mb-2">
                                All documents assigned
                            </h4>
                            <p className="text-zinc-500 max-w-md mx-auto">
                                This package already contains all available documents.
                            </p>
                        </div>
                    ) : (
                        <>
                            <label className="mb-4 block text-sm font-semibold uppercase tracking-wide text-zinc-300">
                                Available Documents ({availableDocuments.length})
                            </label>
                            <MultiSelectDocumentDropdown
                                documents={availableDocuments}
                                selected={selectedDocuments}
                                onChange={setSelectedDocuments}
                            />
                            {selectedDocuments.length > 0 && (
                                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                      {selectedDocuments.length}
                    </span>
                                        <span className="text-zinc-200 font-medium">
                      documents selected
                    </span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Sticky Footer - всегда виден */}
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
                            disabled={selectedDocuments.length === 0 || isSaving}
                            className="flex-1 px-8 py-3 rounded-xl border border-emerald-600 bg-gradient-to-r from-emerald-600 to-emerald-500 text-sm font-semibold text-emerald-50 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-500 hover:to-emerald-400 backdrop-blur-sm transition-all disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-400 sm:flex-none"
                        >
                            {isSaving
                                ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4"
                                             fill="none"
                                             viewBox="0 0 24 24">
                                            <circle cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    pathLength="0"
                                                    className="opacity-25"/>
                                            <path fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    `Add ${selectedDocuments.length || 0} document${selectedDocuments.length !== 1 ? "s" : ""}`
                                )
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
