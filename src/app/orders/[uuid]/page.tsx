"use client";

import { useState, useEffect } from "react";

import { useRouter, notFound } from "next/navigation";

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

import { FetchSpecificOrder, FetchReceipt } from "../order_fetches";
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
      if (fetchedOrder?.status === 404) {
        notFound();
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
    void loadOrder();
  }, [orderUuid, router]);

  const convertTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Container className="m-2">
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="User Fetching Error"
        message={message}
      />
      <Container className="bg-light p-3">
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
              <OrderField label="Entries" value={orderDetail.entry} />
            </>
          ) : (
            <p>Order unavailable.</p>
          )}
        </Col>
      </Container>
      <OrderReceipt uuid={orderUuid} />
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
                {e.quantity} x {e.menu.name} : ${e.menu.price}
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

interface OrderReceiptProps {
  uuid: string;
}
function OrderReceipt({ uuid }: OrderReceiptProps): React.JSX.Element {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReceipt = async () => {
      try {
        setLoading(true);
        const response = await FetchReceipt(uuid);

        if (!response || !response.data) {
          setError("Failed to load receipt.");
          setLoading(false);
          return;
        }

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setLoading(false);
      } catch (err) {
        console.error("Error loading receipt:", err);
        setError("An error occurred while loading the receipt.");
        setLoading(false);
      }
    };

    void loadReceipt();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [uuid]);

  return (
    <Container className="mt-4">
      <p className="h3">Receipt</p>
      {loading && (
        <div className="text-center p-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading receipt...</span>
          </Spinner>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {pdfUrl && !loading && (
        <div style={{ width: "100%", height: "800px" }}>
          <iframe
            src={pdfUrl}
            style={{
              width: "100%",
              height: "100%",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            title="Order Receipt"
          />
        </div>
      )}
    </Container>
  );
}
