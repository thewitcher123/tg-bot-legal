import {
    BotContext,
    InvoiceDetails,
    InvoiceDetailsWithPaymentStatus,
    InvoicePaymentStatus,
    ResponseConfig,
    Session,
    PaymentRubInt,
    PaymentEurInt,
    PurchaseResource, PurchaseStatus,
} from "@/app/api/bot/types";
import {SMART_GLOCAL_TEST_PROVIDER_TOKEN, YOKASSA_PROVIDER_TOKEN} from "@/app/api/bot/const";
import {FailureCommandMessage} from "@/app/api/bot/strings";

export const getInvoiceStatus = (invoice?: InvoiceDetailsWithPaymentStatus) => {
    const paymentStatus = invoice?.paymentStatus ?? null;
    switch (paymentStatus) {
        case InvoicePaymentStatus.failed:
            return 'Ошибка';
        case InvoicePaymentStatus.done:
            return 'Оплачен';
        case InvoicePaymentStatus.pending:
            return 'Не оплачен';
        default:
            return 'Нет данных'
    }
};

const getPackTitleByType = (resource: PurchaseResource) => {
    switch (resource) {
        case PurchaseResource.client_pack_2026:
            return 'Оплата за пакет «Договоры для работы с клиентами»';
        case PurchaseResource.legal_data_2026:
            return 'Оплата за пакет «Персональные данные и закон»';
        case PurchaseResource.full_legal_pack_2026:
            return 'Оплата за пакет «Полная юридическая упаковка»';
        default:
            return 'Нет заголовка';
    }
};

const getPackDescriptionByType = (resource: PurchaseResource) => {
    const dateStr = new Date(Date.now()).toLocaleDateString();
    switch (resource) {
        case PurchaseResource.client_pack_2026:
            return `Вы получите доступ к пакету «Договоры для работы с клиентами» сроком на 1 год начиная с ${dateStr}`
        case PurchaseResource.legal_data_2026:
            return `Вы получите доступ к пакету «Персональные данные и закон» сроком на 1 год начиная с ${dateStr}`
        case PurchaseResource.full_legal_pack_2026:
            return `Вы получите доступ к пакету «Полная юридическая упаковка» сроком на 1 год начиная с ${dateStr}`
        default:
            return 'Нет описания';
    }
};

export const getPackInvoiceRu = (ctx: BotContext) => {
    const id = ctx.from.id + '';
    const resource = ctx.session.activeDocumentType as PurchaseResource;
    const created_at = Date.now();
    const invoiceConfig: InvoiceDetails = {
        id,
        chat_id: id,
        created_at,
        title: getPackTitleByType(resource),
        description: getPackDescriptionByType(resource),
        provider_token: YOKASSA_PROVIDER_TOKEN,
        currency: 'RUB',
        prices: [{
            label: 'Руб.',
            amount: PaymentRubInt[resource].price,
        }],
        start_parameter: `${resource}-pack-invoice-ru`,
        // todo more unique?
        payload: id,
        // todo
        // need_name: true,
    };
    return invoiceConfig;
};

export const getPackInvoiceEu = (ctx: BotContext) => {
    const id = ctx.from.id + '';
    const resource = ctx.session.activeDocumentType as PurchaseResource;
    const created_at = Date.now();
    const invoiceConfig: InvoiceDetails = {
        id,
        chat_id: id,
        created_at,
        title: getPackTitleByType(resource),
        description: getPackDescriptionByType(resource),
        provider_token: SMART_GLOCAL_TEST_PROVIDER_TOKEN,
        currency: 'EUR',
        prices: [{
            label: 'Euro',
            amount: PaymentEurInt[resource].price,
        }],
        start_parameter: `${resource}-pack-invoice-eu`,
        // todo more unique?
        payload: id,
    };
    return invoiceConfig;
};

export const setPendingInvoice = (invoice: InvoiceDetailsWithPaymentStatus) => {
    return {
        ...invoice,
        paymentStatus: InvoicePaymentStatus.pending,
        purchaseStatus: PurchaseStatus.enabled,
    }
}

export const setDoneInvoice = (invoice: InvoiceDetailsWithPaymentStatus) => {
    return {
        ...invoice,
        paymentStatus: InvoicePaymentStatus.done,
        purchaseStatus: PurchaseStatus.enabled,
    }
}

export const setFailedInvoice = (invoice: InvoiceDetailsWithPaymentStatus) => {
    return {
        ...invoice,
        paymentStatus: InvoicePaymentStatus.failed,
        purchaseStatus: PurchaseStatus.disabled,
    }
}

export const startInvoiceProcessRu = async (ctx: BotContext) => {
    // 1. create an invoice -> ctx.replyWithInvoice
    // 2. set pending invoice
    // 3. pre-checkout-query
    // 4. success or fail invoice
    const session = ctx.session as Session;
    session.invoice = getPackInvoiceRu(ctx);
    try {
        session.invoice = setPendingInvoice(session.invoice);
        await ctx.replyWithInvoice(session.invoice);
    } catch (error) {
        await invoiceErrorFallback(ctx, session, error);
    }
};

export const startInvoiceProcessEu = async (ctx: BotContext) => {
    // 1. create an invoice -> ctx.replyWithInvoice
    // 2. set pending invoice
    // 3. pre-checkout-query
    // 4. success or fail invoice
    const session = ctx.session as Session;
    session.invoice = getPackInvoiceEu(ctx);
    try {
        session.invoice = setPendingInvoice(session.invoice);
        await ctx.replyWithInvoice(session.invoice);
    } catch (error) {
        await invoiceErrorFallback(ctx, session, error);
    }
};

const invoiceErrorFallback = async (ctx: BotContext, session: Session, error: any) => {
    if (!session.invoice) {
        await ctx.reply('No invoice found', ResponseConfig.start);
        return;
    }
    session.invoice = setFailedInvoice(session.invoice);
    // todo an error appeared and we need to restart the payment process
    await ctx.reply(FailureCommandMessage, ResponseConfig.start)
};
