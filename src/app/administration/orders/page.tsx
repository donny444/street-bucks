"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FetchOrderByUuid } from "../admin_fetches";
import { Order } from "../admin_types";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Table, Button, Form, Alert } from "react-bootstrap";
import { NotifyModal } from "@/app/components/modals";

export default function OrderLookup(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string>("");
  const [order, setOrder] = useState<Order>({});
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  const findOrder = async () => {
    const foundOrder = await FetchOrderByUuid(uuid);
    if (!foundOrder) {
      setMessage("Failed to find order by UUID.");
      setError(true);
      setNotifyModal(true);
      return;
    }

    const responseBody = foundOrder.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
      setError(true);
      setNotifyModal(true);
    }
    if (responseBody?.found_order) {
      setOrder(responseBody.found_order);
    }
  };

  return (
    <Container className="mt-4">
      <>
        <NotifyModal
          show={notifyModal}
          onHide={() => setNotifyModal(false)}
          title="Order Fetching Error"
          message={message}
        />
        <p className="h2">Order Lookup</p>
        <Form onSubmit={() => findOrder} className="d-flex mb-2">
          <Form.Control
            type="text"
            placeholder="Find order by UUID..."
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            className="w-80"
          />
          <Button variant="primary" type="submit" className="w-20">
            Find
          </Button>
        </Form>
        {error && <Alert variant="danger">{message}</Alert>}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order UUID</th>
              <th>Branch ID</th>
              <th>Total Price</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {order ? (
              <tr>
                <td>{order.uuid}</td>
                <td>{order.branchId}</td>
                <td>{order.totalPrice}</td>
                <td>{new Date(order.timestamp).toLocaleString()}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No order found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </>
    </Container>
  );
}
