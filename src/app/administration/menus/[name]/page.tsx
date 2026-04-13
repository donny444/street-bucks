"use client";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, Form, Container } from "react-bootstrap";

import { NotifyModal } from "@/app/components/modals";

import { MenuForm, MenuCategory, IngredientEntry } from "../../admin_types";
import {
  EditMenu,
  FetchIngredientList,
  FetchMenuForm,
} from "../../admin_fetches";

export default function MenuDetailsPage({
  params,
}: {
  params: { name: string };
}): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const menuName = params.name;

  const router = useRouter();

  useEffect(() => {
    const adminToken = sessionStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  return (
    <Container>
      <EditMenuCard
        name={menuName}
        message={message}
        setMessage={setMessage}
        error={error}
        setError={setError}
        notifyModal={notifyModal}
        setNotifyModal={setNotifyModal}
      />
    </Container>
  );
}

interface EditMenuCardProps {
  name: string;
  message: string;
  setMessage: (msg: string) => void;
  error: boolean;
  setError: (err: boolean) => void;
  notifyModal: boolean;
  setNotifyModal: (notify: boolean) => void;
}
function EditMenuCard({
  name,
  message,
  setMessage,
  error,
  setError,
  notifyModal,
  setNotifyModal,
}: EditMenuCardProps): React.JSX.Element {
  const [menuForm, setMenuForm] = useState<MenuForm>();

  useEffect(() => {
    const loadMenuForm = async () => {
      const fetchedMenuForm = await FetchMenuForm(name);
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
    void loadMenuForm();
  }, [name, setMessage, setError, setNotifyModal]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="Menu Info Error"
        message={message}
      />
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
                <option value={MenuCategory.BAKERY}>
                  {MenuCategory.BAKERY}
                </option>
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
    </>
  );
}

interface EditIngredientsCardProps {
  name: string;
  message: string;
  setMessage: (msg: string) => void;
  error: boolean;
  setError: (err: boolean) => void;
  notifyModal: boolean;
  setNotifyModal: (notify: boolean) => void;
}
function EditIngredientsCard({
  name,
  message,
  setMessage,
  error,
  setError,
  notifyModal,
  setNotifyModal,
}: EditIngredientsCardProps): React.JSX.Element {
  const [ingredientList, setIngredientList] = useState<IngredientEntry[]>([]);

  useEffect(() => {
    const loadIngredientList = async () => {
      const fetchedIngredientList = await FetchIngredientList(name);
      if (!fetchedIngredientList) {
        setMessage("Failed to load ingredient list.");
        setError(true);
        setNotifyModal(true);
        return;
      }

      const responseBody = fetchedIngredientList.data;
      if (responseBody?.error) {
        setMessage(responseBody.error);
        setError(true);
        setNotifyModal(true);
      }
      if (responseBody?.menu_ingredients) {
        setIngredientList(responseBody.menu_ingredients);
      }
    };
    void loadIngredientList();
  }, [name, setMessage, setError, setNotifyModal]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="Menu Ingredients Error"
        message={message}
      />
      <Card className="w-75 mx-auto mt-3">
        <Card.Header>Edit Menu Ingredients</Card.Header>
        <Card.Body>
          <Form onSubmit={handleEdit}>
            {ingredientList.map((i, index) => (
              <IngredientField
                key={index}
                ingredient={i}
                onAmountChange={(newAmount) =>
                  setIngredientList((prev) =>
                    prev.map((ing, ind) =>
                      ind === index ? { ...ing, amount: newAmount } : ing
                    )
                  )
                }
                onRemove={(recipeId) =>
                  setIngredientList((prev) =>
                    prev.filter((ing) => ing.recipeId !== recipeId)
                  )
                }
              />
            ))}
            <Button variant="primary" type="submit" className="w-100">
              Save Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

function IngredientField({
  ingredient,
  onAmountChange,
  onRemove,
}: {
  ingredient: IngredientEntry;
  onAmountChange: (newAmount: number) => void;
  onRemove: (recipeId: string) => void;
}): React.JSX.Element {
  const [currentRecipe, setCurrentRecipe] = useState<string>(
    ingredient.recipeId
  );

  return (
    <Form.Group
      className="d-flex gap-2 mb-3"
      controlId={`formIngredient_${ingredient.recipeId}`}
    >
      <Form.Select
        value={currentRecipe}
        onChange={(e) => setCurrentRecipe(e.target.value)}
      >
        <option value={ingredient.recipeId}>{ingredient.recipeId}</option>
      </Form.Select>
      <Form.Control
        type="number"
        value={ingredient.amount}
        onChange={(e) => onAmountChange(parseFloat(e.target.value))}
        min={1}
        max={8}
      />
      <Button variant="danger" onClick={() => onRemove(ingredient.recipeId)}>
        Remove
      </Button>
    </Form.Group>
  );
}
