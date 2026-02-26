import prisma from '@/app/utils/prismadb';
import {NextRequest, NextResponse} from 'next/server'

export async function GET() {
    const result = await prisma.package.findMany({
        include: {
            documentPackageList: {
                include: {
                    document: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                        },
                    },
                },
            },
        },
        orderBy: {name: "asc"},
    });

    return NextResponse.json(
        result.map((pkg) => ({
            ...pkg,
            documentCount: pkg.documentPackageList.length,
            documents: pkg.documentPackageList.map((dp) => dp.document),
        }))
    );
}

export async function POST(request: NextRequest) {
    try {
        const {
            packageId,
            documentIds
        } = await request.json();

        // Валидация
        if (!packageId || !Array.isArray(documentIds) || documentIds.length === 0) {
            return NextResponse.json(
                {error: "packageId and documentIds array are required"},
                {status: 400}
            );
        }

        // Проверяем существование пакета
        const pkg = await prisma.package.findUnique({
            where: {id: packageId},
        });

        if (!pkg) {
            return NextResponse.json(
                {error: "Package not found"},
                {status: 404}
            );
        }

        // Создаём связи через транзакцию (атомарно)
        const createdConnections = await prisma.$transaction(
            documentIds.map((documentId: string) =>
                prisma.documentPackage.upsert({
                    where: {
                        // уникальный ключ по схеме @@unique([packageId, documentId])
                        packageId_documentId: {
                            packageId,
                            documentId,
                        },
                    },
                    update: {}, // ничего не меняем если уже существует
                    create: {
                        packageId,
                        documentId,
                    },
                    include: {
                        document: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                            },
                        },
                    },
                })
            )
        );

        // Возвращаем только новые/обновлённые связи
        const result = createdConnections.map((conn) => conn.document);
        console.log({
            msg: ' Document Package result',
            result
        })

        return NextResponse.json({
            success: true,
            added: result.length,
            documents: result,
        });
    } catch (error) {
        console.error("DocumentPackage creation error:", error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}