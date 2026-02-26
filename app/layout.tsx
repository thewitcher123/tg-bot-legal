import {ReactNode} from "react";
import type {Metadata} from "next";

import {NavBar} from "@/app/components/NavBar";

import "./globals.css";

export const metadata: Metadata = {
    title: "LegalBot",
    description: "TG bot for easy draft docs download",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <NavBar/>
        {children}
        </body>
        </html>
    );
}
