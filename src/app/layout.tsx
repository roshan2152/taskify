import type {Metadata} from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes'
import Navbar from "@/components/navigationBar/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata:  Metadata = {
    title: "Taskify",
    description: "Managing tasks got easier with Taskify",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={true}
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
