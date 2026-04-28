"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FetchRecipes, UpdateRecipe } from "../admin_fetches";
import { Recipe } from "../admin_types";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Modal,
  Form,
  ButtonGroup,
} from "react-bootstrap";
import { NotifyModal } from "@/app/components/modals";

export default function AdminRecipes(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const router = useRouter();

  useEffect(() => {
    const adminToken = sessionStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  const loadRecipes = async () => {
    const fetchedRecipes = await FetchRecipes();
    if (!fetchedRecipes) {
      setMessage("Failed to load recipes.");
      setError(true);
      setNotifyModal(true);
      return;
    }

    const responseBody = fetchedRecipes.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
      setError(true);
      setNotifyModal(true);
    }
    if (responseBody?.recipes) {
      setRecipes(responseBody.recipes);
    }
  };

  useEffect(() => {
    void loadRecipes();
  }, []);

  const handleEditClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowEditModal(true);
  };

  const handleSaveRecipe = async (updatedRecipe: Recipe) => {
    const res = await UpdateRecipe({ recipes: [updatedRecipe] });
    if (res && !res.data.error) {
      void loadRecipes();
      setShowEditModal(false);
    } else {
      setMessage("Failed to update recipe");
      setNotifyModal(true);
    }
  };

  return (
    <Container>
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="Recipe Fetching Error"
        message={message}
      />
      <p className="h2">Recipe Management</p>
      {error && <Alert variant="danger">{message}</Alert>}
      <Row>
        {recipes.length < 1 ? (
          <Col className="text-center">No recipes found.</Col>
        ) : (
          recipes.map((r) => (
            <Col key={r.name} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <RecipeCard recipe={r} onEdit={() => handleEditClick(r)} />
            </Col>
          ))
        )}
      </Row>
      {selectedRecipe && (
        <EditRecipeModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          recipe={selectedRecipe}
          onSave={handleSaveRecipe}
        />
      )}
    </Container>
  );
}

function RecipeCard({
  recipe,
  onEdit,
}: {
  recipe: Recipe;
  onEdit: () => void;
}): React.JSX.Element {
  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/recipes/${recipe.imagePath}`}
        alt={recipe.name}
        className="img-fluid"
        style={{ aspectRatio: "1/1", objectFit: "contain" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{recipe.name}</Card.Title>
        <Card.Text>Unit: {recipe.unit}</Card.Text>
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

function EditRecipeModal({
  show,
  onHide,
  recipe,
  onSave,
}: {
  show: boolean;
  onHide: () => void;
  recipe: Recipe;
  onSave: (r: Recipe) => void;
}) {
  const [formData, setFormData] = useState<Recipe>(recipe);

  useEffect(() => {
    setFormData(recipe);
  }, [recipe]);

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
        <Modal.Title>Edit Recipe: {recipe.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Unit</Form.Label>
            <Form.Control
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            />
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
