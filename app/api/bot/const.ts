export const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const YOKASSA_PROVIDER_TOKEN = process.env.YOKASSA_PROVIDER_TOKEN + '';
export const SMART_GLOCAL_TEST_PROVIDER_TOKEN = process.env.SMART_GLOCAL_TEST_PROVIDER_TOKEN + '';
export const ENVIRONMENT = process.env.NODE_ENV || '';
export const PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000;
export const VERCEL_URL = `${process.env.VERCEL_URL}`;