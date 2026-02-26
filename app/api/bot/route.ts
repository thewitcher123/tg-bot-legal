import {NextResponse} from "next/server";
import {Telegraf} from 'telegraf';
import {session} from 'telegraf/session';
import {message} from "telegraf/filters";

import {VercelResponse} from '@vercel/node';
import {
    type BotContext,
    CommandList, getReplyMarkupEu,
    getReplyMarkupRu,
    ParseMode,
    PurchaseResource,
    ResponseConfig,
    Session
} from "@/app/api/bot/types";
import {ENVIRONMENT, TG_TOKEN, VERCEL_URL} from "@/app/api/bot/const";
import {
    ChoosePaymentServiceMessage,
    ClientsPackMessage,
    FAQMessage,
    FullLegalPackMessage,
    LegalDataMessage,
    PaymentMsg_EU,
    PaymentMsg_RU,
    StartMessage,
    UnknownCommandMessage,
    UserDocumentsMessages,
    WhyBetterMessage,
} from "@/app/api/bot/strings";
import {clearSessionDetails, setActiveSessionDocumentType,} from "@/app/api/bot/sceneHelpers";
import {setDoneInvoice, startInvoiceProcessRu, startInvoiceProcessEu} from "@/app/api/bot/invoice";
import {createPurchaseByUser} from "@/app/api/bot/purchase";
import {answerWithNikitaVideoCircle} from "@/app/api/bot/media";
import {PACKAGE_1_SAMPLES, PACKAGE_2_SAMPLES, PACKAGE_3_SAMPLES} from '@/app/api/service/package';
import {
    createDocumentPackageRelation,
    createPackagesAndDocuments
} from "@/app/api/service/documentPackage";
import {DOCUMENTS_TO_CREATE_PACKAGE_1, DOCUMENTS_TO_CREATE_PACKAGE_2} from "@/app/api/service/document";

