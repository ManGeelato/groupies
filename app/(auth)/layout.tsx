import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import '../globals.css'

export const metadata = {
    title: 'Groupies',
    description: 'A chat app for the modern generation'
}

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({children} : {
    children: React.ReactNode,
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className}`} style={{ background: 'linear-gradient(to bottom, #0F07D2, #121417)' }}>
                    <div className="w-full flex justify-center items-center min-h-screen">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}