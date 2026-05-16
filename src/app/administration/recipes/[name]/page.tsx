"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, Form, Container, Alert } from "react-bootstrap";

import { NotifyModal } from "@/app/components/modals";
import { RecipeForm } from "../../admin_types";
import { FetchRecipeForm, EditRecipe } from "../../admin_fetches";

export default function RecipeDetailsPage({
  params,
}: {
  params: { name: string };
}): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const recipeName = decodeURIComponent(params.name);

  const router = useRouter();

  useEffect(() => {
    const adminToken = sessionStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  return (
    <Container>
      {error && <Alert variant="danger">{message}</Alert>}
      <EditRecipeCard
        name={recipeName}
        message={message}
        setMessage={setMessage}
        setError={setError}
        notifyModal={notifyModal}
        setNotifyModal={setNotifyModal}
      />
    </Container>
  );
}

interface EditRecipeCardProps {
  name: string;
  message: string;
  setMessage: (msg: string) => void;
  setError: (err: boolean) => void;
  notifyModal: boolean;
  setNotifyModal: (notify: boolean) => void;
}
function EditRecipeCard({
  name,
  message,
  setMessage,
  setError,
  notifyModal,
  setNotifyModal,
}: EditRecipeCardProps): React.JSX.Element {
  const [recipeForm, setRecipeForm] = useState<RecipeForm>();

  const router = useRouter();

  useEffect(() => {
    const loadRecipeForm = async () => {
      const fetchedRecipeForm = await FetchRecipeForm(name);
      if (!fetchedRecipeForm) {
        setMessage("Failed to load recipe form.");
        setError(true);
        setNotifyModal(true);
        return;
      }

      const responseBody = fetchedRecipeForm.data;
      if (responseBody?.error) {
        setMessage(responseBody.error);
        setError(true);
        setNotifyModal(true);
      }
      if (responseBody?.recipe_form) {
        setRecipeForm(responseBody.recipe_form);
      }
    };
    void loadRecipeForm();
  }, [name, setMessage, setError, setNotifyModal]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeForm) {
      setMessage("Recipe form is not ready.");
      setError(true);
      setNotifyModal(true);
      return;
    }
    if (recipeForm.name.trim() === "") {
      setMessage("Recipe name is required.");
      setError(true);
      setNotifyModal(true);
      return;
    }
    if (recipeForm.unit.trim() === "") {
      setMessage("Recipe unit is required.");
      setError(true);
      setNotifyModal(true);
      return;
    }

    const editedRecipe = await EditRecipe(recipeForm, name);
    if (!editedRecipe) {
      setMessage("Failed to edit recipe.");
      setError(true);
      setNotifyModal(true);
      return;
    }

    const responseBody = editedRecipe.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
      setError(true);
      setNotifyModal(true);
      return;
    }

    setMessage(responseBody?.message || "Recipe updated successfully.");
    setError(false);
    setNotifyModal(true);
    router.replace(
      `/administration/recipes/${encodeURIComponent(recipeForm.name)}`
    );
    router.refresh();
  };

  return (
    <>
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="Recipe Info"
        message={message}
      />
      <Card className="w-75 mx-auto mt-3">
        <Card.Header>Edit Recipe Detail</Card.Header>
        <Card.Body>
          {!recipeForm ? (
            <Card.Text className="text-center">
              Loading recipe details...
            </Card.Text>
          ) : (
            <Form onSubmit={(e) => void handleEdit(e)}>
              <Card.Img
                variant="top"
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/recipes/${recipeForm.imagePath}`}
                alt={recipeForm.name}
                className="img-fluid mb-3"
                style={{ width: "200px", aspectRatio: "1/1" }}
              />
              <Form.Group className="mb-3" controlId="formRecipeName">
                <Form.Label>Recipe Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter recipe name"
                  value={recipeForm.name}
                  onChange={(e) =>
                    setRecipeForm((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formRecipeUnit">
                <Form.Label>Unit</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter recipe unit"
                  value={recipeForm.unit}
                  onChange={(e) =>
                    setRecipeForm((prev) =>
                      prev ? { ...prev, unit: e.target.value } : prev
                    )
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formRecipeImage">
                <Form.Label>Upload Image File</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setRecipeForm((prev) =>
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
              <Button variant="primary" type="submit" className="w-100 mt-3">
                Save Changes
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
