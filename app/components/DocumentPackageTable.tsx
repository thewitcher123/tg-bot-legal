"use client";

import {useState, Fragment} from "react";
import {MultiSelectDocumentDropdown} from "@/app/components/MultiselectDropdown";
import {ManageDocumentsModal} from "@/app/components/ManageDocumentsModal";

type Document = {
    id: string;
    title: string;
    description?: string;
};

type PackageWithDocs = {
    id: string;
    name: string;
    priceRub: number;
    priceEur: number;
    duration: number;
    documentCount: number;
    documents: Document[];
};

type Props = {
    packages: PackageWithDocs[];
    allDocuments: Document[]; // все доступные документы для мультиселекта
};

export function DocumentPackageTable({
                                         packages,
                                         allDocuments
                                     }: Props) {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [managingPackage, setManagingPackage] = useState<PackageWithDocs | null>(null);
    const [manageModalOpen, setManageModalOpen] = useState<string | null>(null);

    const toggleRow = (packageId: string) => {
        setExpandedRow(expandedRow === packageId ? null : packageId);
    };

    const handleManageDocuments = (pkg: PackageWithDocs) => {
        setManagingPackage(pkg);
        setManageModalOpen(pkg.id);
    };

    const handleSaveDocuments = async (selectedDocuments: Document[]) => {
        if (!managingPackage || selectedDocuments.length === 0) return;

        try {
            const res = await fetch("/api/admin/document-package", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    packageId: managingPackage.id,
                    documentIds: selectedDocuments.map((d) => d.id),
                }),
            });

            if (res.ok) {
                // Перезагружаем данные (или обновляем локально)
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to save:", error);
        }
    };

    const manageDocumentsModal = manageModalOpen && (
        <ManageDocumentsModal
            open={true}
            packageId={manageModalOpen}
            packageName={packages.find((p) => p.id === manageModalOpen)?.name || ""}
            onClose={() => setManageModalOpen(null)}
            onSave={handleSaveDocuments}
        />
    );

    return (
        <>
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-lg shadow-black/40 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-100">Package Associations</h2>
                        <p className="text-xs text-zinc-400">
                            {packages.reduce((sum, p) => sum + p.documentCount, 0)} total connections
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead>
                        <tr className="bg-zinc-900/70">
                            <th className="border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Package
                            </th>
                            <th className="border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Price
                            </th>
                            <th className="border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Duration
                            </th>
                            <th className="border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400 text-right">
                                Documents
                            </th>
                            <th className="border-b border-zinc-800 w-28 text-right"/>
                        </tr>
                        </thead>
                        <tbody>
                        {packages.map((pkg, idx) => {
                            const isOdd = idx % 2 === 1;
                            const isExpanded = expandedRow === pkg.id;
                            const priceRub = (pkg.priceRub / 100).toLocaleString("ru-RU", {
                                style: "currency",
                                currency: "RUB",
                                minimumFractionDigits: 0,
                            });
                            const priceEur = (pkg.priceEur / 100).toLocaleString("de-DE", {
                                style: "currency",
                                currency: "EUR",
                                minimumFractionDigits: 0,
                            });

                            const expandedRowHtml = isExpanded && <tr className="bg-zinc-950/30">
                                <td colSpan={5}
                                    className="p-0">
                                    <div className="overflow-hidden rounded-b-xl">
                                        <div className="border-t border-zinc-800 bg-zinc-950/50 px-4 py-4">
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                                {pkg.documents.length > 0 ? (
                                                    pkg.documents.map((doc) => (
                                                        <div
                                                            key={doc.id}
                                                            className="group rounded-lg border border-zinc-800 p-3 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all"
                                                        >
                                                            <div className="flex items-start gap-3">
                                        <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-zinc-800 text-[10px] font-semibold uppercase text-zinc-200">
                                          {doc.title.slice(0, 2)}
                                        </span>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-medium text-zinc-100 truncate">
                                                                        {doc.title}
                                                                    </div>
                                                                    {doc.description && (
                                                                        <div className="mt-1 text-xs text-zinc-500 line-clamp-2">
                                                                            {doc.description}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-span-full text-center py-8 text-sm">
                                                        No documents assigned to this package yet.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>;

                            return (
                                <Fragment key={pkg.id}>
                                    <tr
                                        className={`transition-colors border-b border-zinc-900 hover:bg-zinc-800/40 ${
                                            isOdd ? "bg-zinc-950/40" : "bg-zinc-950/0"
                                        } ${isExpanded ? "rounded-t-xl" : ""}`}
                                        onClick={() => toggleRow(pkg.id)}
                                    >
                                        <td className="max-w-xs px-4 py-4">
                                            <div className="flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-900/50 text-xs font-semibold uppercase text-emerald-300">
                            {pkg.name.slice(0, 2)}
                          </span>
                                                <div>
                                                    <div className="font-medium text-zinc-100">{pkg.name}</div>
                                                    <code className="rounded-sm bg-zinc-900 px-1.5 py-px text-[11px] font-mono text-zinc-400">
                                                        {pkg.id.slice(-6)}
                                                    </code>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 font-semibold text-zinc-100">
                                            <div>{priceRub}</div>
                                            <div>{priceEur}</div>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-zinc-300">
                                            <div className="font-mono text-sm">{pkg.duration} days</div>
                                            <div className="text-[11px] text-zinc-500">
                                                {Math.round(pkg.duration / 30.42)} months
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-right">
                                            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-100">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                            {pkg.documentCount}
                          </span>
                                                <span>documents</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                {/* Expand icon */}
                                                <svg
                                                    className={`h-4 w-4 text-zinc-500 transition-transform ${
                                                        isExpanded ? "rotate-180" : ""
                                                    }`}
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

                                                {/* Manage Documents кнопка */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // предотвращаем раскрытие строки
                                                        handleManageDocuments(pkg);
                                                    }}
                                                    className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-100 shadow-sm hover:border-zinc-500 hover:bg-zinc-800"
                                                >
                                                    Manage
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedRowHtml}
                                </Fragment>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manage Documents Modal */}
            {manageDocumentsModal}
        </>
    );
}
