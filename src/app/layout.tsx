import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes'
import Navbar from "@/components/navigationBar/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import { getUser } from "@/backend/user";
import { auth } from "@/dbConfig/auth";
import { UserType } from "@/types/userType";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Taskify",
    description: "Managing tasks got easier with Taskify",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    let userData = null;
    if (auth.currentUser?.uid) {

        userData = await getUser() as UserType;
        console.log(userData);
    }
    console.log(userData);

    return (
        <html lang="en">
            <body className={`${inter.className} ${`h-[100vh]`}`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={true}
                >
                    <Navbar />
                    <div className="flex h-full">
                        <Sidebar  />
                        <main className="flex-1">{children}</main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
