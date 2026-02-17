"use client";

import { useState } from "react";

import Image from "next/image";

import { include } from "@/app/contexts/store/cart_slice";
import { useDispatch } from "react-redux";

import { Menu } from "./menu_types";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";

interface MenuModalProps {
  show: boolean;
  onHide: () => void;
  menu: Menu;
}
export function MenuModal({
  show,
  onHide,
  menu,
}: MenuModalProps): React.JSX.Element {
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useDispatch();

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{menu.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image
          src={menu.imagePath}
          alt={menu.imagePath}
          style={{ width: "100%", height: "auto" }}
        />
        <p>Price: {menu.price}</p>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex align-items-center">
          <Button
            variant="secondary"
            onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
          >
            -
          </Button>
          <span className="mx-3">
            <input
              type="number"
              value={quantity}
              style={{ width: "60px", textAlign: "center" }}
            />
          </span>
          <Button
            variant="secondary"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </Button>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            dispatch(
              include({
                name: menu.name,
                quantity,
              })
            );
          }}
        >
          Add to Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
