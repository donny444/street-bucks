"use client";

import { Row, Form } from "react-bootstrap";

import { UserRole } from "./user_types";

interface UserFieldProps {
  label: string;
  value: string | UserRole;
  setEmail?: (email: string) => void;
  setFirstName?: (firstName: string) => void;
  setLastName?: (lastName: string) => void;
  setRole?: (role: UserRole) => void;
  setPassword?: (password: string) => void;
}
export function UserField({
  label,
  value,
  setEmail,
  setFirstName,
  setLastName,
  setRole,
  setPassword,
}: UserFieldProps): React.JSX.Element {
  const fieldInput = (): React.JSX.Element => {
    switch (label) {
      case "Email":
        return (
          <Form.Control
            type="email"
            value={value}
            onChange={(e) => setEmail?.(e.target.value)}
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
            onChange={(e) => setPassword?.(e.target.value)}
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
