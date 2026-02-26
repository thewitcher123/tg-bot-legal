"use client";

import {DocumentsTable} from "@/app/components/DocumentsTable";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {SafeDocument} from "@/app/api/admin/documents/route";

type DocumentPackage = {
    id: string;
    packageId: string;
    documentId: string;
    document: {
        id: string;
        title: string;
        description: string;
        fileUrl: string;
        createdAt: string;
    };
};

export default function PackageDetailPage() {
    const [docs, setDocs] = useState<SafeDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const packageId = params.id as string;
    useEffect(() => {
        const load = async () => {
            try {
                // todo wrong route
                const res = await fetch(`/api/admin/document-package/${packageId}`);
                const data: SafeDocument[] = await res.json();
                setDocs(data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div>Loading…</div>;

    const packageName = docs[0]?.title;

    return (
        <>
            <main className="p-6">
                <div className="mb-8 rounded-xl bg-zinc-950/60 p-6 shadow-lg shadow-black/40 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-900/50 text-lg">
                            📦
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-100">{packageName}</h1>
                            <p className="text-sm text-zinc-400">
                                Package ID: <code className="font-mono">{packageId}</code>
                            </p>
                        </div>
                        <div className="ml-auto flex items-center gap-2 text-sm text-zinc-400">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-400">
                {docs.length}
              </span>
                            <span>Documents included</span>
                        </div>
                    </div>
                </div>

                {docs.length > 0 ? (
                    <>
                        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
                            Included Documents
                        </h2>
                        <DocumentsTable documents={docs}/>
                    </>
                ) : (
                    <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 p-12 text-center shadow-lg">
                        <div className="mx-auto h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-2xl text-zinc-500">
                            📄
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-100">
                            No documents yet
                        </h3>
                        <p className="mt-2 text-sm text-zinc-400">
                            Add documents to this package to manage them here.
                        </p>
                    </div>
                )}
            </main>
        </>
    );
}