if (!TG_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');
const bot = new Telegraf<BotContext>(TG_TOKEN);
bot.use(session({}));

const createDBByConst = async () => {
    await createPackagesAndDocuments(PACKAGE_1_SAMPLES, DOCUMENTS_TO_CREATE_PACKAGE_1);
    await createPackagesAndDocuments(PACKAGE_2_SAMPLES, DOCUMENTS_TO_CREATE_PACKAGE_2);
    await createPackagesAndDocuments(PACKAGE_3_SAMPLES, []);
    await createDocumentPackageRelation(PACKAGE_1_SAMPLES[0].name, DOCUMENTS_TO_CREATE_PACKAGE_1.map(item => item.title));
    await createDocumentPackageRelation(PACKAGE_1_SAMPLES[1].name, DOCUMENTS_TO_CREATE_PACKAGE_1.map(item => item.title));
    await createDocumentPackageRelation(PACKAGE_2_SAMPLES[0].name, DOCUMENTS_TO_CREATE_PACKAGE_2.map(item => item.title));
    await createDocumentPackageRelation(PACKAGE_2_SAMPLES[1].name, DOCUMENTS_TO_CREATE_PACKAGE_2.map(item => item.title));
    await createDocumentPackageRelation(PACKAGE_3_SAMPLES[0].name, [...DOCUMENTS_TO_CREATE_PACKAGE_1, ...DOCUMENTS_TO_CREATE_PACKAGE_2].map(item => item.title));
    await createDocumentPackageRelation(PACKAGE_3_SAMPLES[1].name, [...DOCUMENTS_TO_CREATE_PACKAGE_1, ...DOCUMENTS_TO_CREATE_PACKAGE_2].map(item => item.title));
};

bot.start(async (ctx) => {
    // await createDBByConst();
    return await ctx.reply(StartMessage, ResponseConfig.start);
});

// button code that redirects to another scene/screen/section
bot.on('callback_query', async (ctx: BotContext) => {
    if (!ctx?.callbackQuery?.data) {
        return;
    }
    const actionKey = ctx.callbackQuery.data as CommandList;
    console.log({
        msg: 'LOG CHOOSE SERVICE',
        ctx_session: ctx.session,
        actionKey,
    });
    switch (actionKey) {
        case CommandList.back:
        case CommandList.hello: {
            // click on the "hello" button -> start message
            await ctx.reply(StartMessage, ResponseConfig.start)
            break;
        }
        case CommandList.faq: {
            // click on the "faq" button -> see the faq list
            await ctx.reply(FAQMessage, ResponseConfig.faq)
            break;
        }
        case CommandList.clients_pack: {
            const docTypeCtx = setActiveSessionDocumentType(ctx, PurchaseResource.client_pack_2026);
            await docTypeCtx.reply(ClientsPackMessage, ResponseConfig.clients_pack);
            break;
        }
        case CommandList.clients_pack__why: {
            await ctx.reply(WhyBetterMessage, ResponseConfig.clients_pack__why);
            break;
        }
        case CommandList.legal_data: {
            const docTypeCtx = setActiveSessionDocumentType(ctx, PurchaseResource.legal_data_2026);
            await docTypeCtx.reply(LegalDataMessage, ResponseConfig.legal_data);
            break;
        }
        case CommandList.full_legal_pack: {
            const docTypeCtx = setActiveSessionDocumentType(ctx, PurchaseResource.full_legal_pack_2026);
            await docTypeCtx.reply(FullLegalPackMessage, ResponseConfig.full_legal_pack);
            break;
        }

        case CommandList.payment: {
            // todo query for a payment to see if we need to only show the document list
            // click on the "receive" button -> choose payment method
            // await getUserPurchaseDetails(ctx);
            await ctx.reply(ChoosePaymentServiceMessage, ResponseConfig.payment);
            break;
        }
        case CommandList.payment__youkassa: {
            // click on the "payment_youkassa" button -> show contract and payment button
            await ctx.reply(PaymentMsg_RU, getReplyMarkupRu(ctx.session.activeDocumentType));
            break;
        }
        case CommandList.payment__smart_glocal: {
            // click on the "payment__smart_glocal" button -> show contract and payment button
            await ctx.reply(PaymentMsg_EU, getReplyMarkupEu(ctx.session.activeDocumentType))
            break;
        }
        case CommandList.payment__youkassa__accept_offer: {
            await startInvoiceProcessRu(ctx);
            break;
        }
        case CommandList.payment__smart_glocal__accept_offer: {
            await startInvoiceProcessEu(ctx);
            break;
        }

        default:
            await ctx.reply(UnknownCommandMessage, ResponseConfig.start);
            break;

    }
});

bot.on('pre_checkout_query', async (ctx: BotContext) => {
    return await ctx.telegram.answerPreCheckoutQuery(ctx?.update?.pre_checkout_query?.id, true)
});

bot.on(message('successful_payment'), async (ctx: BotContext) => {
    const session = ctx.session as Session;
    if (!session.activeDocumentType || !session.invoice) {
        await ctx.reply('something went wrong. Please select desired item once again');
        return;
    }
    // we check the payload and mark invoice as done if it's found in the session context
    const {invoice_payload} = ctx.update.message.successful_payment;
    if (session.invoice.payload === invoice_payload) {
        const htmlMode = {
            parse_mode: ParseMode.html,
        };
        // todo try catch? add enum?
        session.activePurchase = await createPurchaseByUser(ctx, session.activeDocumentType);
        session.invoice = setDoneInvoice(session.invoice);
        const sentMessage = await ctx.reply(UserDocumentsMessages.mainContract, htmlMode);
        await ctx.pinChatMessage(sentMessage.message_id, {
            disable_notification: false, // true — без уведомления
        });
        await ctx.reply(UserDocumentsMessages.personalData, htmlMode);
        await ctx.reply(UserDocumentsMessages.companyStyleData, htmlMode);
        await ctx.reply(UserDocumentsMessages.webData, htmlMode);
        await ctx.reply(UserDocumentsMessages.calculationsData, htmlMode);
        // todo add training video
        await answerWithNikitaVideoCircle(ctx);
        await ctx.reply(UserDocumentsMessages.endData, ResponseConfig.start);
    } else {
        clearSessionDetails(ctx);
        // todo restart
        await ctx.reply(StartMessage, ResponseConfig.start)
    }
});

const production = async (
    req: Request,
    res: VercelResponse,
    bot: Telegraf<any>,
) => {
    console.log('Bot runs in production mode');

    if (!VERCEL_URL) {
        throw new Error('VERCEL_URL is not set.');
    }

    const getWebhookInfo = await bot.telegram.getWebhookInfo();
    console.log({
        msg: 'LOG webhook',
        getWebhookInfo,
    });
    if (getWebhookInfo.url !== VERCEL_URL + '/api/bot') {
        console.log(`deleting webhook ${VERCEL_URL}`);
        await bot.telegram.deleteWebhook();
        console.log(`setting webhook: ${VERCEL_URL}/api/bot`);
        await bot.telegram.setWebhook(`${VERCEL_URL}/api/bot`);
    }

    const requestDetails = await req.json();
    console.log({
        msg: 'Request details',
        requestDetails
    });
    await bot.handleUpdate(requestDetails, res);
};

const startVercel = async (req: Request, res: VercelResponse) => {
    if (ENVIRONMENT === 'production') {
        await production(req, res, bot);
        return NextResponse.json({
            success: true,
            message: 'Listening to bot events...',
        });
    }
    return NextResponse.json({
        success: true,
        message: 'Success sending message.'
    });
};

const development = async (bot: Telegraf<any>) => {
    const botInfo = (await bot.telegram.getMe()).username;

    console.log('Bot runs in development mode');
    console.log(`${botInfo} deleting webhook`);
    await bot.telegram.deleteWebhook();
    console.log(`${botInfo} starting polling`);

    await bot.launch();
};

//dev mode
if (ENVIRONMENT !== 'production') {
    development(bot);
}

export async function POST(request: Request, res: VercelResponse) {
    try {
        await startVercel(request, res);
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            e,
            message: 'Failed to send message.'
        });
    }
    return NextResponse.json({
        success: true,
        message: 'Default response'
    });
}

