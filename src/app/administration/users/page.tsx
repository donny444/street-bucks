"use client";

import React, { useState, useEffect } from "react";

import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Table, Badge, Form, Button, Alert } from "react-bootstrap";

import SearchIcon from "@/static/icons/search_icon.svg";

import { NotifyModal } from "@/app/components/modals";

import { FetchUsersByName } from "../admin_fetches";
import { User } from "../admin_types";

export default function UserSearchByName(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = sessionStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const fetchedUsers = await FetchUsersByName(searchTerm);
    if (!fetchedUsers) {
      setMessage("Failed to load users.");
      setError(true);
      setNotifyModal(true);
      return;
    }

    const responseBody = fetchedUsers.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
      setError(true);
      setNotifyModal(true);
    }
    if (responseBody?.message && responseBody?.found_users) {
      setMessage(responseBody.message);
      setError(false);
      setUsers(responseBody.found_users);
    }
  };

  return (
    <Container>
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="User Searching"
        message={message}
      />
      <p className="h2 text-center">User Lookup</p>
      <Form onSubmit={handleSearch} className="d-flex mb-2 gap-0">
        <Form.Control
          type="text"
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-end-0"
        />
        <Button variant="primary" type="submit" className="rounded-start-0">
          <Image
            src={SearchIcon as StaticImageData}
            alt="Search"
            width={30}
            height={30}
          />
        </Button>
      </Form>
      {error && <Alert variant="danger">{message}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>E-mail</th>
            <th>Branch ID</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length < 1 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => <FoundUserRow key={user.email} user={user} />)
          )}
        </tbody>
      </Table>
    </Container>
  );
}

function FoundUserRow({ user }: { user: User }): React.JSX.Element {
  // Role badge helper
  const roleBadge = (role: string) => {
    const variant =
      role === "ADMINISTRATOR"
        ? "danger"
        : role === "MANAGER"
          ? "warning"
          : "primary";
    return <Badge bg={variant}>{role}</Badge>;
  };

  return (
    <tr>
      <td>{user.email}</td>
      <td>{user.branchId}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{roleBadge(user.role)}</td>
    </tr>
  );
}
