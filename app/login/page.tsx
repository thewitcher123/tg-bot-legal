// app/admin/login/page.tsx
"use client";

import {useSearchParams, useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import {useCookies} from "@/app/hooks/useCookies";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const cookies = useCookies();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    // app/admin/login/page.tsx
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({password}),
            });

            if (res.ok) {
                // ✅ ПРАВИЛЬНЫЕ options — объект!
                cookies.set("admin-session", "valid", {
                    expires: 7,  // число дней
                    secure: process.env.NODE_ENV === "production",
                    path: "/",
                    sameSite: "lax",
                });
                router.push(callbackUrl);
                router.refresh();
                window.location.reload();
            } else {
                setError("Invalid password");
            }
        } catch (err) {
            setError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    // Автологин если уже авторизован
    useEffect(() => {
        if (document.cookie.includes("admin-session=valid")) {
            router.push(callbackUrl);
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900">
            <div className="w-full max-w-md p-8 bg-zinc-950/90 backdrop-blur-xl rounded-3xl border border-zinc-800 shadow-2xl shadow-black/50">
                <div className="text-center mb-8">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-zinc-800 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/30">
                        <svg className="w-10 h-10 text-emerald-400"
                             fill="none"
                             stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-200 bg-clip-text text-transparent mb-2">
                        Admin Panel
                    </h1>
                    <p className="text-zinc-400">Enter password to continue</p>
                </div>

                <form onSubmit={handleLogin}
                      className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:bg-zinc-900 transition-all shadow-inner"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !password.trim()}
                        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-500 hover:to-emerald-400 focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                    <p className="text-xs text-zinc-500">
                        Need access? Contact administrator
                    </p>
                </div>
            </div>
        </div>
    );
}
