"use client";

import { useEffect } from "react";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import {
  ItemDetail,
  exclude,
  edit,
  increment,
  decrement,
  hydrate,
  CartState,
} from "../cart_slice";
import { RootState } from "@/app/contexts/store";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Stack, Row, Col, Table, Button } from "react-bootstrap";

import { Menu } from "../../menus/menu_types";

export default function CartPage(): React.JSX.Element {
  const cart: CartState = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrate());
  });

  return (
    <Container className="bg-light p-3">
      <Row>
        <Col xs={12} md={9} className="mx-0">
          <CartTable cart={cart} />
        </Col>
        <Col xs={12} md={3} className="mx-0">
          <CartSummary cart={cart} />
        </Col>
      </Row>
    </Container>
  );
}

type CartSummaryProps = {
  cart: CartState;
};
function CartSummary({ cart }: CartSummaryProps): React.JSX.Element {
  const num = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
  const total = Object.values(cart).reduce(
    (acc, item) => acc + item.subtotal,
    0
  );

  return (
    <Container className="bg-white p-3 gap-2">
      <Row>
        <p className="h2">Cart Summary</p>
      </Row>
      <Row>
        <p className="h3">{`Number of item(s): ${num}`}</p>
        <p className="h3">{`Total: ${total}`}</p>
      </Row>
      <Row>
        <Button variant="primary" className="w-100" onClick={undefined}>
          Place Order
        </Button>
      </Row>
    </Container>
  );
}

type CartTableProps = {
  cart: CartState;
};
function CartTable({ cart }: CartTableProps): React.JSX.Element {
  return (
    <Stack gap={2}>
      <p className="h2">Item(s) in Cart</p>
      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Subtotal</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(cart).length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                There&apos;s no item in cart yet.
              </td>
            </tr>
          ) : (
            Object.entries(cart).map(([name, itemDetail], index) => (
              <CartEntry
                key={name}
                name={name}
                itemDetail={itemDetail}
                index={index}
              />
            ))
          )}
        </tbody>
      </Table>
    </Stack>
  );
}

type CartEntryProps = {
  name: Menu["name"];
  itemDetail: ItemDetail;
  index: number;
};
function CartEntry({
  name,
  itemDetail,
  index,
}: CartEntryProps): React.JSX.Element {
  const dispatch = useDispatch();

  return (
    <tr key={name}>
      <td>{index + 1}</td>
      <td>
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${itemDetail.imagePath}`}
          alt={itemDetail.imagePath}
          width={50}
          height={50}
        />
      </td>
      <td>{name}</td>
      <td>{itemDetail.subtotal}</td>
      <td>
        <div className="d-flex align-items-center">
          <Button variant="danger" onClick={() => dispatch(decrement(name))}>
            -
          </Button>
          <span className="mx-3">
            <input
              type="number"
              value={itemDetail.quantity}
              style={{ width: "60px", textAlign: "center" }}
              onChange={(e) =>
                dispatch(
                  edit({
                    name,
                    price: itemDetail.subtotal / itemDetail.quantity,
                    quantity: parseInt(e.target.value) || 1,
                  })
                )
              }
            />
          </span>
          <Button variant="success" onClick={() => dispatch(increment(name))}>
            +
          </Button>
        </div>
      </td>
      <td>
        <Button variant="danger" onClick={() => dispatch(exclude(name))}>
          Remove
        </Button>
      </td>
    </tr>
  );
}
