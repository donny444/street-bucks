import React from "react";
import "./globals.css";

import { unstable_noStore as noStore } from "next/cache";

import ReduxProvider from "./contexts";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";

export const metadata = {
  title: "StreetBucks",
  description: "Cafeteria POS",
};

import Sidebar from "./components/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Row>
            <Sidebar />
            <Col>
              <Container>{children}</Container>
            </Col>
          </Row>
          <Row>
            <Container>© {new Date().getFullYear()} StreetBucks</Container>
          </Row>
        </ReduxProvider>
      </body>
    </html>
  );
}
