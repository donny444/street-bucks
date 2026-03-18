"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Button, Card, Alert, Form } from "react-bootstrap";

import { FetchUserForm, EditUser } from "@/app/users/user_fetches";
import { UserRole } from "../user_types";
import { EditModal } from "../user_modals";

import { NotifyModal } from "@/app/components/modals";

interface UserDetailProps {
  params: {
    email: string;
  };
}
export default function UserDetail({
  params,
}: UserDetailProps): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);

  const userEmail = params.email;
  const [newUserEmail, setNewUserEmail] = useState<string>(userEmail);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [role, setRole] = useState<UserRole>(UserRole.STAFF);
  const [userPassword, setUserPassword] = useState<string>("");

  const [editorEmail, setEditorEmail] = useState("");
  const [editorPassword, setEditorPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    const branchToken = localStorage.getItem("branch-token");
    if (!branchToken) {
      router.push("/branches");
    }
  }, [router]);

  useEffect(() => {
    const loadUser = async () => {
      const fetchedUser = await FetchUserForm(userEmail);
      if (!fetchedUser) {
        setError(true);
        setMessage("Failed to load user detail.");
        setErrorModal(true);
      }
      if (fetchedUser?.status === 401) {
        localStorage.removeItem("branch-token");
        router.push("/branches");
      }

      const responseBody = fetchedUser?.data;
      if (responseBody?.error) {
        setError(true);
        setMessage(responseBody.error);
        setErrorModal(true);
      }
      if (responseBody?.user) {
        setNewUserEmail(responseBody.user.email);
        setFirstName(responseBody.user.firstName);
        setLastName(responseBody.user.lastName);
        setRole(responseBody.user.role);
      }
    };
    void loadUser();
  }, [router, userEmail]);

  const handleEdit = async () => {
    const response = await EditUser(
      userEmail,
      {
        email: newUserEmail,
        firstName,
        lastName,
        role,
        password: userPassword,
      },
      editorEmail,
      editorPassword
    );
    if (!response) {
      setMessage("Failed to perform user removal.");
      setEditModal(true);
    }
    if (response?.status !== 200) {
      setEditModal(true);
    }
    const responseBody = response?.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
    }
    if (responseBody?.message) {
      setMessage(responseBody?.message);
    }

    setEditModal(true);

    window.location.reload();
  };

  return (
    <Container>
      {error && <Alert variant="danger">{message}</Alert>}
      <NotifyModal
        show={errorModal}
        onHide={() => setErrorModal(false)}
        title="User Editing"
        message={message}
      />
      <EditModal
        show={editModal}
        onHide={() => setEditModal(false)}
        title="User Editing"
        editorEmail={editorEmail}
        setEditorEmail={setEditorEmail}
        editorPassword={editorPassword}
        setEditorPassword={setEditorPassword}
        onSubmit={() => handleEdit}
      />
      <Card>
        <Card.Header>
          <Card.Title>Edit User Detail</Card.Title>
        </Card.Header>
        <Card.Body>
          {error ? (
            <p className="h3">User not found</p>
          ) : (
            <Form>
              <UserField
                label="Email"
                value={newUserEmail}
                setNewUserEmail={setNewUserEmail}
              />
              <UserField
                label="First Name"
                value={firstName}
                setFirstName={setFirstName}
              />
              <UserField
                label="Last Name"
                value={lastName}
                setLastName={setLastName}
              />
              <UserField label="Role" value={role} setRole={setRole} />
              <UserField
                label="Password"
                value=""
                setUserPassword={setUserPassword}
              />
            </Form>
          )}
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" onClick={() => setEditModal(true)}>
            Submit
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}

interface UserFieldProps {
  label: string;
  value: string | UserRole;
  setNewUserEmail?: (email: string) => void;
  setFirstName?: (firstName: string) => void;
  setLastName?: (lastName: string) => void;
  setRole?: (role: UserRole) => void;
  setUserPassword?: (password: string) => void;
}
function UserField({
  label,
  value,
  setNewUserEmail,
  setFirstName,
  setLastName,
  setRole,
  setUserPassword,
}: UserFieldProps): React.JSX.Element {
  const fieldInput = (): React.JSX.Element => {
    switch (label) {
      case "Email":
        return (
          <Form.Control
            type="email"
            value={value}
            onChange={(e) => setNewUserEmail?.(e.target.value)}
            placeholder="Enter user email"
          />
        );
      case "First Name":
        return (
          <Form.Control
            type="text"
            value={value}
            onChange={(e) => setFirstName?.(e.target.value)}
            placeholder="Enter user first name"
          />
        );
      case "Last Name":
        return (
          <Form.Control
            type="text"
            value={value}
            onChange={(e) => setLastName?.(e.target.value)}
            placeholder="Enter user last name"
          />
        );
      case "Role":
        return (
          <Form.Select
            onChange={(e) => setRole?.(e.target.value as UserRole)}
            value={value as UserRole}
          >
            <option>{UserRole.STAFF.toUpperCase()}</option>
            <option>{UserRole.MANAGER.toUpperCase()}</option>
            <option>{UserRole.ADMINISTRATOR.toUpperCase()}</option>
          </Form.Select>
        );
      case "Password":
        return (
          <Form.Control
            type="password"
            value={value}
            onChange={(e) => setUserPassword?.(e.target.value)}
            placeholder="Enter new password"
          />
        );
      default:
        return <Form.Control type="text" value={value} readOnly />;
    }
  };

  return (
    <Form.Group as={Row} className="mb-3" controlId={`form${label}`}>
      <Form.Label>{label}:</Form.Label>
      {fieldInput()}
    </Form.Group>
  );
}
