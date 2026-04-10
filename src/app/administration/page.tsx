"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSignin } from "./admin_fetches";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { NotifyModal } from "@/app/components/modals";

export default function AdminSignIn() {
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = sessionStorage.getItem("admin-token");
    if (adminToken) {
      router.push("/administration/branches");
    }
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const signedInAdmin = await AdminSignin({ email, password });
    if (!signedInAdmin) {
      setMessage("Failed to sign into admin.");
      setError(true);
      setNotifyModal(true);
      setLoading(false);
      return;
    }

    const responseBody = signedInAdmin.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
      setError(true);
      setNotifyModal(true);
      setLoading(false);
      return;
    }

    if (responseBody?.message && responseBody?.token) {
      sessionStorage.setItem("admin-token", responseBody.token);
      router.push("/administration/branches");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center mt-5">
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="Admin Sign-In Error"
        message={message}
      />
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              {error && <Alert variant="danger">{message}</Alert>}
              <p className="h2 text-center mb-4">Administrator Sign-In</p>
              <Form onSubmit={handleSignIn}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
