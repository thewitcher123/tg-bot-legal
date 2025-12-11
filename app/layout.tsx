import type {Metadata} from "next";
import Head from 'next/head';

export const metadata: Metadata = {
    title: "LegalBot",
    description: "TG bot for easy draft docs download",
};

export default async function RootLayout() {
    return (
        <html lang="en">
        <Head>
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"/>
        </Head>
        <body>
        <main>Hello old</main>
        </body>
        </html>
    );
}
