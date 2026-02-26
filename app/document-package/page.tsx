"use client";

import {useState, useEffect} from "react";
import {DocumentPackageTable, PackageWithDocs} from "@/app/components/DocumentPackageTable";

export default function DocumentPackagePage() {
    const [packagesData, setPackagesData] = useState<PackageWithDocs[]>([]);
    const [allDocs, setAllDocs] = useState<Document[]>([]);

    /*useEffect(() => {
        fetch("/api/admin/document-package") // см. API ниже
            .then((res) => res.json())
            .then(setPackages);
    }, []);*/
    useEffect(() => {
        Promise.all([
            fetch("/api/admin/document-package"),
            fetch("/api/admin/documents"),
        ]).then(([packagesRes, docsRes]) =>
            Promise.all([packagesRes.json(), docsRes.json()]).then(
                ([packages, docs]) => {
                    setPackagesData(packages);
                    setAllDocs(docs);
                }
            )
        );
    }, []);
    return <DocumentPackageTable packages={packagesData}
                                 allDocuments={allDocs}/>
}