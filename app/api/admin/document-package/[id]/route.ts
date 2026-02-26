import prisma from '@/app/utils/prismadb';
import {NextRequest, NextResponse} from 'next/server'

export async function GET(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {

    const {id} = await params;
    console.log({
        msg: 'LOG TEST 1',
        packageId: id,
    })
    const documents = await prisma.documentPackage.findMany({
        where: {packageId: id},
        include: {
            document: true,
            package: true,
        }
    });
    console.log({
        msg: 'LOG TEST 2',
        packageId: id,
        documents,
    })

    return NextResponse.json(documents);
}

export async function POST(req: NextRequest) {
    const body = await req.json()

    const {
        title,
        fileUrl,
        description
    } = body

    const document = await prisma.document.create({
        data: {
            title,
            description,
            fileUrl
        }
    })

    return NextResponse.json(document)
}