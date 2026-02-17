"use client";

import { useState, useEffect } from "react";
import { FetchTodayOrders } from "./order_fetches";
import { Order } from "./order_types";

import Link from "next/link";
import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Table, Modal } from "react-bootstrap";

export default function TodayOrders(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [modal, setModal] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const branchId = localStorage.getItem("branchId");
    if (!branchId) {
      router.push("/branches");
    }
  }, [router]);

  useEffect(() => {
    const loadOrders = async () => {
      const fetchedOrders = await FetchTodayOrders();
      if (!fetchedOrders) {
        setMessage("Failed to load today's orders.");
        setModal(true);
      }

      const responseBody = fetchedOrders?.data;
      if (responseBody?.today_orders) {
        setOrders(responseBody.today_orders);
      }
    };
    loadOrders();
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
        <>
          <h1>Today&apos;s Orders</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order UUID</th>
                <th>Timestamp</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <TodayOrder key={order.uuid} order={order} />
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}

function TodayOrder({ order }: { order: Order }): React.JSX.Element {
  return (
    <tr>
      <td>{order.uuid}</td>
      <td>{new Date(order.timestamp).toLocaleString()}</td>
      <td>{order.totalPrice}</td>
      <td>
        <Button variant="primary">
          <Link href={`orders/${order.uuid}`}>Inspect</Link>
        </Button>
      </td>
    </tr>
  );
}
