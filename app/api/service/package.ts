import {Prisma} from "@prisma/client";
import prisma from '@/app/utils/prismadb';

export const PACKAGE_1_SAMPLES: PackageData[] = [
    {
        name: 'Client_pack_2026_RUB',
        price: 16_990_00,
        currency: 'RUB',
        duration: 365,
    },
    {
        name: 'Client_pack_2026_EUR',
        price: 16_990,
        currency: 'EUR',
        duration: 365,
    },
];

export const PACKAGE_2_SAMPLES: PackageData[] = [
    {
        name: 'Legal_data_pack_2026_RUB',
        price: 8_990_00,
        currency: 'RUB',
        duration: 365,
    },
    {
        name: 'Legal_data_pack_2026_EUR',
        price: 8_990,
        currency: 'EUR',
        duration: 365,
    },
];

export const PACKAGE_3_SAMPLES: PackageData[] = [
    {
        name: 'Full_legal_pack_2026_RUB',
        price: 25_990_00,
        currency: 'RUB',
        duration: 365,
    },
    {
        name: 'Full_legal_pack_2026_EUR',
        price: 25_990,
        currency: 'EUR',
        duration: 365,
    }
];

export interface PackageData {
    name: string,
    price: number,
    currency: string,
    duration: number
}

export async function createPackage(
    {
        name,
        price,
        currency,
        duration,
    }: PackageData,
    tx?: Prisma.TransactionClient,
) {
    const prismaInstance = tx || prisma;
    const pkg = await prismaInstance.package.create({
        data: {
            name,
            price,
            currency,
            duration,
        }
    });
    console.log({
        msg: 'LOG createPackage -> pkg',
        pkg,
    });
}

export async function getPackageByData(
    {
        name,
        price,
        currency,
        duration,
    }: PackageData,
    tx?: Prisma.TransactionClient,
) {
    const prismaInstance = tx || prisma;
    const pkg = await prismaInstance.package.findFirst({
        where: {
            name,
            price,
            currency,
            duration
        },
    });
    console.log({
        msg: 'LOG getPackageByName -> pkg',
        pkg,
    });
    return pkg;
}
