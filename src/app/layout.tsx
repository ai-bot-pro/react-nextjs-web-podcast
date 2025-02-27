import "./globals.css";

import { Toaster } from "sonner";
import NextScript from "next/script";
import Script from "next/script";
import { Metadata } from "next";
import { Body } from "@/layouts/body";
import { AudioContextProvider } from "@/contexts/AudioContext";

export const metadata: Metadata = {
  viewport: {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <NextScript strategy="afterInteractive" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-TYVCKPTYH1"
        />
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TYVCKPTYH1');
            `,
          }}
        />
      </head>
      <Body>
        <AudioContextProvider>
          <Toaster position="top-center" richColors />
          {children}
        </AudioContextProvider>
      </Body>
    </html>
  );
}
