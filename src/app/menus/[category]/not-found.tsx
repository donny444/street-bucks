import Link from "next/link";

import { MenuCategory } from "../menu_types";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Col, Button } from "react-bootstrap";

export default function MenuNotFound() {
  return (
    <Container>
      <Col gap={2}>
        <h2>Menu not found</h2>
        <p>{`You must navigate to a menu page of following categories: ${MenuCategory.HOT}, ${MenuCategory.ICED}, or ${MenuCategory.BAKERY}`}</p>
        <Button variant="danger">
          <Link
            href={`/menus/${MenuCategory.HOT}`}
          >{`To ${MenuCategory.HOT} menus`}</Link>
        </Button>
        <Button variant="primary">
          <Link
            href={`/menus/${MenuCategory.ICED}`}
          >{`To ${MenuCategory.ICED} menus`}</Link>
        </Button>
        <Button variant="warning">
          <Link
            href={`/menus/${MenuCategory.BAKERY}`}
          >{`To ${MenuCategory.BAKERY} menus`}</Link>
        </Button>
      </Col>
    </Container>
  );
}
