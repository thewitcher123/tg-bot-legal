import {NextResponse} from "next/server";
import {Telegraf} from 'telegraf';
import {session} from 'telegraf/session';
import {message} from "telegraf/filters";

import {VercelResponse} from '@vercel/node';
import {
    BotContext,
    HELLO_BUTTONS,
    START_BUTTONS,
    WHY_BETTER_BUTTONS,
    CHOOSE_PAYMENT_METHOD_BUTTONS,
    CONTENT_BUTTONS,
    FAQ_BUTTONS,
    PAY_BUTTONS_RU,
    PAY_BUTTONS_EU,
    CONTACT_ME_BUTTONS, PurchaseResource
} from "@/app/api/bot/types";
import {CommandList, Session} from "@/app/api/bot/types";
import {TG_TOKEN, ENVIRONMENT, VERCEL_URL} from "@/app/api/bot/const";
import {
    StartMessage,
    HelloMessage,
    WhyBetterMessage,
    ChoosePaymentServiceMessage,
    ContentDetailsMessage,
    FAQMessage,
    UnknownCommandMessage,
    PaymentMsg_RU,
    PaymentMsg_EU,
    UserDocumentsMessages,
} from "@/app/api/bot/strings";
import {
    getUserIdFromCtx,
    clearSessionDetails,
} from "@/app/api/bot/sceneHelpers";
import {startInvoiceProcessRu, setDoneInvoice} from "@/app/api/bot/invoice";
import {createPurchaseByUser, getUserPurchaseDetails, setPurchaseDetailsFromDB} from "@/app/api/bot/purchase";
import {answerWithNikitaVideoCircle} from "@/app/api/bot/media";

if (!TG_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');
// Order is important for the stage scenes to work
const bot = new Telegraf<BotContext>(TG_TOKEN);
bot.use(session({}));

bot.start(async (ctx) => {
    await setPurchaseDetailsFromDB(ctx);
    return await ctx.reply(HelloMessage, HELLO_BUTTONS);
});

// button code that redirects to another scene/screen/section
bot.on('callback_query', async (ctx: BotContext) => {
    if (!ctx?.callbackQuery?.data) {
        return;
    }
    const {data} = ctx.callbackQuery;
    switch (data) {
        case CommandList.purchaseData:
            await getUserPurchaseDetails(ctx);
            break;
        case CommandList.exit:
        case CommandList.hello: {
            // click on the "hello" button -> start message
            await ctx.reply(StartMessage, START_BUTTONS)
            break;
        }
        // 1st page
        case CommandList.receive: {
            // todo query for a payment to see if we need to only show the document list
            // click on the "receive" button -> choose payment method
            // await getUserPurchaseDetails(ctx);
            await ctx.reply(ChoosePaymentServiceMessage, CHOOSE_PAYMENT_METHOD_BUTTONS)
            break;
        }
        case CommandList.content: {
            // click on the "content" button -> choose payment method
            await ctx.reply(ContentDetailsMessage, CONTENT_BUTTONS)
            break;
        }
        case CommandList.why: {
            // click on the "why" button -> see the reasons list
            await ctx.reply(WhyBetterMessage, WHY_BETTER_BUTTONS)
            break;
        }
        case CommandList.faq: {
            // click on the "faq" button -> see the faq list
            await ctx.reply(FAQMessage, FAQ_BUTTONS)
            break;
        }
        // Receive result page
        case CommandList.payment_youkassa: {
            // click on the "payment_youkassa" button -> show contract and payment button
            await ctx.reply(PaymentMsg_RU, PAY_BUTTONS_RU);
            break;
        }
        case CommandList.payment_payoneer: {
            // click on the "payment_payoneer" button -> show contract and payment button
            await ctx.reply(PaymentMsg_EU, PAY_BUTTONS_EU)
            break;
        }
        case CommandList.buy: {
            // todo query for a payment to see if we need to only show the document list
            // click on the "receive" button -> choose payment method
            await getUserPurchaseDetails(ctx);
            // await ctx.reply(ChoosePaymentServiceMessage, CHOOSE_PAYMENT_METHOD_BUTTONS)
            break;
        }
        case CommandList.pay_ru_accept_offer: {
            await startInvoiceProcessRu(ctx);
            break;
        }
        default:
            await ctx.reply(UnknownCommandMessage, START_BUTTONS);
            break;

    }
});

bot.on('pre_checkout_query', async (ctx: BotContext) => {
    console.log({
        msg: 'pre_checkout_query',
        userId: getUserIdFromCtx(ctx),
        callbackQuery_data: ctx?.callbackQuery?.data,
        ctx,
        pre_checkout_query: ctx?.update?.pre_checkout_query
    });
    return await ctx.telegram.answerPreCheckoutQuery(ctx?.update?.pre_checkout_query?.id, true)
});

bot.on(message('successful_payment'), async (ctx: BotContext) => {
    const session = ctx.session as Session;
    console.log({
        msg: 'successful_payment',
        userId: getUserIdFromCtx(ctx),
        callbackQuery_data: ctx?.callbackQuery?.data,
        ctx,
        update_message: ctx.update.message
    });
    // we check the payload and mark invoice as done if it's found in the session context
    const {invoice_payload} = ctx.update.message.successful_payment;
    if (session.invoice.payload === invoice_payload) {
        // todo try catch?
        session.purchase = await createPurchaseByUser(ctx, PurchaseResource.doc_pack_2025);
        session.invoice = setDoneInvoice(session.invoice);
        await ctx.reply(UserDocumentsMessages.mainContract, {
            parse_mode: 'HTML',
        });
        await ctx.reply(UserDocumentsMessages.personalData, {
            parse_mode: 'HTML',
        });
        await ctx.reply(UserDocumentsMessages.companyStyleData, {
            parse_mode: 'HTML',
        });
        await ctx.reply(UserDocumentsMessages.webData, {
            parse_mode: 'HTML',
        });
        await ctx.reply(UserDocumentsMessages.calculationsData, {
            parse_mode: 'HTML',
        });
        await answerWithNikitaVideoCircle(ctx);
        await ctx.reply(UserDocumentsMessages.endData, CONTACT_ME_BUTTONS);
    } else {
        clearSessionDetails(ctx);
        // todo restart
        await ctx.reply(StartMessage, START_BUTTONS)
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
    })
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
    })
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

