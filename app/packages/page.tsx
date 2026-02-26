// app/components/PackagesTable.tsx
"use client";

import {useEffect, useState} from "react";
import {SafePackage} from "@/app/api/admin/packages/route";

import {PackagesTable} from "@/app/components/PackagesTable";

export default function AdminDocumentsPage() {
    const [packages, setPackages] = useState<SafePackage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPackages = async () => {
        try {
            const res = await fetch("/api/admin/packages");
            const data: SafePackage[] = await res.json();
            setPackages(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    if (loading) return <div>Loading…</div>;
    return (
        <>
            <main className="p-6">
                <ul className="space-y-2">
                    <PackagesTable initialPackages={packages}
                                   fetchPackages={fetchPackages}/>
                </ul>
            </main>
        </>
    );
}