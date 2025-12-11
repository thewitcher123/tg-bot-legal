import {BotContext} from "@/app/api/bot/types";

export const clearSessionDetails = (ctx: BotContext) => {
    ctx.session.invoice = undefined;
    ctx.session.username = '';
    ctx.session.purchase = null;
}

export const setSessionDetails = (ctx: BotContext) => {
    ctx.session = {
        invoice: undefined,
        username: ctx.message?.from?.username,
        purchase: null
    };
    return ctx;
}

export const getUserIdFromCtx = (ctx: BotContext) => [ctx.from?.id, ctx.from?.username].join('_');
export const toLocaleDateString = (dateStr: string) => new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});