import {Prisma} from '@prisma/client'
import prisma from '@/app/utils/prismadb';

export async function grantOrExtendAccess(
    tx: Prisma.TransactionClient,
    userId: string,
    documentId: string,
    durationDays: number
) {
    const existingAccess = await tx.documentAccess.findUnique({
        where: {
            userId_documentId: {
                userId,
                documentId
            }
        }
    })

    const now = new Date()

    if (!existingAccess) {
        return tx.documentAccess.create({
            data: {
                userId,
                documentId,
                expiresAt: addDays(now, durationDays)
            }
        })
    }

    const baseDate =
        existingAccess.expiresAt > now
            ? existingAccess.expiresAt
            : now

    return tx.documentAccess.update({
        where: {id: existingAccess.id},
        data: {
            expiresAt: addDays(baseDate, durationDays)
        }
    })
}

function addDays(date: Date, days: number) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

export async function checkDocumentAccess(
    userId: string,
    documentId: string
) {
    const access = await prisma.documentAccess.findUnique({
        where: {
            userId_documentId: {
                userId,
                documentId
            }
        }
    })

    if (!access || access.expiresAt < new Date()) {
        return false
    }

    return true
}

export async function getActiveDocuments(userId: string) {
    const now = new Date()

    const accesses = await prisma.documentAccess.findMany({
        where: {
            userId,
            expiresAt: {
                gt: now
            }
        },
        include: {
            document: true
        }
    })

    return accesses.map(a => a.document)
}