// middleware.ts — ИСПРАВЛЕННАЯ ВЕРСИЯ
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {cookies} from "next/headers";

const BOT_USER_AGENT = process.env.BOT_USER_AGENT!;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export function middleware(request: NextRequest) {
    console.log("🛡️ Middleware:", request.nextUrl.pathname);

    const pathname = request.nextUrl.pathname;
    const sessionCookie = cookies().get("admin-session")?.value;
    console.log({
        msg: "🍪 Session",
        sessionCookie
    });

    // ✅ ПУБЛИЧНЫЕ МАРШРУТЫ (включая API логин!)
    const publicPaths = ["/", "/login", "/api/admin/login"];
    if (publicPaths.includes(pathname)) {
        console.log({
            msg: "✅ Public route allowed",
        });
        return NextResponse.next();
    }

    // ✅ ЗАЩИТА СТРАНИЦ (не API)
    if (!pathname.startsWith("/api")) {
        if (!sessionCookie) {
            console.log({
                msg: "🚫 No session → login",
            });
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // ✅ ЗАЩИТА API /api/*
    console.log({
        msg: "🔒 Protecting API route",
    });

    // Бот
    const userAgent = request.headers.get("user-agent") || "";
    const telegramToken = request.headers.get("telegram-bot-token") || "";
    if (userAgent.includes(BOT_USER_AGENT) && telegramToken === BOT_TOKEN) {
        console.log({
            msg: "🤖 Bot ✅",
        });
        return NextResponse.next();
    }

    // Админ
    if (sessionCookie === "valid") {
        console.log({
            msg: "‍💼 Admin ✅",
        });
        return NextResponse.next();
    }

    console.log({
        msg: "‍🚫 API denied",
    });
    return NextResponse.json(
        {error: "Unauthorized — Admin or Bot only"},
        {status: 401}
    );
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
