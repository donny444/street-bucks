import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function DashboardNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>Dashboard Not Found</h2>
        <p>The dashboard page you are looking for does not exist.</p>
        <Button variant="primary" href="/dashboard">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </Col>
    </Container>
  );
}
