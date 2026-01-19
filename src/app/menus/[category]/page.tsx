"use client";

import { useState, useEffect } from "react";
import { FetchMenusByCategory } from "@/app/fetches/menu_fetch";
import { Menu, MenuCategory } from "../menu_types";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

export default function MenusByCategory({ params }: { params: { category: MenuCategory }}): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const menuCategory = params.category;

  useEffect(() => {
    const loadMenus = async () => {
      const fetchedMenus = await FetchMenusByCategory(menuCategory);
      if (!fetchedMenus) {
        setMessage("Failed to load bakery menus.");
        setModal(true);
      }

      const responseBody = fetchedMenus?.data;
      if (responseBody?.menus) {
        setMenus(responseBody.menus);
      }
    };
    loadMenus();
  }, [menuCategory]);

  return (
    <Container>
      {modal ? (
        <Modal show={modal} onHide={() => setModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Row>
          {menus.map((menu) => (
            <Col key={menu.name} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <MenuCard menu={menu} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

function MenuCard({ menu }: { menu: Menu }): React.JSX.Element {
  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={menu.imagePath}
        alt={menu.name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{menu.name}</Card.Title>
        <Card.Text>Price: {menu.price}</Card.Text>
        <Button variant="primary" className="mt-auto">
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}
