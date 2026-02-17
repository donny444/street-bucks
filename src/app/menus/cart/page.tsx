"use client";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import {
  exclude,
  edit,
  increment,
  decrement,
  CartState,
} from "@/app/contexts/store/cart_slice";
import { RootState } from "@/app/contexts/store/store";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Col, Table, Button } from "react-bootstrap";

export default function CartPage(): React.JSX.Element {
  return (
    <Container className="bg-light p-3">
      <Col xs={12} md={9} lg={8} className="mx-auto"></Col>
      <Col xs={12} md={3} lg={4} className="mx-auto mt-4"></Col>
    </Container>
  );
}

function CartTable(): React.JSX.Element {
  const cart = useSelector((state: RootState) => state.cart) as CartState;
  const dispatch = useDispatch();

  return (
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
          <tr key={name}>
            <td>{index + 1}</td>
            <td>
              <Image
                src={itemDetail.imagePath}
                alt={name}
                width={50}
                height={50}
              />
            </td>
            <td>{name}</td>
            <td>{itemDetail.subtotal}</td>
            <td>
              <div className="d-flex align-items-center">
                <Button
                  variant="secondary"
                  onClick={() => dispatch(decrement(name))}
                >
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
                  ){itemDetail.quantity}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => dispatch(increment(name))}
                >
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
        ))}
      </tbody>
    </Table>
  );
}
