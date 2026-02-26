import {useState} from "react";

import {SafeDocument} from "@/app/api/admin/documents/route";
import {DocumentEditModal, DocumentEditable} from "@/app/components/DocumentModal";
import {DeleteModal} from "@/app/components/DeleteModal";

type Props = {
    documents: SafeDocument[];
    fetchDocuments?: () => Promise<void>;
};

export function DocumentsTable({
                                   documents,
                                   fetchDocuments
                               }: Props) {
    const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
    const [editingDoc, setEditingDoc] = useState<DocumentEditable | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleCreateClick = () => {
        setIsCreateOpen(true);
    };

    const handleSave = async (data: DocumentEditable) => {
        const res = await fetch(`/api/admin/documents/${data.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });

        if (!res) {
            // TODO: toast / error handling
            return;
        }
        const created = (await res.json()) as SafeDocument;
        console.log({
            msg: 'Document created successfully.',
            created
        })
        if (fetchDocuments) {
            fetchDocuments();
        }
    };

    const handleSaveNew = async (data: DocumentEditable) => {
        // POST /api/documents
        const res = await fetch("/api/admin/documents", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });

        if (!res) {
            // TODO: toast / error handling
            return;
        }
        const created = (await res.json()) as SafeDocument;
        console.log({
            msg: 'Document created successfully.',
            created
        })
        if (fetchDocuments) {
            fetchDocuments();
        }
    };
    const tryDeleteDocument = async () => {
        if (!deleteDocId) return;

        try {
            const res = await fetch(`/api/admin/documents/${deleteDocId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                // Откат при ошибке
                throw new Error("Failed to delete");
            }
            if (fetchDocuments) {
                fetchDocuments();
            }
        } catch (error) {
            // Откат при ошибке
            if (fetchDocuments) {
                fetchDocuments();
            }
        }
    };
    const deleteDocumentTitle = documents.find((d) => d.id === deleteDocId)?.title ?? "document";
    return (
        <>
            <DeleteModal
                open={!!deleteDocId}
                title={`"${deleteDocumentTitle}" document`}
                onClose={() => setDeleteDocId(null)}
                onConfirm={tryDeleteDocument}
            />
            <DocumentEditModal
                open={isCreateOpen}
                initialValue={undefined}
                onClose={() => setIsCreateOpen(false)}
                onSave={async (data) => {
                    await handleSaveNew(data);
                    setIsCreateOpen(false);
                }}
            />
            <DocumentEditModal
                open={!!editingDoc}
                initialValue={editingDoc ?? undefined}
                onClose={() => setEditingDoc(null)}
                onSave={handleSave}
            />
            <button
                type="button"
                onClick={handleCreateClick}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-emerald-50 shadow-md shadow-emerald-500/40 hover:border-emerald-500 hover:bg-emerald-500"
            >
                <span className="text-sm">＋</span>
                New document
            </button>
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-lg shadow-black/40 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-100">
                            Documents
                        </h2>
                        <p className="text-xs text-zinc-400">
                            {documents.length} item{documents.length !== 1 ? "s" : ""} total
                        </p>
                    </div>
                    {/* optional: actions, filters, search */}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead>
                        <tr className="bg-zinc-900/70">
                            <th className="sticky top-0 z-10 border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Title
                            </th>
                            <th className="sticky top-0 z-10 border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Description
                            </th>
                            <th className="sticky top-0 z-10 border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Created
                            </th>
                            <th className="sticky top-0 z-10 border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400 text-right">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {documents.map((doc, idx) => {
                            const created = new Date(doc.createdAt);
                            const isOdd = idx % 2 === 1;

                            return (
                                <tr
                                    key={doc.id}
                                    className={`transition-colors ${
                                        isOdd ? "bg-zinc-950/40" : "bg-zinc-950/0"
                                    } hover:bg-zinc-800/40`}
                                >
                                    <td className="max-w-xs border-b border-zinc-900 px-4 py-3 align-top text-sm text-zinc-100">
                                        <div className="flex items-center gap-3">
                      <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-zinc-800 text-[10px] font-semibold uppercase text-zinc-200">
                        {doc.title.slice(0, 2)}
                      </span>
                                            <div className="space-y-0.5">
                                                <div className="font-medium leading-tight">
                                                    {doc.title}
                                                </div>
                                                <a
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200"
                                                >
                                                    <span className="h-1 w-1 rounded-full bg-emerald-400"/>
                                                    Open file
                                                </a>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="max-w-md border-b border-zinc-900 px-4 py-3 align-top text-xs text-zinc-300">
                                        <p className="line-clamp-2">{doc.description}</p>
                                    </td>

                                    <td className="whitespace-nowrap border-b border-zinc-900 px-4 py-3 align-top text-xs text-zinc-400">
                                        <div>{created.toLocaleDateString()}</div>
                                        <div className="text-[11px] text-zinc-500">
                                            {created.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </td>

                                    <td className="border-b border-zinc-900 px-4 py-3 align-top text-right text-xs">
                                        <div className="inline-flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-100 shadow-sm hover:border-zinc-500 hover:bg-zinc-800"
                                                onClick={() => setEditingDoc(doc)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="rounded-md border border-red-900/70 bg-red-950/40 px-2.5 py-1 text-xs font-medium text-red-200 hover:border-red-700 hover:bg-red-900/60"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteDocId(doc.id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {documents.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-10 text-center text-sm"
                                >
                                    No documents yet. Upload your first one to see it here.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}