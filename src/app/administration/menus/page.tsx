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
  Modal,
  Form,
  ButtonGroup,
} from "react-bootstrap";

import { NotifyModal } from "@/app/components/modals";

import { FetchAllMenus, UpdateMenu } from "../admin_fetches";
import { Menu, MenuCategory } from "../admin_types";

export default function AdminMenus(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const router = useRouter();

  useEffect(() => {
    const adminToken = sessionStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

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

  useEffect(() => {
    void loadMenus();
  }, []);

  const handleEditClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setShowEditModal(true);
  };

  const handleSaveMenu = async (updatedMenu: Menu) => {
    // Assuming backend takes { menus: [updatedMenu] } or similar for update as discussed
    // For now, doing a basic update call.
    // In a real scenario, check admin_fetches.ts for expected payload.
    // I defined it as accepting MenuResponse, which usually wraps a list.
    const res = await UpdateMenu({ menus: [updatedMenu] });
    if (res && !res.data.error) {
      void loadMenus();
      setShowEditModal(false);
    } else {
      setMessage("Failed to update menu");
      setNotifyModal(true);
    }
  };

  return (
    <Container>
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
              <MenuCard menu={m} onEdit={() => handleEditClick(m)} />
            </Col>
          ))
        )}
      </Row>
      {selectedMenu && (
        <EditMenuModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          menu={selectedMenu}
          onSave={() => handleSaveMenu}
        />
      )}
    </Container>
  );
}

function MenuCard({
  menu,
  onEdit,
}: {
  menu: Menu;
  onEdit: () => void;
}): React.JSX.Element {
  // const router = useRouter();
  const categoryBadge = () => {
    switch (menu.category) {
      case MenuCategory.HOT:
        return (
          <Badge bg="danger" className="align-self-start p-2">
            HOT
          </Badge>
        );
      case MenuCategory.ICED:
        return (
          <Badge bg="primary" className="align-self-start p-2">
            ICED
          </Badge>
        );
      case MenuCategory.BAKERY:
        return (
          <Badge bg="warning" className="align-self-start p-2">
            BAKERY
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="align-self-start p-2">
            -
          </Badge>
        );
    }
  };

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/menus/${menu.imagePath}`}
        alt={menu.name}
        className="img-fluid"
        style={{ aspectRatio: "1/1", objectFit: "contain" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{menu.name}</Card.Title>
        {categoryBadge()}
        <Card.Text>Price: {menu.price} THB</Card.Text>
        <ButtonGroup className="w-100">
          <Button variant="warning" onClick={onEdit} className="w-50">
            Edit
          </Button>
          <Button variant="danger" className="w-50">
            Remove
          </Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
}

function EditMenuModal({
  show,
  onHide,
  menu,
  onSave,
}: {
  show: boolean;
  onHide: () => void;
  menu: Menu;
  onSave: (m: Menu) => void;
}) {
  const [formData, setFormData] = useState<Menu>(menu);

  useEffect(() => {
    setFormData(menu);
  }, [menu]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Menu: {menu.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="HOT">HOT</option>
              <option value="ICED">ICED</option>
              <option value="BAKERY">BAKERY</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image Path</Form.Label>
            <Form.Control
              type="text"
              name="imagePath"
              value={formData.imagePath}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
