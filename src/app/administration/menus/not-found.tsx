import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function AdminMenuNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>Menu Not Found</h2>
        <p>The menu you are looking for does not exist in administration.</p>
        <Button variant="primary" href="/administration/menus">
          <Link href="/administration/menus">Back to Admin Menus</Link>
        </Button>
      </Col>
    </Container>
  );
}
