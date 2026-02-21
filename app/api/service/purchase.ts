import prisma from '@/app/utils/prismadb';
import {grantOrExtendAccess} from './access';

export async function createPurchase(
    userId: string,
    packageId: string
) {
    return prisma.$transaction(async (tx) => {

        // search for the document package id
        const pkg = await tx.package.findUnique({
            where: {id: packageId}
        });

        console.log({
            msg: 'LOG createPurchase -> pkg',
            pkg,
        });

        if (!pkg) {
            throw new Error('Package not found')
        }

        // delete old unpaid purchases (older than 30 minutes)
        await tx.purchase.deleteMany({
            where: {
                userId,
                packageId,
                paid: false,
                createdAt: {
                    lt: new Date(Date.now() - 1000 * 60 * 30)
                }
            }
        });

        // check if we have fresh unpaid purchase
        const existingPending = await tx.purchase.findFirst({
            where: {
                userId,
                packageId,
                paid: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log({
            msg: 'LOG createPurchase -> existingPending',
            existingPending,
        });

        if (existingPending) {
            return existingPending
        }

        // create new purchase
        const purchase = await tx.purchase.create({
            data: {
                userId,
                packageId,
                amount: pkg.price,
                currency: pkg.currency,
                paid: false
            }
        });
        console.log({
            msg: 'LOG createPurchase -> purchase',
            purchase,
        });

        return purchase;
    })
}

export async function confirmPurchase(purchaseId: string) {
    return prisma.$transaction(async (tx) => {
        // search for the purchase
        const purchase = await tx.purchase.findUnique({
            where: {id: purchaseId},
            include: {
                package: {
                    select: {
                        name: true,
                        price: true,
                        currency: true,
                        duration: true,
                    }
                }
            }
        });

        console.log({
            msg: 'LOG confirmPurchase -> purchase',
            purchase,
        });

        if (!purchase) {
            throw new Error('Purchase not found')
        }

        // no extra confirmation is needed
        if (purchase.paid) {
            return purchase
        }

        // confirm purchase payment
        await tx.purchase.update({
            where: {id: purchaseId},
            data: {
                paid: true,
                paidAt: new Date()
            }
        })

        const durationDays = purchase.package.duration;

        // get all package documents
        const packageDocuments = await tx.documentPackage.findMany({
            where: {
                packageId: purchase.packageId
            }
        });

        console.log({
            msg: 'LOG confirmPurchase -> packageDocuments',
            packageDocuments,
        });

        // grant access to each document from the package
        for (const document of packageDocuments) {
            await grantOrExtendAccess(
                tx,
                purchase.userId,
                document.documentId,
                durationDays
            )
        }

        return purchase
    })
}
