import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthProvider from "@/context/AuthProvider";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechScribe",
  description: "Assignment help platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={geist.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AuthProvider>
              <Script
                src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
                strategy="beforeInteractive"
              />
              {children}
            </AuthProvider>
            <Toaster position="top-right" richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}