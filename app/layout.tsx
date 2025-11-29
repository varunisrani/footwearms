import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/layout/client-layout";
import { ThemeProvider } from "@/lib/contexts/theme-context";

export const metadata: Metadata = {
  title: "Footwear Management System",
  description: "Manage your footwear inventory, sales, and customers",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// FOUC Prevention Script - runs before React hydration
const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.add(theme);
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
