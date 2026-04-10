import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function BranchNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>Branch Not Found</h2>
        <p>The branch you are looking for does not exist.</p>
        <Button variant="primary" href="/branches">
          <Link href="/branches">Back to Branches</Link>
        </Button>
      </Col>
    </Container>
  );
}
