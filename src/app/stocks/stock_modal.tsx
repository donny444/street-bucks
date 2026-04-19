"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, ButtonGroup, Modal, Alert } from "react-bootstrap";

import { EditStock } from "./stock_fetches";
import { Stock } from "./stock_types";

interface StockModalProps {
  show: boolean;
  onHide: () => void;
  stock: Stock;
}
export function StockModal({
  show,
  onHide,
  stock,
}: StockModalProps): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(stock.quantity);

  const router = useRouter();

  const handleEdit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const response = await EditStock({
        recipeId: stock.recipe.name,
        quantity,
      });
      if (!response) {
        setMessage("Failed to edit stock.");
        setError(true);
        return;
      }
      if (response?.status === 401) {
        localStorage.removeItem("branch-token");
        router.push("/branches");
        return;
      }

      const responseBody = response.data;
      if (responseBody?.error) {
        setMessage(responseBody.error);
        setError(true);
        return;
      }
      if (responseBody?.message) {
        setMessage(responseBody?.message);
        setError(false);
        onHide();
        window.location.reload();
      }
    } catch (err) {
      console.error("Error occurred in `handleEdit`:", err);
      setMessage("Unable to edit stock.");
      setError(true);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {stock.recipe.name} ({stock.recipe.unit})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="d-flex flex-column align-items-center"
        style={{ minHeight: "300px" }}
      >
        {error && <Alert variant="danger">{message}</Alert>}
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/recipes/${stock.recipe.imagePath}`}
          alt={stock.recipe.imagePath}
          width={300}
          height={300}
        />
      </Modal.Body>
      <Modal.Footer>
        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
          >
            -
          </Button>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(() =>
                Math.min(Math.max(Number(e.target.value), 1), 9999)
              )
            }
            min="1"
            style={{ width: "60px", textAlign: "center" }}
          />
          <Button
            variant="secondary"
            onClick={() => setQuantity((prev) => Math.min(prev + 1, 9999))}
          >
            +
          </Button>
        </ButtonGroup>
        <Button variant="primary" onClick={handleEdit}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
