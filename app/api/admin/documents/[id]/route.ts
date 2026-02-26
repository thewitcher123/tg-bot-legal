import prisma from '@/app/utils/prismadb';
import {NextRequest, NextResponse} from 'next/server'

export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params;
        await prisma.document.delete({where: {id}});
        return NextResponse.json({success: true});
    } catch (error) {
        return NextResponse.json({error: "Not found"}, {status: 404});
    }
}

export async function PUT(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params;
        const {
            title,
            description,
            fileUrl
        } = await request.json();

        // Обновляем
        const updated = await prisma.document.update({
            where: {id},
            data: {
                title,
                description,
                fileUrl
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Document update error:", error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}