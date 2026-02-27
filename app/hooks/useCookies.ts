// app/hooks/useCookies.ts
"use client";
import {useState, useEffect} from "react";
import Cookies from "js-cookie";

type CookieAttributes = Parameters<typeof Cookies.set>[2];

export function useCookies() {
    const [cookies, setCookies] = useState<Record<string, string>>(() => {
        try {
            return Cookies.get() || {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        const handleChange = () => {
            try {
                setCookies(Cookies.get() || {});
            } catch {
                setCookies({});
            }
        };
        window.addEventListener("storage", handleChange);
        return () => window.removeEventListener("storage", handleChange);
    }, []);

    const get = (name: string): string | undefined => cookies[name];

    const set = (name: string, value: string, options?: CookieAttributes) => {
        try {
            Cookies.set(name, value, options || {});
            setCookies((prev) => ({
                ...prev,
                [name]: value
            }));
        } catch (error) {
            console.error("Failed to set cookie:", error);
        }
    };

    const remove = (name: string, options?: CookieAttributes) => {
        try {
            Cookies.remove(name, options || {});
            setCookies((prev) => {
                const newCookies = {...prev};
                delete newCookies[name];
                return newCookies;
            });
        } catch (error) {
            console.error("Failed to remove cookie:", error);
        }
    };

    return {
        get,
        set,
        remove
    };
}
