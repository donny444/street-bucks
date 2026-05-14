"use client";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import {
  ItemDetail,
  exclude,
  edit,
  increment,
  decrement,
  clear,
  CartState,
} from "./cart_slice";
import { RootState, AppDispatch } from "@/app/contexts/store";
import { MakeOrder } from "../menu_fetches";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Stack,
  Row,
  Col,
  Table,
  ButtonGroup,
  Button,
} from "react-bootstrap";

import { Menu, OrderedMenu } from "../menu_types";

export default function CartPage(): React.JSX.Element {
  const cart: CartState = useSelector((state: RootState) => state.cart);

  // useEffect(() => {
  //   dispatch(hydrate());
  // });

  return (
    <Container className="bg-light p-3">
      <Row>
        <Col xs={12} md={9}>
          <CartTable cart={cart} />
        </Col>
        <Col xs={12} md={3}>
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
  const dispatch = useDispatch<AppDispatch>();
  const num = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
  const total = Object.values(cart).reduce(
    (acc, item) => acc + item.subtotal,
    0
  );

  const handlePlaceOrder = async () => {
    if (Object.keys(cart).length === 0) {
      alert("Cart is empty. Please add items before placing an order.");
      return;
    }

    const cartItems: OrderedMenu[] = Object.entries(cart).map(
      ([name, itemDetail]) => ({
        menuId: name,
        quantity: itemDetail.quantity,
      })
    );

    const response = await MakeOrder(cartItems);
    if (!response) {
      alert("Failed to place order. Please try again.");
      return;
    }

    if (response.status === 201 || response.status === 200) {
      alert(`Order placed successfully! Order ID: ${response.data.order_id}`);
      dispatch(clear());
    } else {
      alert(`Failed to place order: ${response.data.error || "Unknown error"}`);
    }
  };

  return (
    <Container className="bg-white px-4 py-2 gap-2">
      <Row>
        <p className="h2">Cart Summary</p>
      </Row>
      <Row>
        <p className="h5">{`Number of item(s): ${num}`}</p>
        <p className="h5">{`Total: ${total}`}</p>
      </Row>
      <Row>
        <Button
          variant="primary"
          className="w-100 px-0 py-1"
          onClick={() => void handlePlaceOrder()}
        >
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
        <ButtonGroup>
          <Button variant="danger" onClick={() => dispatch(decrement(name))}>
            -
          </Button>
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
          <Button variant="success" onClick={() => dispatch(increment(name))}>
            +
          </Button>
        </ButtonGroup>
      </td>
      <td>
        <Button variant="danger" onClick={() => dispatch(exclude(name))}>
          Remove
        </Button>
      </td>
    </tr>
  );
}
