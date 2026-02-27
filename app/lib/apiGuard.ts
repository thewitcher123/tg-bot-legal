// app/lib/apiGuard.ts
import {NextRequest, NextResponse} from "next/server";

const BOT_USER_AGENT = "Telegram-Bot-API";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export function apiGuard(request: NextRequest) {
    const userAgent = request.headers.get("user-agent") || "";
    const telegramToken = request.headers.get("telegram-bot-token") || "";

    // ✅ Разрешаем боту
    if (userAgent.includes(BOT_USER_AGENT) && telegramToken === BOT_TOKEN) {
        return NextResponse.next();
    }

    // ✅ Разрешаем авторизованным админам
    const session = request.cookies.get("admin-session")?.value;
    if (session === "valid") {
        return NextResponse.next();
    }

    return NextResponse.json(
        {error: "Unauthorized — Bot or Admin only"},
        {status: 401}
    );
}
