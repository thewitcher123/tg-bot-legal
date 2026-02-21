import {ReactNode} from "react";
import type {Metadata} from "next";

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
        {children}
        </body>
        </html>
    );
}
