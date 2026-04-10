import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function NotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Button variant="primary" href="/">
          <Link href="/">Back to Home</Link>
        </Button>
      </Col>
    </Container>
  );
}
