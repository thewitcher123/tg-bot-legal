import {Context, Scenes} from 'telegraf';
import {InlineKeyboardButton} from "@telegraf/types/markup";

export enum ParseMode {
    html = 'HTML',
    markdown = 'Markdown',
}

export enum CommandList {
    hello = 'hello',
    start = 'start',
    clients_pack = 'clients_pack',
    legal_data = 'legal_data',
    full_legal_pack = 'full_legal_pack',
    faq = 'faq',
    back = 'back',
    clients_pack__why = 'clients_pack__why',
    // payment
    payment = 'payment',
    payment__youkassa = 'payment__youkassa',
    payment__smart_glocal = 'payment__smart_glocal',
    payment__youkassa__accept_offer = 'payment__youkassa__accept_offer',
    payment__smart_glocal__accept_offer = 'payment__smart_glocal__accept_offer',
    // todo download submenu
    download = 'download',
    download__contract = 'download__contract',
    download__policy = 'download__policy',
    download__brief = 'download__brief',
    download__payment_calc = 'download__payment_calc',
}

export enum PurchaseResource {
    client_pack_2026 = 'client_pack_2026',
    legal_data_2026 = 'legal_data_2026',
    full_legal_pack_2026 = 'full_legal_pack_2026',
}

export const PaymentRubInt = {
    [PurchaseResource.client_pack_2026]: {
        price: 18_990_00,
        buttonPrice: '18 990,00₽'
    },
    [PurchaseResource.legal_data_2026]: {
        price: 8_990_00,
        buttonPrice: '8 990,00₽'
    },
    [PurchaseResource.full_legal_pack_2026]: {
        price: 25_990_00,
        buttonPrice: '25 990,00₽'
    },
}

export const PaymentEurInt = {
    [PurchaseResource.client_pack_2026]: {
        price: 18_990_00,
        buttonPrice: '18 990,00Eur'
    },
    [PurchaseResource.legal_data_2026]: {
        price: 8_990_00,
        buttonPrice: '8 990,00Eur'
    },
    [PurchaseResource.full_legal_pack_2026]: {
        price: 25_990_00,
        buttonPrice: '25 990,00Eur'
    },
}

