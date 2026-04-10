"use client";

import React from "react";

import Image, { StaticImageData } from "next/image";
import { useRouter, usePathname } from "next/navigation";

import { useSelector } from "react-redux";
import { RootState } from "@/app/contexts/store";
import { selectCartEntryCount } from "./cart/cart_slice";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Stack, Badge } from "react-bootstrap";

import CartIcon from "@/static/icons/cart_icon.svg";

import { MenuCategory } from "./menu_types";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentCategory = pathname.split("/").pop();

  const cartEntryCount = useSelector((state: RootState) =>
    selectCartEntryCount(state)
  );

  const categories = [MenuCategory.HOT, MenuCategory.ICED, MenuCategory.BAKERY];

  return (
    <Stack gap={3}>
      <Nav
        fill
        variant="pills"
        className="justify-content-center border-0 mb-3"
        activeKey={currentCategory}
      >
        {categories.map((cat) => (
          <Nav.Item key={cat} className="flex-grow-1">
            <Nav.Link
              eventKey={cat}
              onClick={() => router.push(`/menus/${cat}`)}
              className="text-black border-0 px-4 py-3 rounded-0 fw-medium h-100"
              style={{
                backgroundColor:
                  currentCategory === cat ? "#ADEBB3" : "#E0EDBB",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (currentCategory !== cat)
                  e.currentTarget.style.backgroundColor = "#ADEBB3";
              }}
              onMouseLeave={(e) => {
                if (currentCategory !== cat)
                  e.currentTarget.style.backgroundColor = "#E0EDBB";
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Nav.Link>
          </Nav.Item>
        ))}
        <Nav.Item className="flex-grow-1">
          <Nav.Link
            eventKey="cart"
            onClick={() => router.push("/menus/cart")} // assuming cart route exists or handled appropriately
            className="text-black border-0 px-4 py-3 rounded-0 fw-medium h-100"
            style={{
              backgroundColor:
                currentCategory === "cart" ? "#ADEBB3" : "#E0EDBB",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (currentCategory !== "cart")
                e.currentTarget.style.backgroundColor = "#ADEBB3";
            }}
            onMouseLeave={(e) => {
              if (currentCategory !== "cart")
                e.currentTarget.style.backgroundColor = "#E0EDBB";
            }}
          >
            <Image
              src={CartIcon as StaticImageData}
              alt=""
              width={30}
              height={30}
            />
            Cart
            {cartEntryCount > 0 && (
              <Badge pill bg="danger" className="ms-2">
                {cartEntryCount}
              </Badge>
            )}
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Container>{children}</Container>
    </Stack>
  );
}
