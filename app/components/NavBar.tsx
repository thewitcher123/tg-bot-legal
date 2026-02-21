"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

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
];

export function NavBar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xl font-bold text-zinc-100">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-900/50 text-sm">
            🚀
          </span>
                    Admin Panel
                </div>

                <div className="flex items-center gap-1">
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
                                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                    isActive
                                        ? "bg-emerald-500/10 text-emerald-400 ring-2 ring-emerald-500/30"
                                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute -left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-400"/>
                                )}
                                <span>{icon}</span>
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}