"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Table, Button, Form, Alert } from "react-bootstrap";

import { NotifyModal } from "@/app/components/modals";

import FindIcon from "@/static/icons/find_icon.svg";

import { FetchOrderByUuid } from "../admin_fetches";
import { Order } from "../admin_types";

export default function OrderLookup(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string>("");
  const [order, setOrder] = useState<Order | null>(null);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = sessionStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  const findOrder = async (e: React.FormEvent) => {
    e.preventDefault();

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
    if (responseBody?.message && responseBody?.found_order) {
      setMessage(responseBody.message);
      setError(false);
      setOrder(responseBody.found_order);
    }
  };

  return (
    <Container>
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="Order Fetching Error"
        message={message}
      />
      <p className="h2">Order Lookup</p>
      <Form onSubmit={findOrder} className="d-flex mb-2 gap-0">
        <Form.Control
          type="text"
          placeholder="Find order by UUID..."
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          className="rounded-end-0"
        />
        <Button variant="primary" type="submit" className="rounded-start-0">
          <Image
            src={FindIcon as StaticImageData}
            alt="Find"
            width={30}
            height={30}
          />
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
              <td>
                {new Date(order.timestamp).toLocaleString("th-TH", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </td>
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
    </Container>
  );
}
