import prisma from '@/app/utils/prismadb';
import {Document} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server'

export type SafeDocument = Omit<Document, 'createdAt'> & {
    createdAt: string;
};

export async function POST(req: NextRequest) {
    const body = await req.json();
    const {
        title,
        description,
        fileUrl
    } = body;

    const doc = await prisma.document.create({
        data: {
            title,
            description: description ?? null,
            fileUrl,
        },
    });

    return NextResponse.json(doc);
}

export async function GET() {
    const documents = await prisma.document.findMany({
        orderBy: {createdAt: 'desc'}
    })

    return NextResponse.json(documents)
}

export async function PATCH(
    req: NextRequest,
    {params}: { params: { id: string } }
) {
    const body = await req.json()

    const updated = await prisma.document.update({
        where: {id: params.id},
        data: body
    })

    return NextResponse.json(updated)
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
) {
    await prisma.document.delete({
        where: {id: params.id}
    })

    return NextResponse.json({success: true})
}