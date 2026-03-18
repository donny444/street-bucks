"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

import { FetchStocks } from "./stock_fetches";
import { Stock } from "./stock_types";

export default function BranchStocks(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [modal, setModal] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const branchToken = localStorage.getItem("branch-token");
    if (!branchToken) {
      router.push("/branches");
    }
  }, [router]);

  useEffect(() => {
    const loadStocks = async () => {
      const fetchedStocks = await FetchStocks();
      if (!fetchedStocks) {
        setMessage("Failed to load stocks.");
        setModal(true);
      }
      if (fetchedStocks?.status === 401) {
        localStorage.removeItem("branch-token");
        router.push("/branches");
      }

      const responseBody = fetchedStocks?.data;
      if (responseBody?.branch_stocks) {
        setStocks(responseBody.branch_stocks);
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
          {stocks.map((s) => (
            <Col key={s.name} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <StockCard stock={s} />
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
        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/recipes/${stock.imagePath}`}
        alt={stock.name}
        width={200}
        height={200}
        style={{ objectFit: "cover" }}
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
