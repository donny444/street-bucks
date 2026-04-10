"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Stack } from "react-bootstrap";

enum AdminSection {
  BRANCHES = "branches",
  MENUS = "menus",
  ORDERS = "orders",
  RECIPES = "recipes",
  USERS = "users",
}

export default function AdministrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSection = pathname.split("/").pop();

  useEffect(() => {
    // Check if we're on a subpage (not the main administration page)
    const isSubpage = pathname !== "/administration";

    if (isSubpage) {
      const adminToken = sessionStorage.getItem("admin-token");
      if (!adminToken) {
        router.push("/administration");
      }
    }
  }, [pathname, router]);

  const sections = [
    AdminSection.BRANCHES,
    AdminSection.MENUS,
    AdminSection.ORDERS,
    AdminSection.RECIPES,
    AdminSection.USERS,
  ];

  return (
    <Stack gap={3}>
      <Nav
        fill
        variant="pills"
        className="justify-content-center border-0 mb-3"
        activeKey={currentSection}
      >
        {sections.map((section) => (
          <Nav.Item key={section} className="flex-grow-1">
            <Nav.Link
              eventKey={section}
              onClick={() => {
                const adminToken = sessionStorage.getItem("admin-token");
                if (adminToken) {
                  router.push(`/administration/${section}`);
                } else {
                  router.push("/administration");
                }
              }}
              className="text-black border-0 px-4 py-3 rounded-0 fw-medium h-100"
              style={{
                backgroundColor:
                  currentSection === section ? "#ADEBB3" : "#E0EDBB",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (currentSection !== section)
                  e.currentTarget.style.backgroundColor = "#ADEBB3";
              }}
              onMouseLeave={(e) => {
                if (currentSection !== section)
                  e.currentTarget.style.backgroundColor = "#E0EDBB";
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Container>{children}</Container>
    </Stack>
  );
}
