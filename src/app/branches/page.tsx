"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { FetchBranchIds, BranchSignin } from "./branch_fetches";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

import { NotifyModal } from "@/app/components/modals";

export default function BranchSignIn() {
  const [message, setMessage] = useState<string>("");
  const [branchIds, setBranchIds] = useState<number[]>([]);
  const [branchId, setBranchId] = useState<number>(1);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const branchToken = localStorage.getItem("branch-token");
    if (branchToken) {
      router.push("/menus/hot");
    }
  }, [router]);

  useEffect(() => {
    const loadBranchIds = async () => {
      const fetchedBranchIds = await FetchBranchIds();
      if (!fetchedBranchIds) {
        setMessage("Failed to load branch IDs.");
        setNotifyModal(true);
      }

      const responseBody = fetchedBranchIds?.data;
      if (responseBody?.error) {
        setMessage(responseBody.error);
        setNotifyModal(true);
      }

      if (responseBody?.message && responseBody?.branch_ids) {
        setMessage(responseBody.message);
        setBranchIds(responseBody.branch_ids);
      }
    };
    loadBranchIds();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const signedInBranch = await BranchSignin({ branchId, password });
    if (!signedInBranch) {
      setMessage("Failed to sign into branch.");
      setNotifyModal(true);
      setLoading(false);
    }

    const responseBody = signedInBranch?.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
      setNotifyModal(true);
      setLoading(false);
    }

    if (responseBody?.message && responseBody?.token) {
      setMessage(responseBody.message);
      localStorage.setItem("branch-token", responseBody.token);
      router.push("/orders");
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <>
        <NotifyModal
          show={notifyModal}
          onHide={() => setNotifyModal(false)}
          title="Branch Fetching Error"
          message={message}
        />
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <p className="h2 text-center mb-4">Branch Sign-In</p>
                <Form onSubmit={handleSignIn}>
                  <Form.Group className="mb-3" controlId="formBranchId">
                    <Form.Label>Branch ID</Form.Label>
                    <Form.Select
                      value={branchId}
                      onChange={(e) => setBranchId(Number(e.target.value))}
                      required
                    >
                      {branchIds.map((br) => (
                        <option key={br} value={br}>
                          {br}
                        </option>
                      ))}
                    </Form.Select>
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

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </Container>
  );
}
