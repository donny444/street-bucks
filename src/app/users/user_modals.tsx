"use client";

import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Alert } from "react-bootstrap";

import { AddUser, AttendUser } from "./user_fetches";
import { UserField } from "./[email]/page";

interface AttendModalProps {
  show: boolean;
  onHide: () => void;
  userEmail: string;
}
export function AttendModal({ show, onHide, userEmail }: AttendModalProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const email = userEmail;
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await AttendUser(email, password);
    if (!response) {
      setMessage("Failed to attend user.");
      setError(true);
      return;
    }

    const responseBody = response?.data;
    if (responseBody?.error) {
      setError(true);
      setMessage(responseBody.error);
      return;
    }
    if (responseBody?.message) {
      setError(false);
      setMessage(responseBody.message);
      onHide();
      window.location.reload();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>User Attendance Submission</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{message}</Alert>}
        <Form onSubmit={(e) => void handleSubmit(e)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter user email"
              value={email}
              disabled
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

interface EditorModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}
export function EditorModal({
  show,
  onHide,
  title,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
}: EditorModalProps) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => void onSubmit(e)}>
        <Modal.Body>
          <UserField label="Email" value={email} setEmail={setEmail} />
          <UserField
            label="Password"
            value={password}
            setPassword={setPassword}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

interface AddModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
}
export function AddModal({ show, onHide, title }: AddModalProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await AddUser(email, firstName, lastName, password);
    if (!response) {
      setError(true);
      setMessage("Failed to add user.");
      return;
    }

    const responseBody = response?.data;
    if (responseBody?.error) {
      setError(true);
      setMessage(responseBody.error);
      return;
    }
    if (responseBody?.message) {
      setError(false);
      setMessage(responseBody.message);
      onHide();
      window.location.reload();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => void handleAdd(e)}>
        <Modal.Body>
          {error && <Alert variant="danger">{message}</Alert>}
          <UserField label="Email" value={email} setEmail={setEmail} />
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
          <UserField
            label="Password"
            value={password}
            setPassword={setPassword}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
