import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mystery Message",
  description: "Dive into the World of Mysterious and Annonymous Messages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Toaster richColors />
          {children}
          <footer className="flex sm:flex-row flex-col justify-center items-center gap-3 text-center p-4 md:p-6 bg-gray-900 text-white">
            <p>© 2026 Mystery Message.</p>
            <p>Made with ❤️ by Arin.</p>
          </footer>
        </body>
      </AuthProvider>
    </html>
  );
}
