import prisma from '@/app/utils/prismadb';
import {Package} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server'

export type SafePackage = Omit<Package, 'createdAt'> & {
    createdAt: string;
};

export async function POST(req: NextRequest) {
    const body = await req.json()

    const {
        name,
        priceRub,
        priceEur,
        duration,
    } = body

    const pkg = await prisma.package.create({
        data: {
            name,
            priceRub,
            priceEur,
            duration,
        }
    })

    return NextResponse.json(pkg)
}

export async function GET() {
    const documents = await prisma.package.findMany({
        orderBy: {name: 'desc'}
    })

    return NextResponse.json(documents)
}

export async function PATCH(
    req: NextRequest,
    {params}: { params: { id: string } }
) {
    const body = await req.json()

    const updated = await prisma.package.update({
        where: {id: params.id},
        data: body
    })

    return NextResponse.json(updated)
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: { id: string } }
) {
    await prisma.package.delete({
        where: {id: params.id}
    })

    return NextResponse.json({success: true})
}