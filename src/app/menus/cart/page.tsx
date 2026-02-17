"use client";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import {
  ItemDetail,
  exclude,
  edit,
  increment,
  decrement,
  CartState,
} from "../cart_slice";
import { RootState } from "@/app/contexts/store";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Stack, Row, Col, Table, Button } from "react-bootstrap";

import { Menu } from "../menu_types";

export default function CartPage(): React.JSX.Element {
  const cart: CartState = useSelector((state: RootState) => state.cart);

  return (
    <Container className="bg-light p-3">
      <Col xs={12} md={9} lg={8} className="mx-auto">
        <CartTable cart={cart} />
      </Col>
      <Col xs={12} md={3} lg={4} className="mx-auto mt-4">
        <CartSummary cart={cart} />
      </Col>
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
        <Button variant="success" className="w-25">
          Confirm Order
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
          {Object.entries(cart).map(([name, itemDetail], index) => (
            <CartEntry
              key={name}
              name={name}
              itemDetail={itemDetail}
              index={index}
            />
          ))}
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
        <Image src={itemDetail.imagePath} alt={name} width={50} height={50} />
      </td>
      <td>{name}</td>
      <td>{itemDetail.subtotal}</td>
      <td>
        <div className="d-flex align-items-center">
          <Button variant="secondary" onClick={() => dispatch(decrement(name))}>
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
            {itemDetail.quantity}
          </span>
          <Button variant="secondary" onClick={() => dispatch(increment(name))}>
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
