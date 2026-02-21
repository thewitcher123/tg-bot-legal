import {Prisma} from '@prisma/client'
import {createDocument, Document} from "@/app/api/service/document";
import prisma from "@/app/utils/prismadb";
import {createPackage, getPackageByData, PackageData} from "@/app/api/service/package";


interface DocumentPackage extends Document {
    packageIds: string[];
}

export async function createPackagesAndDocuments(
    packageData: PackageData[],
    documentData: Document[],
) {
    return prisma.$transaction(async (tx) => {
        // find or create package by data
        const packageList = await tx.package.createMany({
            data: packageData
        });
        console.log({
            msg: 'LOG createPackageDocumentRelation -> packageList',
            packageList,
        });

        if (documentData.length > 0) {
            const documentList = await tx.document.createMany({
                data: documentData,
            });
            console.log({
                msg: 'LOG createPackageDocumentRelation -> documentList',
                documentList,
            });
        }
    });
}

export async function createDocumentPackageRelation(
    packageName: string,
    documentTitleList: string[],
) {
    return prisma.$transaction(async (tx) => {
        const packageList = await tx.package.findMany({
            where: {name: packageName}
        });
        console.log({
            msg: 'LOG createDocumentAndAttach -> packageList',
            packageList,
        });
        const documentTitleFilter = documentTitleList.map(item => ({title: item}));
        const documentList = await tx.document.findMany({
            where: {
                OR: documentTitleFilter,
            },
        });
        console.log({
            msg: 'LOG createDocumentAndAttach -> documentList',
            documentList,
        });
        for (const packageItem of packageList) {
            for (const documentItem of documentList) {
                await tx.documentPackage.create({
                    data: {
                        packageId: packageItem.id,
                        documentId: documentItem.id
                    }
                })
            }
        }
    })
}