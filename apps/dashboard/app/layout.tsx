import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@optim/ui/components/sonner";
import "@optim/ui/styles/globals.css";
import "./globals.css";

const inter = localFont({
  src: "./fonts/InterVariableFont.ttf",
  variable: "--font-sans"
})

export const metadata: Metadata = {
  title: "OptimListing Dashboard",
  description: "AI-powered marketplace listing optimization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
