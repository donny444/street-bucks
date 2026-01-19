import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function OrderNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>Order not found</h2>
        <p>You suppose to provide an existing order UUID tailing &lsquo;/orders&rsquo; to see a specific order</p>
        <Button variant="secondary" href="/orders">
          <Link href="/orders">Back to &lsquo;/orders&rsquo;.</Link>
        </Button>
      </Col>
    </Container>
  );
}
