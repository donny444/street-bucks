"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col, Card, Alert } from "react-bootstrap";

import { NotifyModal } from "@/app/components/modals";

import AddIcon from "@/static/icons/add_icon.svg";

import { FetchBranches, AddBranch } from "../admin_fetches";

export default function AdminBranches() {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [branches, setBranches] = useState<number[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = sessionStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  const loadBranches = async () => {
    const fetchedBranches = await FetchBranches();
    if (!fetchedBranches) {
      setMessage("Failed to load branches.");
      setError(true);
      setNotifyModal(true);
      return;
    }

    const responseBody = fetchedBranches.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
      setError(true);
      setNotifyModal(true);
    }
    if (responseBody?.branch_ids) {
      setBranches(responseBody.branch_ids);
    }
  };

  useEffect(() => {
    void loadBranches();
  }, []);

  const handleAddBranch = async () => {
    const result = await AddBranch();
    if (result?.data?.branch_ids) {
      // Reload branches
      void loadBranches();
    } else {
      setMessage("Failed to add branch.");
      setError(true);
      setNotifyModal(true);
    }
  };

  return (
    <Container className="d-flex flex-column gap-2">
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="Branch Fetching Error"
        message={message}
      />
      <Container className="d-flex justify-content-between align-items-center">
        <p className="h2">Branch Management</p>
        <Button variant="success" onClick={() => handleAddBranch}>
          <Image src={AddIcon} alt="Add Branch" width={40} height={40} />
        </Button>
      </Container>
      {error && (
        <Alert variant="danger" dismissible>
          {message}
        </Alert>
      )}
      <Row>
        {branches.length < 1 ? (
          <Col>
            <div className="text-center">No branches found.</div>
          </Col>
        ) : (
          branches.map((br) => (
            <Col key={br} md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>Branch ID: {br}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
