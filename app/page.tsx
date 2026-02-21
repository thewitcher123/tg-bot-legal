import Link from "next/link";
import {NavBar} from "@/app/components/NavBar";

const features = [
    {
        href: "/documents",
        title: "Documents",
        description: "Manage privacy policies, terms, and legal files",
        icon: "📄",
    },
    {
        href: "/packages",
        title: "Packages",
        description: "Configure pricing plans and subscription durations",
        icon: "📦",
    },
];

export default function HomePage() {
    return (
        <>
            <NavBar/>
            <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-950/80 to-zinc-900">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
                            Admin Dashboard
                        </h1>
                        <p className="mt-6 text-lg text-zinc-400">
                            Manage your documents and pricing packages efficiently
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {features.map(({
                                           href,
                                           title,
                                           description,
                                           icon
                                       }) => (
                            <Link
                                key={href}
                                href={href}
                                className="group relative rounded-2xl border border-zinc-800 bg-zinc-950/50 p-8 shadow-2xl shadow-black/40 transition-all hover:border-zinc-600 hover:bg-zinc-950/70 hover:shadow-emerald-500/10 hover:shadow-2xl"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-indigo-500/0 opacity-0 transition group-hover:opacity-100"/>

                                <div className="relative flex items-start gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-900/50 text-2xl group-hover:scale-110">
                                        {icon}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="mb-2 text-xl font-semibold text-zinc-100">
                                            {title}
                                        </h3>
                                        <p className="text-zinc-400">{description}</p>
                                    </div>
                                </div>

                                <div className="absolute right-6 top-6 h-px w-24 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0 opacity-0 transition group-hover:opacity-100"/>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}