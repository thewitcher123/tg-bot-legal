import prisma from '@/app/utils/prismadb';
import {NextRequest, NextResponse} from 'next/server'

export async function GET(req: NextRequest) {
    const body = await req.json()

    const {
        packageId
    } = body
    const documents = await prisma.documentPackage.findMany({
        where: {packageId},
        include: {
            document: true,
            package: true,
        }
    });
    console.log({
        msg: 'LOG TEST',
        packageId,
        documents,
    })

    return NextResponse.json(documents)
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params;
        await prisma.package.delete({where: {id}});
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
            name,
            priceEur,
            priceRub,
            duration
        } = await request.json();

        // Обновляем
        const updated = await prisma.package.update({
            where: {id},
            data: {
                name,
                priceEur,
                priceRub,
                duration
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