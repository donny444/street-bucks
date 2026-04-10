import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function AdminBranchNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>Branch Not Found</h2>
        <p>The branch you are looking for does not exist in administration.</p>
        <Button variant="primary" href="/administration/branches">
          <Link href="/administration/branches">Back to Admin Branches</Link>
        </Button>
      </Col>
    </Container>
  );
}
