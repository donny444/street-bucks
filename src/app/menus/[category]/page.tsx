"use client";

import { useState, useEffect } from "react";

import { FetchMenusByCategory } from "../menu_fetches";
import { Menu, MenuCategory } from "../menu_types";
import { MenuModal } from "../menu_modals";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import { NotifyModal } from "@/app/components/modals";

export default function MenusByCategory({
  params,
}: {
  params: { category: MenuCategory };
}): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const menuCategory = params.category;

  useEffect(() => {
    const loadMenus = async () => {
      const fetchedMenus = await FetchMenusByCategory(menuCategory);
      if (!fetchedMenus) {
        setMessage(`Failed to load ${menuCategory} menus.`);
        setNotifyModal(true);
      }

      const responseBody = fetchedMenus?.data;
      if (responseBody?.error) {
        setMessage(responseBody.error);
      }
      if (responseBody?.message && responseBody?.menus) {
        setMessage(responseBody.message);
        setMenus(responseBody?.menus);
      }
    };
    loadMenus();
  }, [menuCategory]);

  return (
    <Container>
      <>
        <NotifyModal
          show={notifyModal}
          onHide={() => setNotifyModal(false)}
          title="Menu Fetching Error"
          message={message}
        />
        <Row>
          {menus.map((menu) => (
            <Col key={menu.name} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <MenuCard menu={menu} />
            </Col>
          ))}
        </Row>
      </>
    </Container>
  );
}

function MenuCard({ menu }: { menu: Menu }): React.JSX.Element {
  const [menuModal, setMenuModal] = useState<boolean>(false);

  return (
    <>
      <MenuModal
        show={menuModal}
        onHide={() => setMenuModal(false)}
        menu={menu}
      />
      <Card className="h-100">
        <Card.Img
          variant="top"
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${menu.imagePath}`}
          alt={menu.name}
          width={200}
          height={200}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{menu.name}</Card.Title>
          <Card.Text>Price: {menu.price}</Card.Text>
          <Button
            variant="primary"
            onClick={() => setMenuModal(true)}
            className="mt-auto"
          >
            Add
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}
