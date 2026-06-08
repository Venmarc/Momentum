import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./components/providers";
import LayoutShell from "./components/layout-shell";
import ToastContainer from "./components/toast-container";
import { ensureProfile } from "./actions/auth-actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Momentum",
  description: "Personal operating system for habits, fitness, and wellness tracker",
  icons: {
    icon: "/logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Gracefully guarantee that Clerk profile matches a Supabase profile record
  await ensureProfile();

  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
        style={{ colorScheme: 'dark' }}
      >
        <body className="min-h-full bg-[#030303] text-[#f4f4f5] flex flex-col md:flex-row font-sans">
          <Providers>
            <LayoutShell>
              {children}
            </LayoutShell>
            <ToastContainer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
