"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import { NotifyModal } from "@/app/components/modals";

import { FetchStocks } from "./stock_fetches";
import { Stock } from "./stock_types";
import { StockModal } from "./stock_modal";

export default function BranchStocks(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);

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
        setNotifyModal(true);
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
    void loadStocks();
  }, [router]);

  return (
    <Container className="m-4" fluid>
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="Stock Fetching"
        message={message}
      />
      <p className="h1 text-center mb-4">Branch&apos;s Stocks</p>
      <Row className="g-4 w-100">
        {stocks.map((s) => (
          <Col
            key={s.recipe.name}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="mb-0"
          >
            <StockCard stock={s} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

function StockCard({ stock }: { stock: Stock }): React.JSX.Element {
  const [stockModal, setStockModal] = useState<boolean>(false);

  return (
    <>
      <StockModal
        show={stockModal}
        onHide={() => setStockModal(false)}
        stock={stock}
      />
      <Card className="h-100">
        <Card.Img
          variant="top"
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/recipes/${stock.recipe.imagePath}`}
          alt={stock.recipe.name}
          className="img-fluid"
          style={{ aspectRatio: "1/1", objectFit: "contain" }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{stock.recipe.name}</Card.Title>
          <Card.Text>
            Quantity: {stock.quantity} {stock.recipe.unit}.
          </Card.Text>
          <Button
            onClick={() => setStockModal(true)}
            variant="warning"
            className="w-100"
          >
            Edit
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}
