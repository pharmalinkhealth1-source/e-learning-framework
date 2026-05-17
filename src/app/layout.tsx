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
          {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
          <script
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var t=localStorage.getItem('hds-theme'),d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(!t&&d)t='dark';if(!t)t='light';document.documentElement.setAttribute('data-theme',t==='system'?(d?'dark':'light'):t);}catch(e){}})();`,
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
