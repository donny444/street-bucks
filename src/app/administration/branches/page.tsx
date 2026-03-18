"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FetchBranches } from "../admin_fetches";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, ListGroup, Alert } from "react-bootstrap";
import { NotifyModal } from "@/app/components/modals";

export default function AdminBranches() {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [branches, setBranches] = useState<number[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  useEffect(() => {
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

    void loadBranches();
  }, []);

  return (
    <Container className="mt-4">
      <>
        <NotifyModal
          show={notifyModal}
          onHide={() => setNotifyModal(false)}
          title="Branch Fetching Error"
          message={message}
        />
        <p className="h2">Branch Management</p>
        {error && (
          <Alert variant="danger" dismissible>
            {message}
          </Alert>
        )}
        <ListGroup>
          {branches.length < 1 ? (
            <ListGroup.Item className="text-center">
              No branches found.
            </ListGroup.Item>
          ) : (
            branches.map((br) => (
              <ListGroup.Item key={br}>Branch ID: {br}</ListGroup.Item>
            ))
          )}
        </ListGroup>
      </>
    </Container>
  );
}
