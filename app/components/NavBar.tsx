"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import {useCookies} from "@/app/hooks/useCookies";

const navItems = [
    {
        href: "/",
        label: "Home",
        icon: "🏠"
    },
    {
        href: "/documents",
        label: "Documents",
        icon: "📄"
    },
    {
        href: "/packages",
        label: "Packages",
        icon: "📦"
    },
    {
        href: "/document-package",
        label: "Associations",
        icon: "🔗"
    },
];

const noAuthNavItems = [
    {
        href: "/",
        label: "Home",
        icon: "🏠"
    },
    {
        href: "/login",
        label: "Login",
        icon: "🔑"
    },
];

export function NavBar() {
    const pathname = usePathname();
    const router = useRouter();
    const cookies = useCookies();

    // ✅ HYDRATION FIX
    const [isMounted, setIsMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setIsAdmin(cookies.get("admin-session") === "valid");
    }, [cookies]);

    const handleLogout = () => {
        cookies.remove("admin-session");
        setIsAdmin(false);
        router.push("/login");
        router.refresh();
    };

    // ❌ СЕРВЕРНЫЙ РЕНДЕР — базовый NavBar
    if (!isMounted) {
        return (
            <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-xl font-bold text-zinc-100">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-900/50 text-sm">
              🚀
            </span>
                        <Link href="/"
                              className="text-zinc-400 hover:text-zinc-200">
                            My App
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        {noAuthNavItems.slice(0, 1).map(({
                                                             href,
                                                             label,
                                                             icon
                                                         }) => ( // только Home
                            <Link
                                key={href}
                                href={href}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                            >
                                {icon} {label}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                        >
                            🔑 Login
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    // ✅ КЛИЕНТСКИЙ РЕНДЕР
    const showAdminNav = isAdmin;

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xl font-bold text-zinc-100">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-900/50 text-sm">
            🚀
          </span>
                    <Link
                        href="/"
                        className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                            pathname === "/"
                                ? "bg-emerald-500/10 text-emerald-400 ring-2 ring-emerald-500/30"
                                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                        }`}
                    >
                        {showAdminNav ? "Admin Panel" : "My App"}
                    </Link>
                </div>

                <div className="flex items-center gap-1">
                    {showAdminNav ? (
                        <>
                            {navItems.map(({
                                               href,
                                               label,
                                               icon
                                           }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                            isActive
                                                ? "bg-emerald-500/10 text-emerald-400 ring-2 ring-emerald-500/30"
                                                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                        }`}
                                    >
                                        <span>{icon}</span>
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {noAuthNavItems.map(({
                                                     href,
                                                     label,
                                                     icon
                                                 }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                            isActive
                                                ? "bg-emerald-500/10 text-emerald-400 ring-2 ring-emerald-500/30"
                                                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                        }`}
                                    >
                                        <span>{icon}</span>
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
