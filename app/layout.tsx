import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SocialSkill AI - Professional Communication Training",
  description: "Advanced AI-powered platform for improving communication, posture, emotion recognition, and speech analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen`}
      >
        <Navbar />
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
