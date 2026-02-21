import prisma from '@/app/utils/prismadb';

export async function createDocument(
    title: string,
    description: string,
    fileUrl: string,
) {
    return prisma.document.create({
        data: {
            title,
            description,
            fileUrl
        }
    })
}

export async function createDocumentAndAttach(
    title: string,
    description: string,
    fileUrl: string,
    packageIds: string[]
) {
    return prisma.$transaction(async (tx) => {

        const document = await tx.document.create({
            data: {
                title,
                description,
                fileUrl
            }
        })

        for (const packageId of packageIds) {
            await tx.documentPackage.create({
                data: {
                    packageId,
                    documentId: document.id
                }
            })
        }

        return document
    })
}