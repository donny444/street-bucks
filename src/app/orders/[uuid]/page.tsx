"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";

import { FetchSpecificOrder } from "../order_fetches";
import { Entry, SpecificOrder } from "../order_types";
import { NotifyModal } from "@/app/components/modals";

interface OrderDetailProps {
  params: {
    uuid: string;
  };
}
export default function OrderDetail({
  params,
}: OrderDetailProps): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [orderDetail, setOrderDetail] = useState<SpecificOrder | null>(null);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const orderUuid = params.uuid;

  const router = useRouter();

  useEffect(() => {
    const branchToken = localStorage.getItem("branch-token");
    if (!branchToken) {
      router.push("/branches");
    }
  }, [router]);

  useEffect(() => {
    const loadOrder = async () => {
      const fetchedOrder = await FetchSpecificOrder(orderUuid);
      if (!fetchedOrder) {
        setMessage("Failed to load user detail.");
        setNotifyModal(true);
      }
      if (fetchedOrder?.status === 401) {
        localStorage.removeItem("branch-token");
        router.push("/branches");
      }

      const responseBody = fetchedOrder?.data;
      if (responseBody?.error) {
        setMessage(responseBody.error);
      }
      if (responseBody?.message && responseBody?.order) {
        setMessage(responseBody.message);
        setOrderDetail(responseBody?.order);
      }
    };
    loadOrder();
  }, [orderUuid]);

  const convertTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Container className="bg-light p-3">
      <>
        <NotifyModal
          show={notifyModal}
          onHide={() => setNotifyModal(false)}
          title="User Fetching Error"
          message={message}
        />
        <Col className="justify-content-center">
          <p className="h3">Order Detail</p>
          {orderDetail ? (
            <>
              <OrderField label="UUID" value={orderDetail.uuid} />
              <OrderField
                label="Date-time"
                value={convertTimestamp(orderDetail.timestamp)}
              />
              <OrderField label="Total price" value={orderDetail.totalPrice} />
              <OrderField label="Entries" value={orderDetail.entries} />
            </>
          ) : (
            <p>Order unavailable.</p>
          )}
        </Col>
      </>
    </Container>
  );
}

interface OrderFieldProps {
  label: string;
  value: string | number | Entry[];
}
function OrderField({ label, value }: OrderFieldProps): React.JSX.Element {
  return (
    <Row className="mb-2">
      <Col xs={3} md={2}>
        <b>{label}:</b>
      </Col>
      <Col xs={9} md={10}>
        {Array.isArray(value) ? (
          <ul>
            {value.map((e, i) => (
              <li key={i}>
                {e.quantity} x {e.menuName} : ${e.price}
              </li>
            ))}
          </ul>
        ) : (
          value
        )}
      </Col>
    </Row>
  );
}
