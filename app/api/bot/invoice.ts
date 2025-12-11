import {
    setSessionDetails,
} from "@/app/api/bot/sceneHelpers";
import {
    BotContext,
    CHOOSE_PAYMENT_METHOD_BUTTONS,
    InvoiceDetails,
    InvoiceDetailsWithStatus,
    InvoiceStatus,
    Price,
    Session,
} from "@/app/api/bot/types";
import {YOKASSA_PROVIDER_TOKEN} from "@/app/api/bot/const";
import {FailureCommandMessage} from "@/app/api/bot/strings";

const PAYMENT_AMOUNT_INT = 7_900_00;

export const getInvoicePaymentStr = (invoice?: InvoiceDetails) => {
    const prices = (invoice?.prices || []) as Price[];
    const totalPrice = prices.reduce((sum: number, currentValue: Price) => sum + currentValue.amount, 0);
    const label = invoice?.prices?.[0]?.label || '';
    if (!totalPrice || !label) {
        return '';
    }
    return `${totalPrice / 100} ${label}`
};

export const replyWithOrderDetails = async (ctx: BotContext) => {
    await ctx.reply(`
<b>Ваш заказ, ${ctx.session?.username || ''}:</b>
<b>Название - ${ctx.session?.invoice?.title || ''}</b>
<b>Описание - ${ctx.session?.invoice?.description || ''}</b>
<b>Стоимость - ${getInvoicePaymentStr(ctx.session?.invoice)}</b>
<b>Статус - ${getInvoiceStatus(ctx.session.invoice)}</b>
    `, {
        parse_mode: 'HTML',
    });
};

export const getInvoiceStatus = (invoice?: InvoiceDetailsWithStatus) => {
    const status = invoice?.status ?? null;
    switch (status) {
        case InvoiceStatus.failed:
            return 'Ошибка';
        case InvoiceStatus.done:
            return 'Оплачен';
        case InvoiceStatus.pending:
            return 'Не оплачен';
        default:
            return 'Нет данных'
    }
};

export const getPackInvoiceRu = (ctx: BotContext) => {
    const {id} = ctx.from;
    const created_at = Date.now();
    const invoiceConfig: InvoiceDetails = {
        id: '',
        chat_id: id,
        created_at,
        title: `Оплата за пак документов`,
        description: `Вы получите доступ к паку документов сроком на 1 год начиная с ${new Date(created_at).toLocaleDateString()}`,
        provider_token: YOKASSA_PROVIDER_TOKEN,
        currency: 'RUB',
        prices: [{
            label: 'Руб.',
            amount: PAYMENT_AMOUNT_INT,
        }],
        start_parameter: 'legal-document-pack-invoice',
        payload: `${id}`,
    };
    return invoiceConfig;
};

export const setPendingInvoice = (invoice: InvoiceDetailsWithStatus) => {
    return {
        ...invoice,
        status: InvoiceStatus.pending
    }
}

export const setDoneInvoice = (invoice: InvoiceDetailsWithStatus) => {
    return {
        ...invoice,
        status: InvoiceStatus.done
    }
}

export const setFailedInvoice = (invoice: InvoiceDetailsWithStatus) => {
    return {
        ...invoice,
        status: InvoiceStatus.failed
    }
}

export const startInvoiceProcessRu = async (ctx: BotContext) => {
    // 1. create an invoice -> ctx.replyWithInvoice
    // 2. set pending invoice
    // 3. pre-checkout-query
    // 4. success or fail invoice
    ctx = setSessionDetails(ctx);
    const session = ctx.session as Session;
    session.invoice = getPackInvoiceRu(ctx);
    try {
        session.invoice = setPendingInvoice(session.invoice);
        await ctx.replyWithInvoice(session.invoice);
        await replyWithOrderDetails(ctx);
    } catch (error) {
        console.log({
            msg: 'LOG REPLY WITH INVOICE (FAILURE)',
            error,
        })
        session.invoice = setFailedInvoice(session.invoice);
        await ctx.reply(FailureCommandMessage, CHOOSE_PAYMENT_METHOD_BUTTONS)
    }
};
