import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function AdminRecipeNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>Recipe Not Found</h2>
        <p>The recipe you are looking for does not exist in administration.</p>
        <Button variant="primary" href="/administration/recipes">
          <Link href="/administration/recipes">Back to Admin Recipes</Link>
        </Button>
      </Col>
    </Container>
  );
}
