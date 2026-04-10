"use client";

import { useState } from "react";

import Image from "next/image";

import { include } from "./cart/cart_slice";
import { useDispatch } from "react-redux";

import { Menu } from "./menu_types";

import "bootstrap/dist/css/bootstrap.min.css";
import { ButtonGroup, Button, Modal } from "react-bootstrap";

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
      <Modal.Body
        className="d-flex flex-column align-items-center"
        style={{ minHeight: "300px" }}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/menus/${menu.imagePath}`}
          alt={menu.imagePath}
          width={300}
          height={300}
        />
      </Modal.Body>
      <Modal.Footer>
        <p className="h5">Price: {menu.price}</p>
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
            style={{ width: "60px", textAlign: "center" }}
          />
          <Button
            variant="secondary"
            onClick={() => setQuantity((prev) => Math.min(prev + 1, 10))}
          >
            +
          </Button>
        </ButtonGroup>
        <Button
          variant="primary"
          onClick={() => {
            dispatch(
              include({
                name: menu.name,
                price: menu.price,
                imagePath: menu.imagePath,
                quantity: quantity,
              })
            );
            onHide();
          }}
        >
          Add to Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
