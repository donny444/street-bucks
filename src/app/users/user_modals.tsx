"use client";

import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Alert } from "react-bootstrap";

import { AttendUser } from "./user_fetches";

interface AttendModalProps {
  show: boolean;
  onHide: () => void;
}
export function AttendModal({ show, onHide }: AttendModalProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await AttendUser(email, password);
    if (!response) {
      setMessage("Failed to attend user.");
      setError(true);
    }

    const responseBody = response?.data;
    if (responseBody?.error) {
      setError(true);
      setMessage(responseBody.error);
    }
    if (responseBody?.message) {
      setMessage(responseBody.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>User Attendance Submission</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{message}</Alert>}
        <Form onSubmit={() => handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="d-grid">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
