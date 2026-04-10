import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function AdminUserNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>User Not Found</h2>
        <p>The user you are looking for does not exist in administration.</p>
        <Button variant="primary" href="/administration/users">
          <Link href="/administration/users">Back to Admin Users</Link>
        </Button>
      </Col>
    </Container>
  );
}
