import {BotContext, PurchaseResource} from "@/app/api/bot/types";

export const clearSessionDetails = (ctx: BotContext) => {
    ctx.session.invoice = undefined;
    ctx.session.username = '';
    ctx.session.purchaseData = [];
    ctx.session.activePurchase = null;
    ctx.session.activeDocumentType = null;
}

export const setSessionDetails = (ctx: BotContext) => {
    ctx.session = {
        invoice: null,
        username: ctx.message?.from?.username,
        purchaseData: [],
        activeDocumentType: null,
    };
    return ctx;
}

export const setActiveSessionDocumentType = (ctx: BotContext, documentType: PurchaseResource): BotContext => {
    if (!ctx.session) {
        const updatedCtx = setSessionDetails(ctx);
        updatedCtx.session.activeDocumentType = documentType;
        return updatedCtx;
    }
    ctx.session.activeDocumentType = documentType;
    return ctx;
}

export const getUserIdFromCtx = (ctx: BotContext) => [ctx.from?.id, ctx.from?.username].join('_');
export const toLocaleDateString = (dateStr: string) => new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});