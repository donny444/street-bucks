"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FetchRecipes } from "../admin_fetches";
import { Recipe } from "../admin_types";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { NotifyModal } from "@/app/components/modals";

export default function AdminRecipes(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  useEffect(() => {
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
    void loadRecipes();
  }, []);

  return (
    <Container className="mt-4">
      <>
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
                <RecipeCard recipe={r} />
              </Col>
            ))
          )}
        </Row>
      </>
    </Container>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }): React.JSX.Element {
  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Img
          variant="top"
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/recipes/${recipe.imagePath}`}
          alt={recipe.name}
          width={200}
          height={200}
        />
        <Card.Title>{recipe.name}</Card.Title>
        <Card.Text>Unit: {recipe.unit}</Card.Text>
        <span className="mt-auto">
          <Button variant="warning">Edit</Button>
          <Button variant="danger">Remove</Button>
        </span>
      </Card.Body>
    </Card>
  );
}
