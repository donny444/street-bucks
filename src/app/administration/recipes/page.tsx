"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FetchRecipes } from "../admin_fetches";
import { Recipe } from "../admin_types";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import { NotifyModal } from "@/app/components/modals";
import AddIcon from "@/static/icons/add_icon.svg";
import { AddRecipeModal } from "../admin_modals";

export default function AdminRecipes(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const [addModal, setAddModal] = useState<boolean>(false);

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

  return (
    <Container className="d-flex flex-column gap-2">
      <AddRecipeModal show={addModal} onHide={() => setAddModal(false)} />
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="Recipe Fetching Error"
        message={message}
      />
      <Container className="d-flex justify-content-between align-items-center">
        <p className="h2">Recipe Management</p>
        <Button variant="success" onClick={() => setAddModal(true)}>
          <Image src={AddIcon} alt="Add Recipe" width={40} height={40} />
        </Button>
      </Container>
      {error && <Alert variant="danger">{message}</Alert>}
      <Row>
        {recipes.length < 1 ? (
          <Col className="text-center">No recipes found.</Col>
        ) : (
          recipes.map((r) => (
            <Col key={r.name} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <RecipeCard recipe={r} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }): React.JSX.Element {
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
          <Button
            variant="warning"
            href={`/administration/recipes/${encodeURIComponent(recipe.name)}`}
            className="w-50"
          >
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
