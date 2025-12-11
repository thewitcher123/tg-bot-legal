import prisma from '@/app/utils/prismadb';
import {
    InvoiceStatus,
    PurchaseData,
    PurchaseResource,
    BotContext, ActionsMap, CHOOSE_PAYMENT_METHOD_BUTTONS
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
    const purchaseData = await getPurchaseDataByUser(ctx, PurchaseResource.doc_pack_2025);
    const docPackPurchase = filterPurchaseDataByResource(purchaseData, PurchaseResource.doc_pack_2025);
    session.purchase = docPackPurchase ? docPackPurchase : null;
    console.log({
        msg: 'setPurchaseDetailsFromDB() end',
        purchaseData,
        docPackPurchase,
        session: ctx.session,
    });
};

export const filterPurchaseDataByResource = (purchases: PurchaseData[], resource: PurchaseResource) => purchases.filter(item => item.resource === resource)[0];

export const getPurchaseDataByUser = async (ctx: BotContext, resource: PurchaseResource): Promise<PurchaseData[]> => {
    const userId = getUserIdFromCtx(ctx);
    console.log({
        msg: 'getPurchasesByUser()',
        userId,
        ctx: ctx,
        ctx_update_callback_query: ctx.update.callback_query,
    });
    try {
        const config: any = {
            where: {
                userId,
                endDate: {
                    gte: new Date(),
                },
                resource,
            }
        };
        const purchaseData = await prisma?.purchase?.findMany(config);
        console.log({
            msg: 'getPurchasesByUser() RESULT',
            config,
            purchaseData,
        });
        return purchaseData as unknown as PurchaseData[];
    } catch (error) {
        console.log({
            msg: 'error while getting purchase list for the user!!!',
            error,
        });
        return [] as PurchaseData[];
    }
};

export const createPurchaseByUser = async (ctx: BotContext, resource: PurchaseResource) => {
    const userId = getUserIdFromCtx(ctx);
    const data = {
        userId,
        resource,
        paymentStatus: InvoiceStatus.done,
        startDate: new Date().toISOString(),
        endDate: addDays(365).toISOString(),
    }
    try {
        const purchase = await prisma.purchase.create({
            data
        });
        return purchase as unknown as PurchaseData;
    } catch (error: any) {
        console.log({
            msg: 'error while creating purchase for the user',
            error,
        });
        return null;
    }
};

/*export const deleteOldPurchasesByUser = async (userId: string) => {
    try {
        await prisma.purchase.deleteMany({
            where: {
                userId,
                endDate: {
                    lt: new Date(),
                },
            }
        })
    } catch (error: any) {
        console.log({
            msg: 'error while deleting purchases',
            error,
        });
        return null;
    }
};*/

const addDays = (daysToAdd: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate;
};

export const getPurchaseDetails = async (ctx: BotContext, purchaseData: PurchaseData, showButtons = false) => {
    const replyConfig: any = {
        parse_mode: 'HTML',
    };
    if (showButtons) {
        replyConfig.reply_markup = {
            inline_keyboard: ActionsMap.start,
        }
    }
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
    /*if (!ctx.session?.purchase) {
        await setPurchaseDetailsFromDB(ctx);
    } else {
        await getPurchaseDetails(ctx, ctx.session.purchase, true);
    }
    return await ctx.reply('NO purchaseData FOUND', {
        reply_markup: {
            inline_keyboard: ActionsMap.start,
        }
    });*/
    const purchaseData = await getPurchaseDataByUser(ctx, PurchaseResource.doc_pack_2025);
    if (purchaseData.length === 0) {
        return await ctx.reply(ChoosePaymentServiceMessage, CHOOSE_PAYMENT_METHOD_BUTTONS);
    }
    for (let i = 0; i < purchaseData.length; i++) {
        const purchaseDataItem = purchaseData[i];
        await getPurchaseDetails(ctx, purchaseDataItem, i === purchaseData.length - 1);
    }
    return purchaseData;
};