"use client";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, Form } from "react-bootstrap";

import { MenuForm, MenuCategory } from "../../admin_types";
import { EditMenu, FetchMenuForm } from "../../admin_fetches";

export default function EditMenuPage({
  params,
}: {
  params: { name: string };
}): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [menuForm, setMenuForm] = useState<MenuForm>();
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const menuName = params.name;

  const router = useRouter();

  useEffect(() => {
    const adminToken = sessionStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  const loadMenuForm = async () => {
    const fetchedMenuForm = await FetchMenuForm(menuName);
    if (!fetchedMenuForm) {
      setMessage("Failed to load menu form.");
      setError(true);
      setNotifyModal(true);
      return;
    }

    const responseBody = fetchedMenuForm.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
      setError(true);
      setNotifyModal(true);
    }
    if (responseBody?.menu_form) {
      setMenuForm(responseBody.menu_form);
    }
  };

  useEffect(() => {
    void loadMenuForm();
  }, []);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Card className="w-75 mx-auto mt-3">
      <Card.Header>Edit Menu Detail</Card.Header>
      <Card.Body>
        <Form onSubmit={handleEdit}>
          <Form.Group className="mb-3" controlId="formMenuName">
            <Form.Label>Menu Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter menu name"
              value={menuForm?.name}
              onChange={(e) =>
                setMenuForm((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMenuPrice">
            <Form.Label>Price (THB)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter menu price"
              value={menuForm?.price}
              onChange={(e) =>
                setMenuForm((prev) =>
                  prev ? { ...prev, price: parseFloat(e.target.value) } : prev
                )
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMenuCategory">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={menuForm?.category}
              onChange={(e) =>
                setMenuForm((prev) =>
                  prev
                    ? { ...prev, category: e.target.value as MenuCategory }
                    : prev
                )
              }
            >
              <option value={MenuCategory.HOT}>{MenuCategory.HOT}</option>
              <option value={MenuCategory.ICED}>{MenuCategory.ICED}</option>
              <option value={MenuCategory.BAKERY}>{MenuCategory.BAKERY}</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMenuImage">
            <Form.Label>Upload Image File</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) =>
                setMenuForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        file: (e.target as HTMLInputElement).files
                          ? (e.target as HTMLInputElement).files![0]
                          : null,
                      }
                    : prev
                )
              }
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Save Changes
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
