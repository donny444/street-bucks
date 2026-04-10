import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function AdminOrderNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>Order Not Found</h2>
        <p>The order you are looking for does not exist in administration.</p>
        <Button variant="primary" href="/administration/orders">
          <Link href="/administration/orders">Back to Admin Orders</Link>
        </Button>
      </Col>
    </Container>
  );
}
