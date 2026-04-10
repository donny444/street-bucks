import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function AdminNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>Administration Page Not Found</h2>
        <p>The administration page you are looking for does not exist.</p>
        <Button variant="primary" href="/administration">
          <Link href="/administration">Back to Administration</Link>
        </Button>
      </Col>
    </Container>
  );
}
