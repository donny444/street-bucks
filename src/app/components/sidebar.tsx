"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { usePathname, useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Col, Button, Container } from "react-bootstrap";

import StreetBucksLogo from "@/static/logos/streetbucks_logo.png";
import StackIcon from "@/static/icons/stack_icon.svg";
import SignInIcon from "@/static/icons/signin_icon.svg";
import KeyIcon from "@/static/icons/key_icon.svg";
import SignOutIcon from "@/static/icons/signout_icon.svg";
import InsightIcon from "@/static/icons/insight_icon.svg";
import MenuIcon from "@/static/icons/menu_icon.svg";
import OrderIcon from "@/static/icons/order_icon.svg";
import StockIcon from "@/static/icons/stock_icon.svg";
import UserIcon from "@/static/icons/user_icon.svg";

interface NavItemProps {
  to: string;
  icon: StaticImageData;
  label: string;
  collapsed: boolean;
}
function NavItem({ to, icon, label, collapsed }: NavItemProps): JSX.Element {
  const location = usePathname();
  const isActive = location.startsWith(to);

  return (
    <Nav.Item className="w-100 mb-2" itemScope={isActive}>
      <Link
        href={to}
        className={`
          d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none transition-all duration-200
          ${collapsed ? "justify-content-center" : ""}
          nav-item-link
          ${isActive ? "bg-light bg-opacity-25" : ""}
        `}
        style={{
          color: "#FEFEFE",
        }}
      >
        <Image src={icon} alt={label} width={24} height={24} />
        {!collapsed && (
          <span className="fs-5" style={{ whiteSpace: "nowrap" }}>
            {label}
          </span>
        )}
      </Link>
    </Nav.Item>
  );
}

export default function Sidebar(): JSX.Element {
  // We need to export this state or context so the layout knows the width,
  // but for now let's just use CSS variables or a simple context if needed.
  // Or simpler: The sidebar is fixed, so we just pad the main content.
  const [collapsed, setCollapsed] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Update body padding/margin when collapsed state changes?
  // Easier approach: Just keep the sidebar fixed and let the parent handle the margin?
  // Currently the Parent in layout.tsx sets a static margin. To make it dynamic, we'd need context.
  // For this fix, let's just make sure the Sidebar component itself behaves as a fixed column.

  // To communicate with parent layout about width, we would ideally use a context.
  // For now, let's simply render it. The issue is likely that the parent <Row>
  // didn't account for the fixed positioning of this col.

  const router = useRouter();

  // Access sessionStorage only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdminToken(sessionStorage.getItem("admin-token"));
    }
  }, []);

  const navItems = [
    {
      to: "/dashboard",
      icon: InsightIcon as StaticImageData,
      label: "Dashboard",
    },
    { to: "/menus", icon: MenuIcon as StaticImageData, label: "Menus" },
    { to: "/orders", icon: OrderIcon as StaticImageData, label: "Orders" },
    { to: "/stocks", icon: StockIcon as StaticImageData, label: "Stocks" },
    { to: "/users", icon: UserIcon as StaticImageData, label: "Users" },
  ];

  return (
    <Col
      xs={collapsed ? 1 : 2}
      className={`
        d-flex flex-column vh-100 fixed-top start-0 z-3 transition-all duration-300
        ${collapsed ? "width-collapsed" : "width-expanded"}
      `}
      style={{
        backgroundColor: "#0A7C5D",
        width: collapsed ? "80px" : "260px",
      }}
    >
      <style jsx global>{`
        :root {
          --sidebar-width: ${collapsed ? "80px" : "260px"};
        }
        .main-content-wrapper {
          margin-left: var(--sidebar-width);
          transition: margin-left 0.3s;
        }
        .nav-item-link:hover {
          background-color: #adebb3 !important;
          color: #000000 !important;
        }
        .nav-item-link:hover span {
          color: #000000 !important;
        }
      `}</style>

      {/* Logo & Toggle */}
      <div className="d-flex flex-column p-3 border-bottom border-light border-opacity-25">
        <div
          className={`d-flex align-items-center mb-3 ${collapsed ? "justify-content-center" : "gap-2"}`}
        >
          <Image src={StreetBucksLogo} alt="logo" width={40} height={40} />
          {!collapsed && (
            <span className="h4 m-0 fw-bold text-white tracking-wide">
              STREETBUCKS
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-link p-0 border-0 d-flex align-items-center text-white opacity-75 hover-opacity-100"
          style={{
            width: "fit-content",
            alignSelf: collapsed ? "center" : "flex-start",
          }}
        >
          <Image
            src={StackIcon as StaticImageData}
            alt="toggle"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* Navigation */}
      <Nav className="flex-column p-3 flex-grow-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </Nav>

      {/* Footer */}
      <div className="p-3 border-top border-light border-opacity-25 mt-auto">
        {!collapsed &&
          (adminToken ? (
            <Container className="d-flex flex-column gap-2 p-0">
              <Button
                onClick={() => router.push("/administration")}
                variant="outline-light"
                className="w-100 d-flex justify-content-center align-items-center gap-2"
              >
                <Image
                  src={KeyIcon as StaticImageData}
                  alt="admin-icon"
                  width={30}
                  height={30}
                />
                To Admin Section
              </Button>
              <Button
                onClick={() => {
                  sessionStorage.removeItem("admin-token");
                  setAdminToken(null);
                  router.push("/administration");
                }}
                variant="danger"
                className="w-100 d-flex justify-content-center align-items-center gap-2"
              >
                <Image
                  src={SignOutIcon as StaticImageData}
                  alt="sign-out-icon"
                  width={30}
                  height={30}
                />
                Sign-Out from Admin
              </Button>
            </Container>
          ) : (
            <Link href="/administration" className="text-decoration-none">
              <Button
                variant="primary"
                className="w-100 d-flex justify-content-center align-items-center gap-2"
              >
                <Image
                  src={SignInIcon as StaticImageData}
                  alt="sign-in-icon"
                  width={30}
                  height={30}
                />
                Admin Sign-In
              </Button>
            </Link>
          ))}
      </div>
    </Col>
  );
}
