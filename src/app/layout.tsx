import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "@/styles/globals.css";

import { ThemeProvider } from "@/components/stripe/ThemeProvider";

export const metadata: Metadata = {
  title: "PharmaLink | Bridging Health Service Gaps with Innovative Care",
  description: "The Pan-African clinical network connecting peak performers across the healthcare landscape.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('hds-theme');
                    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                    if (!theme && supportDarkMode) theme = 'dark';
                    if (!theme) theme = 'light';
                    document.documentElement.setAttribute('data-theme', theme === 'system' ? (supportDarkMode ? 'dark' : 'light') : theme);
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>
        <body suppressHydrationWarning>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
