"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FetchUsersByName } from "../admin_fetches";
import { User } from "../admin_types";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Table, Badge, Form, Button, Alert } from "react-bootstrap";
import { NotifyModal } from "@/app/components/modals";

export default function UserSearchByName(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("admin-token");
    if (!adminToken) {
      router.push("/administration");
    }
  }, [router]);

  const handleSearch = async () => {
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
    if (responseBody?.found_users) {
      setUsers(responseBody.found_users);
    }
  };

  return (
    <Container className="mt-4">
      <>
        <NotifyModal
          show={notifyModal}
          onHide={() => setNotifyModal(false)}
          title="User Fetching Error"
          message={message}
        />
        <p className="h2">User Lookup</p>
        <Form onSubmit={() => handleSearch} className="d-flex mb-2">
          <Form.Control
            type="text"
            placeholder="Search users by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          <Button variant="primary" type="submit" className="w-20">
            Search
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
      </>
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
