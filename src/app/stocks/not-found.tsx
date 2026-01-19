import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { Container, Col, Button } from "react-bootstrap";

export default function StockNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>Stock not found</h2>
        <p>Seeing all recipe stocks are only allowed</p>
        <Button variant="secondary" href="/stocks">
          <Link href="/stocks">Back to &lsquo;/stocks&rsquo;.</Link>
        </Button>
      </Col>
    </Container>
  );
}
