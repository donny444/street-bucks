"use client";

import { useState, useEffect } from "react";
import { FetchStocks } from "./stock_fetches";
import { Stock } from "./stock_types";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

export default function BranchStocks(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    const loadStocks = async () => {
      const fetchedStocks = await FetchStocks();
      if (!fetchedStocks) {
        setMessage("Failed to load stocks.");
        setModal(true);
      }

      const responseBody = fetchedStocks?.data;
      if (responseBody?.stocks) {
        setStocks(responseBody.stocks);
      }
    };
    loadStocks();
  }, []);

  return (
    <Container>
      {modal ? (
        <Modal show={modal} onHide={() => setModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Row>
          {stocks.map((stock) => (
            <Col key={stock.name} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <StockCard stock={stock} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

function StockCard({ stock }: { stock: Stock }): React.JSX.Element {
  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={stock.imagePath}
        alt={stock.name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{stock.name}</Card.Title>
        <Card.Text>Quantity: {stock.quantity}</Card.Text>
        <Button variant="warning" className="mt-auto">
          Edit
        </Button>
      </Card.Body>
    </Card>
  );
}
