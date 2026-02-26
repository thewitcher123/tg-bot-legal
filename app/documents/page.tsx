"use client";

import {useEffect, useState} from "react";
import {SafeDocument} from "@/app/api/admin/documents/route";
import {DocumentsTable} from "@/app/components/DocumentsTable";

export default function AdminDocumentsPage() {
    const [docs, setDocs] = useState<SafeDocument[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            const res = await fetch("/api/admin/documents");
            const data: SafeDocument[] = await res.json();
            setDocs(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    if (loading) return <div>Loading…</div>;
    return (
        <>
            <main className="p-6">
                <ul className="space-y-2">
                    <DocumentsTable documents={docs}
                                    fetchDocuments={fetchDocuments}/>
                </ul>
            </main>
        </>
    );
}