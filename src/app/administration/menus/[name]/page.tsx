import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, ListGroup, Button } from "react-bootstrap";
import Link from "next/link";

interface PageProps {
  params: {
    name: string;
  };
}

export default async function MenuRecipesPage({ params }: PageProps) {
  const menuName = decodeURIComponent(params.name);
  // const filePath = path.join(
  //   process.cwd(),
  //   "src/assets/recipes",
  //   `${menuName}.md`
  // );

  if (!fs.existsSync(filePath)) {
    return notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const ingredients = fileContent
    .split("\n")
    .filter((line) => line.trim().startsWith("-"))
    .map((line) => line.replace("- ", "").trim());

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header as="h2">{menuName} Ingredients</Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {ingredients.map((ingredient, index) => (
              <ListGroup.Item key={index}>{ingredient}</ListGroup.Item>
            ))}
          </ListGroup>
          <Link href="/administration/menus" passHref legacyBehavior>
            <Button variant="secondary" className="mt-3">
              Back to Menus
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
}
