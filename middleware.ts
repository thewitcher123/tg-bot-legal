import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {cookies} from "next/headers";

export function middleware(request: NextRequest) {
    console.log("🛡️ Middleware:", request.nextUrl.pathname); // ← ЛОГ

    const sessionCookie = cookies().get("admin-session")?.value;
    console.log("🍪 Session:", !!sessionCookie); // ← ЛОГ

    // Разрешаем публичные маршруты
    const publicPaths = ["/", "/login"];
    if (publicPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    // Проверяем сессию
    if (!sessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// ✅ ПРАВИЛЬНЫЙ matcher — защищает ВСЕ кроме исключений
export const config = {
    matcher: [
        /*
         * Защищаем ВСЕ страницы кроме:
         * - /api/* (API роуты)
         * - /_next/* (статические файлы Next.js)
         * - изображения, favicon
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
