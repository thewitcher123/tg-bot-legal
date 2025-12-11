import {Context, Scenes} from 'telegraf';

export enum CommandList {
    hello = 'hello',
    start = 'start',
    buy = 'buy',
    receive = 'receive',
    purchaseData = 'purchase_data',
    why = 'why',
    content = 'content',
    faq = 'faq',
    text = 'text',
    contact = 'contact',
    exit = 'exit',
    download = 'download',
    // payment submenu
    payment_youkassa = 'payment_youkassa',
    payment_payoneer = 'payment_payoneer',
    // download submenu
    download_contract = 'download_contract',
    download_policy = 'download_policy',
    download_brief = 'download_brief',
    download_payment_calc = 'download_payment_calc',
    // pay submenu
    pay_ru_accept_offer = 'pay_ru_accept_offer',
    pay_eu_accept_offer = 'pay_eu_accept_offer',
}

export const ActionsMap = {
    hello: [
        [
            {
                text: 'Начать',
                callback_data: CommandList.hello,
            },
        ]
    ],
    start: [
        [
            {
                text: 'Получить рабочий пак',
                callback_data: CommandList.receive,
            },
        ],
        [
            {
                text: 'Что внутри?',
                callback_data: CommandList.content,
            },
        ],
        [
            {
                text: 'Частые вопросы',
                callback_data: CommandList.faq,
            },
        ],
        [
            {
                text: 'Связаться со мной',
                callback_data: CommandList.contact,
            },
        ],
        [
            {
                text: 'Мои покупки',
                callback_data: CommandList.purchaseData,
            },
        ]
    ],
    payment: [
        [
            {
                text: 'Оплата из РФ(Юкасса)',
                callback_data: CommandList.payment_youkassa,
            },
        ],
        [
            {
                text: 'Оплата из других стран (Payoneer)',
                callback_data: CommandList.payment_payoneer,
            },
        ],
    ],
    pay: {
        ru: [
            [
                {
                    text: 'Оплатить 7 990₽',
                    callback_data: CommandList.pay_ru_accept_offer,
                }
            ]
        ],
        eu: [
            [
                {
                    text: 'Оплатить 7 990₽ (евро)',
                    callback_data: CommandList.pay_eu_accept_offer,
                }
            ]
        ]
    },
    download: [
        [
            {
                text: 'Перейти к договору',
                callback_data: CommandList.download_contract,
            },
        ],
        [
            {
                text: 'Перейти к политике персональных данных',
                callback_data: CommandList.download_policy,
            },
        ],
        [
            {
                text: 'Перейти к брифу по фирменному стилю',
                callback_data: CommandList.download_brief,
            },
        ],
        [
            {
                text: 'Перейти к рассчету стоимости',
                callback_data: CommandList.download_payment_calc,
            },
        ],
        [
            {
                text: 'Получить файлы еще раз',
                callback_data: CommandList.download,
            },
        ],
    ],
    exit: [
        [
            {
                text: 'Выход',
                callback_data: CommandList.exit,
            },
        ]
    ],
    exitOrRepeat: [
        [
            {
                text: 'Скачать снова',
                callback_data: CommandList.download,
            },
            {
                text: 'Вернуться в меню',
                callback_data: CommandList.exit,
            },
        ]
    ],
    contact: [
        [
            {
                text: 'Связаться со мной',
                callback_data: CommandList.contact
            }
        ]
    ],
    backOrBuy: [
        [
            {
                text: 'Купить за 7900р',
                callback_data: CommandList.buy,
            }
        ],
        [
            {
                text: 'Связаться со мной',
                callback_data: CommandList.contact,
            },
        ],
        [
            {
                text: 'Вернуться в меню',
                callback_data: CommandList.exit,
            },
        ],
    ]
};

// todo update according to the topic
export enum PurchaseResource {
    doc_pack_2025 = 'doc_pack_2025',
}

export interface PurchaseData {
    id: string,
    userId: string,
    resource: PurchaseResource,
    paymentStatus: InvoiceStatus,
    startDate: string,
    updatedDate: string,
    endDate: string,
}

export interface Session {
    username: string;
    invoice: InvoiceDetails;
    purchase: PurchaseData | null;
}

// @ts-ignore
export type BotContext = Context & Scenes.SceneContextMessageUpdate & {
    session: Session;
    callbackQuery: {
        data: {}
    };
};

export enum InvoiceStatus {
    failed = 'failed',
    pending = 'pending',
    done = 'done',
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

export interface InvoiceDetailsWithStatus extends InvoiceDetails {
    status?: InvoiceStatus;
}

export const HELLO_BUTTONS = {
    reply_markup: {
        inline_keyboard: ActionsMap.hello,
    }
};

export const START_BUTTONS = {
    reply_markup: {
        inline_keyboard: ActionsMap.start,
    }
};

export const DOWNLOAD_BUTTONS = {
    reply_markup: {
        inline_keyboard: ActionsMap.download,
    }
};

export const WHY_BETTER_BUTTONS = {
    reply_markup: {
        inline_keyboard: ActionsMap.backOrBuy,
    }
};

export const CHOOSE_PAYMENT_METHOD_BUTTONS = {
    reply_markup: {
        inline_keyboard: ActionsMap.payment,
    }
};

export const CONTENT_BUTTONS = {
    reply_markup: {
        inline_keyboard: ActionsMap.backOrBuy,
    }
};

export const FAQ_BUTTONS = {
    reply_markup: {
        inline_keyboard: ActionsMap.backOrBuy,
    }
};

export const PAY_BUTTONS_RU = {
    parse_mode: 'HTML',
    reply_markup: {
        inline_keyboard: ActionsMap.pay.ru,
    }
};
export const PAY_BUTTONS_EU = {
    parse_mode: 'HTML',
    reply_markup: {
        inline_keyboard: ActionsMap.pay.eu,
    }
};

export const CONTACT_ME_BUTTONS = {
    parse_mode: 'HTML',
    reply_markup: {
        inline_keyboard: ActionsMap.contact,
    }
};
