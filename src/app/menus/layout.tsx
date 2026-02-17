"use client";

import React from "react";

import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Tabs, Tab, Stack } from "react-bootstrap";

import { MenuCategory } from "./menu_types";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Stack>
      <Tabs
        transition={false}
        onSelect={(t) => router.push(`/menus/${t}`)}
        className="mb-3"
        justify
      >
        <Tab eventKey={MenuCategory.HOT} title={MenuCategory.HOT} />
        <Tab eventKey={MenuCategory.ICED} title={MenuCategory.ICED} />
        <Tab eventKey={MenuCategory.BAKERY} title={MenuCategory.BAKERY} />
      </Tabs>
      <Container>{children}</Container>
    </Stack>
  );
}
