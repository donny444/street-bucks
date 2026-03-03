import React from "react";
import "./globals.css";

import { unstable_noStore as noStore } from "next/cache";

import ReduxProvider from "./contexts";
import ServiceWorkerProvider from "./components/ServiceWorkerProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";

import { peaceSans, sodoSans } from "./utils/fonts";

export const metadata = {
  title: "StreetBucks",
  description: "Cafeteria POS",
  manifest: "/manifest.json",
  themeColor: "#0A7C5D",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StreetBucks",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

import Sidebar from "./components/sidebar";
import Footer from "./components/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();

  return (
    <html lang="en" className={`${peaceSans.variable} ${sodoSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0A7C5D" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="StreetBucks" />
        <link rel="apple-touch-icon" href="/icons/street_bucks_192x192.png" />
      </head>
      <body>
        <ServiceWorkerProvider>
          <ReduxProvider>
            <div className="d-flex vh-100">
              <Sidebar />
              {/* distinct class for connection with sidebar state via CSS variables */}
              <div className="flex-grow-1 main-content-wrapper">
                <Container className="vh-100 p-0 m-0">{children}</Container>
                <Footer />
              </div>
            </div>
          </ReduxProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
