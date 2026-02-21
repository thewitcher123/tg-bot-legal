import prisma from '@/app/utils/prismadb';
import {
    InvoicePaymentStatus,
    PurchaseData,
    PurchaseResource,
    BotContext,
    ResponseConfig, ParseMode, PurchaseStatus
} from "@/app/api/bot/types";
import {
    getUserIdFromCtx,
    setSessionDetails,
    toLocaleDateString
} from "@/app/api/bot/sceneHelpers";
import {ChoosePaymentServiceMessage} from "@/app/api/bot/strings";

export const setPurchaseDetailsFromDB = async (ctx: BotContext) => {
    if (!ctx.session) {
        ctx = setSessionDetails(ctx);
    }
    const session = ctx.session;
    const purchaseData = await getPurchaseDataByUser(ctx);
    session.purchaseData = purchaseData || [];
};

export const getPurchaseDataByUser = async (ctx: BotContext): Promise<PurchaseData[]> => {
    const userId = getUserIdFromCtx(ctx);
    try {
        const config: any = {
            where: {
                userId,
                endDate: {
                    gte: new Date(),
                },
            }
        };
        const purchaseData = await prisma?.purchase?.findMany(config);
        return purchaseData as unknown as PurchaseData[];
    } catch (error) {
        return [] as PurchaseData[];
    }
};

export const createPurchaseByUser = async (ctx: BotContext, resource: PurchaseResource) => {
    const userId = getUserIdFromCtx(ctx);
    // todo add resourceType into DB
    const data = {
        userId,
        resource,
        paymentStatus: InvoicePaymentStatus.done,
        purchaseStatus: PurchaseStatus.enabled,
        startDate: new Date().toISOString(),
        endDate: addDays(365).toISOString(),
    }
    try {
        const purchase = await prisma.purchase.create({
            data
        });
        return purchase as unknown as PurchaseData;
    } catch (error: any) {
        return null;
    }
};

const addDays = (daysToAdd: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate;
};

export const getPurchaseDetails = async (ctx: BotContext, purchaseData: PurchaseData, showButtons = false) => {
    const replyConfig = showButtons ? {
        ...ResponseConfig.start,
        parse_mode: ParseMode.html,
    } : {
        parse_mode: ParseMode.html,
    };
    await ctx.reply(getPurchaseDetailsText(purchaseData), replyConfig);
};

export const getPurchaseDetailsText = (purchaseData: PurchaseData) => {
    return `
<b>Детали покупок:</b>
<b>Ресурс - ${purchaseData?.resource || 'нет данных'}</b>
<b>Дата оплаты - ${toLocaleDateString(purchaseData.startDate) || 'нет данных'}</b>
<b>Конец доступа - ${toLocaleDateString(purchaseData?.endDate) || 'нет данных'}</b>
    `
};

export const getUserPurchaseDetails = async (ctx: BotContext) => {
    const purchaseData = await getPurchaseDataByUser(ctx);
    if (purchaseData.length === 0) {
        return await ctx.reply(ChoosePaymentServiceMessage, ResponseConfig.payment);
    }
    for (let i = 0; i < purchaseData.length; i++) {
        const purchaseDataItem = purchaseData[i];
        await getPurchaseDetails(ctx, purchaseDataItem, i === purchaseData.length - 1);
    }
    return purchaseData;
};