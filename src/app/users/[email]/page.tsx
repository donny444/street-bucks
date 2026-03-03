"use client";

import { useState, useEffect } from "react";
import { FetchSpecificUser } from "@/app/users/user_fetches";
import { User, UserRole } from "../user_types";

import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Button, Modal, Form } from "react-bootstrap";

interface UserDetailProps {
  params: {
    email: string;
  };
}
export default function UserDetail({
  params,
}: UserDetailProps): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const userEmail = params.email;

  const router = useRouter();

  useEffect(() => {
    const branchToken = localStorage.getItem("branch-token");
    if (!branchToken) {
      router.push("/branches");
    }
  }, [router]);

  useEffect(() => {
    const loadUser = async () => {
      const fetchedUser = await FetchSpecificUser(userEmail);
      if (!fetchedUser) {
        setMessage("Failed to load user detail.");
        setErrorModal(true);
      }
      if (fetchedUser?.status === 401) {
        localStorage.removeItem("branch-token");
        router.push("/branches");
      }

      const responseBody = fetchedUser?.data;
      if (responseBody?.user) {
        setUser(responseBody.user);
      }
    };
    loadUser();
  }, []);

  return (
    <Container>
      <Modal show={errorModal} onHide={() => setErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user ? (
            <Form>
              <UserField label="Email" value={user.email} />
              <UserField label="First Name" value={user.firstName} />
              <UserField label="Last Name" value={user.lastName} />
              <UserField label="Attended" value={user.attended} />
              <UserField label="Role" value={user.role} />
            </Form>
          ) : (
            <p className="h3">User not found</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

interface UserFieldProps {
  label: string;
  value: string | boolean | UserRole;
}
function UserField({ label, value }: UserFieldProps): React.JSX.Element {
  const isRole = Object.values(UserRole).includes(value as UserRole);

  return (
    <Form.Group as={Row} className="mb-3" controlId={`form${label}`}>
      <Form.Label>{label}:</Form.Label>
      {isRole ? (
        <Form.Select>
          <option>{UserRole.STAFF.toUpperCase()}</option>
          <option>{UserRole.MANAGER.toUpperCase()}</option>
          <option>{UserRole.ADMINISTRATOR.toUpperCase()}</option>
        </Form.Select>
      ) : (
        <Form.Control
          type={typeof value === "boolean" ? "checkbox" : "text"}
          checked={typeof value === "boolean" ? value : undefined}
          value={typeof value === "boolean" ? undefined : (value as string)}
          readOnly
        />
      )}
    </Form.Group>
  );
}
