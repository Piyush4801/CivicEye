import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import AIChatWidget from '@/components/AIChatWidget';
import { Header } from '@/components/layout/Header'; // Although no longer used directly, keeping for history if needed
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CivicEye AI - Smart City Dashboard",
  description: "AI-powered civic engagement for a better society",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen flex`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 bg-secondary/30">
            <TopBar />
            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
          </div>
          <AIChatWidget />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
