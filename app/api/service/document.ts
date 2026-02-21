import {Prisma} from "@prisma/client";
import prisma from '@/app/utils/prismadb';

export const DOCUMENTS_TO_CREATE_PACKAGE_1: Document[] = [
    // package 1
    {
        title: 'Universal contract constructor',
        description: 'Универсальный договор-конструктор',
        fileUrl: 'https://docs.google.com/spreadsheets/d/1jyEv7NOW9d7aTiGXrlivusuHlcCE6J_YkYMSKlIYnAE/edit?gid=0#gid=0'
    },
    {
        title: 'Add-ons to the contract for specific cases',
        description: 'Аддоны к договору под частные случаи',
        fileUrl: 'https://docs.google.com/spreadsheets/d/1jyEv7NOW9d7aTiGXrlivusuHlcCE6J_YkYMSKlIYnAE/edit?gid=0#gid=0'
    },
];

export const DOCUMENTS_TO_CREATE_PACKAGE_2: Document[] = [
    // package 2
    {
        title: 'Privacy Policy',
        description: 'Политика конфиденциальности',
        fileUrl: 'https://docs.google.com/spreadsheets/d/1jyEv7NOW9d7aTiGXrlivusuHlcCE6J_YkYMSKlIYnAE/edit?gid=0#gid=0'
    },
    {
        title: 'Processing of personal data',
        description: 'Обработка ПД',
        fileUrl: 'https://docs.google.com/spreadsheets/d/1jyEv7NOW9d7aTiGXrlivusuHlcCE6J_YkYMSKlIYnAE/edit?gid=0#gid=0'
    },
];

export interface Document {
    title: string,
    description: string,
    fileUrl: string,
}

export async function createDocument(
    {
        title,
        description,
        fileUrl
    }: Document,
    tx?: Prisma.TransactionClient,
) {
    const prismaInstance = tx || prisma;
    const document = await prismaInstance.document.create({
        data: {
            title,
            description,
            fileUrl
        }
    });
    console.log({
        msg: 'LOG createDocument -> document',
        document,
    });
    return document;
}