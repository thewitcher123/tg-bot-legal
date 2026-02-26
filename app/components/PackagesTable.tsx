import {useState} from "react";

import {PackageEditModal, PackageEditable} from "@/app/components/PackageEditModal";
import {DeleteModal} from "@/app/components/DeleteModal";
import {SafePackage} from "@/app/api/admin/packages/route";
import {SafeDocument} from "@/app/api/admin/documents/route";

type Props = {
    initialPackages: SafePackage[];
    fetchPackages: () => Promise<void>;
};

export function PackagesTable({
                                  initialPackages,
                                  fetchPackages
                              }: Props) {
    const [deletePkgId, setDeletePkgId] = useState<string | null>(null);
    const [editingPackage, setEditingPackage] = useState<PackageEditable | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleCreateClick = () => {
        setIsCreateOpen(true);
    };

    const handleSaveExisting = async (data: PackageEditable) => {
        const res = await fetch(`/api/admin/packages/${data.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });

        if (!res) {
            // TODO: toast / error handling
            return;
        }
        fetchPackages();
    };

    const handleSaveNew = async (data: PackageEditable) => {
        // POST /api/packages
        const res = await fetch("/api/admin/packages", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            // TODO: toast / error handling
            return;
        }

        const created = (await res.json()) as SafePackage;

        fetchPackages();
    };

    const tryDeletePackage = async () => {
        if (!deletePkgId) return;

        try {
            const res = await fetch(`/api/admin/packages/${deletePkgId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                // Откат при ошибке
                throw new Error("Failed to delete");
            }
            fetchPackages();
        } catch (error) {
            // Откат при ошибке
            fetchPackages();
        }
    };

    const deletePackageTitle = initialPackages.find((p) => p.id === deletePkgId)?.name ?? "package";

    return (
        <>
            <DeleteModal
                open={!!deletePkgId}
                title={`"${deletePackageTitle}" package`}
                onClose={() => setDeletePkgId(null)}
                onConfirm={tryDeletePackage}
            />
            <div className="mt-6 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-zinc-100">Packages</h2>
                    <p className="text-xs text-zinc-400">
                        {initialPackages.length} package{initialPackages.length !== 1 ? "s" : ""} total
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleCreateClick}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-emerald-50 shadow-md shadow-emerald-500/40 hover:border-emerald-500 hover:bg-emerald-500"
                >
                    <span className="text-sm">＋</span>
                    New package
                </button>
            </div>

            <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-lg shadow-black/40 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead>
                        <tr className="bg-zinc-900/70">
                            <th className="sticky top-0 z-10 border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Name
                            </th>
                            <th className="sticky top-0 z-10 border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Price RUB
                            </th>
                            <th className="sticky top-0 z-10 border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Price EUR
                            </th>
                            <th className="sticky top-0 z-10 border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                                Duration
                            </th>
                            <th className="sticky top-0 z-10 border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400 text-right">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {initialPackages.map((pkg, idx) => {
                            const isOdd = idx % 2 === 1;
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

                            return (
                                <tr
                                    key={pkg.id}
                                    className={`transition-colors cursor-pointer hover:bg-zinc-800/40 ${
                                        isOdd ? "bg-zinc-950/40" : "bg-zinc-950/0"
                                    }`}
                                    onClick={() => window.location.href = `/packages/${pkg.id}`}
                                >
                                    <td className="max-w-xs border-b border-zinc-900 px-4 py-3 align-top text-sm text-zinc-100">
                                        <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-900/50 text-xs font-semibold uppercase text-emerald-300">
                          {pkg.name.slice(0, 2)}
                        </span>
                                            <div>
                                                <div className="font-medium leading-tight">{pkg.name}</div>
                                                <code className="rounded-sm bg-zinc-900 px-1.5 py-px text-[11px] font-mono text-zinc-400">
                                                    {pkg.id.slice(-6)}
                                                </code>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap border-b border-zinc-900 px-4 py-3 align-top text-sm font-semibold text-zinc-100">
                                        {priceRub}
                                    </td>

                                    <td className="whitespace-nowrap border-b border-zinc-900 px-4 py-3 align-top text-sm font-semibold text-zinc-100">
                                        {priceEur}
                                    </td>

                                    <td className="whitespace-nowrap border-b border-zinc-900 px-4 py-3 align-top text-sm text-zinc-300">
                                        <div className="font-mono text-sm">{pkg.duration} days</div>
                                        <div className="text-[11px] text-zinc-500">
                                            {Math.round(pkg.duration / 30.42)} months
                                        </div>
                                    </td>

                                    <td className="border-b border-zinc-900 px-4 py-3 align-top text-right text-xs">
                                        <div className="inline-flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingPackage(pkg);
                                                }}
                                                className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-100 shadow-sm hover:border-zinc-500 hover:bg-zinc-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="rounded-md border border-red-900/70 bg-red-950/40 px-2.5 py-1 text-xs font-medium text-red-200 hover:border-red-700 hover:bg-red-900/60"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeletePkgId(pkg.id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {initialPackages.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-10 text-center text-sm"
                                >
                                    No packages yet. Add your first one to see it here.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Edit existing */}
            <PackageEditModal
                open={!!editingPackage}
                initialValue={editingPackage ?? undefined}
                onClose={() => setEditingPackage(null)}
                onSave={handleSaveExisting}
            />

            {/* Create new */}
            <PackageEditModal
                open={isCreateOpen}
                initialValue={undefined}
                onClose={() => setIsCreateOpen(false)}
                onSave={async (data) => {
                    await handleSaveNew(data);
                    setIsCreateOpen(false);
                }}
            />
        </>
    );
}