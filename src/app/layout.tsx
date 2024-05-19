import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes'
import Navbar from "@/components/navigationBar/navbar";
import { AuthProvider } from "@/context/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
            <body className={`${inter.className} ${`h-[100vh]`}`}>
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem={true}
                    >
                        <Navbar />
                        <main className="flex h-full">
                            {children}
                        </main>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
