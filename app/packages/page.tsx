// app/components/PackagesTable.tsx
"use client";

import {useEffect, useState} from "react";
import {SafePackage} from "@/app/api/admin/packages/route";
import {NavBar} from "@/app/components/NavBar";

export default function AdminDocumentsPage() {
    const [packages, setPackages] = useState<SafePackage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/admin/packages");
                const data: SafePackage[] = await res.json();
                setPackages(data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div>Loading…</div>;
    return (
        <>
            <NavBar/>
            <main className="p-6">
                <ul className="space-y-2">
                    <PackagesTable packages={packages}/>
                </ul>
            </main>
        </>
    );
}

type Props = {
    packages: SafePackage[];
};

export function PackagesTable({packages}: Props) {
    return (
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-lg shadow-black/40 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <div>
                    <h2 className="text-sm font-semibold text-zinc-100">Packages</h2>
                    <p className="text-xs text-zinc-400">
                        {packages.length} package{packages.length !== 1 ? "s" : ""} total
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                    <thead>
                    <tr className="bg-zinc-900/70">
                        <th className="sticky top-0 z-10 border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Name
                        </th>
                        <th className="sticky top-0 z-10 border-b border-zinc-800 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Price
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
                    {packages.map((pkg, idx) => {
                        const isOdd = idx % 2 === 1;
                        const formattedPrice = new Intl.NumberFormat("ru-RU", {
                            style: "currency",
                            currency: pkg.currency,
                        }).format(pkg.price / 100); // assuming cents

                        return (
                            <tr
                                key={pkg.id}
                                className={`transition-colors ${
                                    isOdd ? "bg-zinc-950/40" : "bg-zinc-950/0"
                                } hover:bg-zinc-800/40`}
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
                                    <div className="inline-flex items-baseline gap-1">
                                        {formattedPrice}
                                        <span className="text-xs text-zinc-400">/{pkg.duration}d</span>
                                    </div>
                                </td>

                                <td className="whitespace-nowrap border-b border-zinc-900 px-4 py-3 align-top text-sm text-zinc-300">
                                    <div className="font-mono text-xs">{pkg.duration} days</div>
                                    <div className="text-[11px] text-zinc-500">
                                        {Math.round(pkg.duration / 30.42)} months
                                    </div>
                                </td>

                                <td className="border-b border-zinc-900 px-4 py-3 align-top text-right text-xs">
                                    <div className="inline-flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-100 shadow-sm hover:border-zinc-500 hover:bg-zinc-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-md border border-red-900/70 bg-red-950/40 px-2.5 py-1 text-xs font-medium text-red-200 hover:border-red-700 hover:bg-red-900/60"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}

                    {packages.length === 0 && (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-4 py-10 text-center text-sm text-zinc-500"
                            >
                                No packages yet. Add your first one to see it here.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}