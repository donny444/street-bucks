import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function UserNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>User not found</h2>
        <p>
          You suppose to provide an existing user email tailing
          &lsquo;/users&rsquo; to see detail of a specific user
        </p>
        <Button variant="secondary" href="/users">
          <Link href="/users">Back to &lsquo;/users&rsquo;.</Link>
        </Button>
      </Col>
    </Container>
  );
}
