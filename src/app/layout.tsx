import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SlideNavigation from "@/components/SlideNavigation";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claude Code: Development Presentation",
  description:
    "A comprehensive webinar presentation about Claude Code - the agentic coding tool by Anthropic that lives in your terminal, understands your codebase, and helps you ship faster through natural language commands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-primary text-text-primary font-sans antialiased">
        {children}
        <SlideNavigation />
      </body>
    </html>
  );
}