const START_BUTTONS = [
    [
        {
            text: 'Пакет «Договоры для работы с клиентами»',
            callback_data: CommandList.clients_pack,
        },
    ],
    [
        {
            text: '«Персональные данные и закон»',
            callback_data: CommandList.legal_data,
        },
    ],
    [
        {
            text: '«Полная юридическая упаковка»',
            callback_data: CommandList.full_legal_pack,
        },
    ],
    [
        {
            text: 'Частые вопросы',
            callback_data: CommandList.faq,
        },
    ],
    // todo clarify
    /*[
        {
            text: 'Мои документы',
            callback_data: CommandList.purchase_data,
        },
    ]*/
];
const BACK_BUTTON = [
    {
        text: 'Вернуться в меню',
        callback_data: CommandList.back,
    },
];
export type ResponseConfigType = Record<CommandList, {
    reply_markup: {
        inline_keyboard: InlineKeyboardButton[][]
    },
    parse_mode?: ParseMode,
}>
// what text do we render according to the command
export const ResponseConfig: ResponseConfigType = {
    hello: {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Начать',
                        callback_data: CommandList.hello,
                    },
                ]
            ],
        }
    },
    start: {
        reply_markup: {
            inline_keyboard: START_BUTTONS,
        }
    },
    clients_pack: {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Получить пакет «Договоры для работы с клиентами»',
                        callback_data: CommandList.payment,
                    },
                ],
                [
                    {
                        text: 'Почему этот пак лучше',
                        callback_data: CommandList.clients_pack__why,
                    },
                ],
                [
                    {
                        text: 'Частые вопросы',
                        callback_data: CommandList.faq,
                    },
                ],
                BACK_BUTTON,
            ],
        }
    },
    clients_pack__why: {
        reply_markup: {
            inline_keyboard: START_BUTTONS,
        }
    },
    payment: {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Оплата из РФ (Юкасса)',
                        callback_data: CommandList.payment__youkassa,
                    },
                ],
                [
                    {
                        text: 'Оплата из других стран (Smart Glocal)',
                        callback_data: CommandList.payment__smart_glocal,
                    },
                ],
            ],
        }
    },
    payment__youkassa: {
        parse_mode: ParseMode.html,
        reply_markup: {
            inline_keyboard: [],
        },
    },
    payment__smart_glocal: {
        parse_mode: ParseMode.html,
        reply_markup: {
            inline_keyboard: [],
        },
    },
    legal_data: {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Частые вопросы',
                        callback_data: CommandList.faq,
                    },
                ],
                [
                    {
                        text: 'Получить пакет «Договоры для работы с клиентами»',
                        callback_data: CommandList.payment,
                    },
                ],
                BACK_BUTTON,
            ],
        }
    },
    full_legal_pack: {
        parse_mode: ParseMode.html,
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Частые вопросы',
                        callback_data: CommandList.faq,
                    },
                ],
                [
                    {
                        text: 'Приобрести пакет «Полная юридическая упаковка»',
                        callback_data: CommandList.payment,
                    },
                ],
                BACK_BUTTON,
            ],
        }
    },
    faq: {
        reply_markup: {
            inline_keyboard: [
                BACK_BUTTON,
            ],
        }
    },
    back: {
        reply_markup: {
            inline_keyboard: START_BUTTONS,
        }
    },
    download: {
        reply_markup: {
            inline_keyboard: [
                BACK_BUTTON
            ],
        }
    },
    download__contract: {
        reply_markup: {
            inline_keyboard: [
                BACK_BUTTON
            ],
        }
    },
    download__policy: {
        reply_markup: {
            inline_keyboard: [
                BACK_BUTTON
            ],
        }
    },
    download__brief: {
        reply_markup: {
            inline_keyboard: [
                BACK_BUTTON
            ],
        }
    },
    download__payment_calc: {
        reply_markup: {
            inline_keyboard: [
                BACK_BUTTON
            ],
        }
    },
    // pay submenu
    payment__youkassa__accept_offer: {
        reply_markup: {
            inline_keyboard: [
                BACK_BUTTON
            ],
        }
    },
    payment__smart_glocal__accept_offer: {
        reply_markup: {
            inline_keyboard: [
                BACK_BUTTON
            ],
        }
    },
};

export const getReplyMarkupRu = (resource: PurchaseResource) => {
    return {
        parse_mode: ParseMode.html,
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: `Оплатить ${PaymentRubInt[resource].buttonPrice}`,
                        callback_data: CommandList.payment__youkassa__accept_offer,
                    }
                ]
            ],
        }
    };
};

export const getReplyMarkupEu = (resource: PurchaseResource) => {
    return {
        parse_mode: ParseMode.html,
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: `Оплатить ${PaymentEurInt[resource].buttonPrice}`,
                        callback_data: CommandList.payment__smart_glocal__accept_offer,
                    }
                ]
            ],
        }
    };
};

export interface PurchaseData {
    id: string,
    userId: string,
    resource: PurchaseResource,
    paymentStatus: InvoicePaymentStatus,
    purchaseStatus: PurchaseStatus,
    startDate: string,
    updatedDate: string,
    endDate: string,
}

export interface Session {
    username: string;
    invoice: InvoiceDetails | null;
    activePurchase: PurchaseData | null;
    purchaseData: PurchaseData[];
    activeDocumentType: PurchaseResource | null;
}

// @ts-ignore
export type BotContext = Context & Scenes.SceneContextMessageUpdate & {
    session: Session;
    callbackQuery: {
        data: {}
    };
};

export enum InvoicePaymentStatus {
    failed = 'failed',
    pending = 'pending',
    done = 'done',
}

export enum PurchaseStatus {
    enabled = 'enabled',
    disabled = 'disabled',
}

export interface Price {
    label: string,
    amount: number,
}

export interface InvoiceDetails {
    id: string,
    created_at: number,
    chat_id: string,
    title: string,
    description: string,
    provider_token: string,
    currency: string,
    prices: Price[],
    start_parameter: string,
    payload: string,
}

export interface InvoiceDetailsWithPaymentStatus extends InvoiceDetails {
    paymentStatus?: InvoicePaymentStatus;
    purchaseStatus?: PurchaseStatus;
}
