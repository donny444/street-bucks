"use client";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
} from "react-bootstrap";

import { NotifyModal } from "@/app/components/modals";

import { FetchAllMenus } from "../admin_fetches";
import { Menu, MenuCategory } from "../admin_types";

export default function AdminMenus(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  useEffect(() => {
    const loadMenus = async () => {
      const fetchedMenus = await FetchAllMenus();
      if (!fetchedMenus) {
        setMessage("Failed to load menus.");
        setError(true);
        setNotifyModal(true);
        return;
      }

      const responseBody = fetchedMenus.data;
      if (responseBody?.error) {
        setMessage(responseBody.error);
        setError(true);
        setNotifyModal(true);
      }
      if (responseBody?.menus) {
        setMenus(responseBody.menus);
      }
    };
    void loadMenus();
  }, []);

  return (
    <Container className="mt-4">
      <>
        <NotifyModal
          show={notifyModal}
          onHide={() => setNotifyModal(false)}
          title="Menu Fetching Error"
          message={message}
        />
        <p className="h2">Menu Management</p>
        {error && <Alert variant="danger">{message}</Alert>}
        <Row>
          {menus.length < 1 ? (
            <Col className="text-center">No menus found.</Col>
          ) : (
            menus.map((m) => (
              <Col key={m.name} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <MenuCard menu={m} />
              </Col>
            ))
          )}
        </Row>
      </>
    </Container>
  );
}

function MenuCard({ menu }: { menu: Menu }): React.JSX.Element {
  const categoryBadge = () => {
    switch (menu.category) {
      case MenuCategory.HOT:
        return <Badge bg="danger">HOT</Badge>;
      case MenuCategory.ICED:
        return <Badge bg="primary">ICED</Badge>;
      case MenuCategory.BAKERY:
        return <Badge bg="warning">BAKERY</Badge>;
      default:
        return <Badge bg="secondary">-</Badge>;
    }
  };

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/menus/${menu.imagePath}`}
        alt={menu.name}
        width={200}
        height={200}
        style={{ objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{menu.name}</Card.Title>
        {categoryBadge()}
        <Card.Text>Price: {menu.price}</Card.Text>
        <span className="mt-auto">
          <Button variant="warning">Edit</Button>
          <Button variant="danger">Remove</Button>
        </span>
      </Card.Body>
    </Card>
  );
}
